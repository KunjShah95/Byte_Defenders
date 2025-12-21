import { AgentRunnerService } from './agentRunner.service';
import { Logger } from '../utils/logger';
import { AgentOutput } from '../models/agentOutput.model';
import { EventBus } from '../events/eventBus';

export interface AgentTask {
    id: string;
    agentType: string;
    input: Record<string, any>;
    context?: Record<string, any>;
    name?: string;
    dependencies?: string[];
    retryCount?: number;
    maxRetries?: number;
}

export interface AgentExecutionStatus {
    sessionId: string;
    agentId: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'retrying';
    startTime?: Date;
    endTime?: Date;
    progress: number;
    message?: string;
    error?: string;
}

export interface OrchestrationConfig {
    sessionId: string;
    onStatusUpdate?: (status: AgentExecutionStatus) => void;
    onProgressUpdate?: (agentId: string, progress: number, message?: string) => void;
    maxRetries?: number;
    retryDelay?: number;
    parallelLimit?: number;
}

export class MultiAgentOrchestrator {
    private static instance: MultiAgentOrchestrator;
    private agentRunner = AgentRunnerService.getInstance();
    private eventBus = EventBus.getInstance();
    private logger = Logger.getLogger('MultiAgentOrchestrator');
    private activeSessions = new Map<string, Set<string>>(); // sessionId -> agentIds

    private constructor() { }

    static getInstance(): MultiAgentOrchestrator {
        if (!MultiAgentOrchestrator.instance) {
            MultiAgentOrchestrator.instance = new MultiAgentOrchestrator();
        }
        return MultiAgentOrchestrator.instance;
    }

    /**
     * Update agent execution status and notify listeners
     */
    private async updateStatus(
        sessionId: string, 
        agentId: string, 
        status: AgentExecutionStatus['status'],
        progress: number = 0,
        message?: string,
        error?: string
    ): Promise<void> {
        const statusUpdate: AgentExecutionStatus = {
            sessionId,
            agentId,
            status,
            progress,
            message,
            error,
            startTime: status === 'running' ? new Date() : undefined,
            endTime: ['completed', 'failed'].includes(status) ? new Date() : undefined
        };

        // Publish to event bus for real-time updates
        await this.eventBus.publish('agent:status', statusUpdate);
        
        this.logger.info(`Agent ${agentId} status updated`, { sessionId, status, progress });
    }

    /**
     * Run agents in parallel with proper orchestration
     */
    async runParallel(sessionId: string, tasks: AgentTask[], config: OrchestrationConfig): Promise<AgentOutput[]> {
        this.logger.info(`Running ${tasks.length} agents in parallel`, { sessionId });
        
        // Initialize session tracking
        this.activeSessions.set(sessionId, new Set(tasks.map(t => t.id)));

        // Update all agents to pending status
        for (const task of tasks) {
            await this.updateStatus(sessionId, task.id, 'pending', 0, `Preparing ${task.name || task.agentType}`);
        }

        const parallelLimit = config.parallelLimit || tasks.length;
        const executionPromises: Promise<AgentOutput>[] = [];

        // Execute tasks in batches to respect parallel limit
        for (let i = 0; i < tasks.length; i += parallelLimit) {
            const batch = tasks.slice(i, i + parallelLimit);
            
            const batchPromises = batch.map(task => 
                this.executeAgentWithRetry(sessionId, task, config)
            );
            
            executionPromises.push(...batchPromises);
        }

        const results = await Promise.allSettled(executionPromises);
        
        // Process results
        const outputs: AgentOutput[] = [];
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            const task = tasks[i];
            
            if (result.status === 'fulfilled') {
                outputs.push(result.value);
                await this.updateStatus(sessionId, task.id, 'completed', 100, 'Completed successfully');
            } else {
                this.logger.error(`Agent ${task.id} failed`, result.reason);
                await this.updateStatus(sessionId, task.id, 'failed', 0, undefined, String(result.reason));
                
                // Return error output instead of throwing
                outputs.push({
                    id: task.id,
                    sessionId,
                    agentName: task.name || task.agentType,
                    agentType: task.agentType,
                    input: task.input,
                    output: {},
                    timestamp: new Date(),
                    duration: 0,
                    success: false,
                    error: String(result.reason)
                } as AgentOutput);
            }
        }

        // Clean up session tracking
        this.activeSessions.delete(sessionId);
        
        this.logger.info(`Parallel execution completed`, { sessionId, successCount: outputs.filter(o => o.success).length });
        return outputs;
    }

    /**
     * Execute single agent with retry mechanism
     */
    private async executeAgentWithRetry(
        sessionId: string, 
        task: AgentTask, 
        config: OrchestrationConfig
    ): Promise<AgentOutput> {
        const maxRetries = task.maxRetries || config.maxRetries || 3;
        const retryDelay = config.retryDelay || 1000;
        let lastError: any;

        await this.updateStatus(sessionId, task.id, 'running', 0, `Starting ${task.name || task.agentType}`);

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                if (attempt > 1) {
                    await this.updateStatus(sessionId, task.id, 'retrying', 0, `Retry attempt ${attempt}/${maxRetries}`);
                    await this.delay(retryDelay * attempt); // Exponential backoff
                }

                await this.updateStatus(sessionId, task.id, 'running', 25 * attempt, `Executing ${task.name || task.agentType}`);

                const output = await this.agentRunner.executeAgent({
                    sessionId,
                    agentType: task.agentType,
                    input: task.input,
                    context: task.context
                });

                await this.updateStatus(sessionId, task.id, 'running', 90, 'Processing results');
                
                // Final status update
                await this.updateStatus(sessionId, task.id, 'completed', 100, 'Completed successfully');
                
                return output;

            } catch (error) {
                lastError = error;
                this.logger.error(`Agent ${task.id} attempt ${attempt} failed`, error);
                
                if (attempt === maxRetries) {
                    await this.updateStatus(sessionId, task.id, 'failed', 0, undefined, String(error));
                    throw error;
                }
            }
        }

        throw lastError;
    }

    /**
     * Run agents in sequence with dependency management
     */
    async runSequential(sessionId: string, tasks: AgentTask[], initialContext: Record<string, any> = {}): Promise<AgentOutput[]> {
        this.logger.info(`Running ${tasks.length} agents in sequence`, { sessionId });

        // Initialize session tracking
        this.activeSessions.set(sessionId, new Set(tasks.map(t => t.id)));

        const results: AgentOutput[] = [];
        let currentContext = { ...initialContext };

        // Check for circular dependencies
        this.validateDependencies(tasks);

        for (const task of tasks) {
            try {
                // Wait for dependencies to complete
                await this.waitForDependencies(sessionId, task.dependencies || []);

                const output = await this.executeAgentWithRetry(sessionId, task, {
                    sessionId,
                    maxRetries: task.maxRetries || 3
                });

                results.push(output);

                // Update context with this result
                if (output.success) {
                    currentContext = {
                        ...currentContext,
                        [`${task.id}_output`]: output.output,
                        lastOutput: output.output
                    };
                }
            } catch (error) {
                this.logger.error(`Sequential task ${task.id} failed`, error);
                
                // For sequential execution, we can choose to stop or continue
                // For now, we'll stop on first failure
                throw error;
            }
        }

        // Clean up session tracking
        this.activeSessions.delete(sessionId);

        return results;
    }

    /**
     * Validate task dependencies for circular references
     */
    private validateDependencies(tasks: AgentTask[]): void {
        const taskMap = new Map(tasks.map(t => [t.id, t]));
        const visited = new Set<string>();
        const recursionStack = new Set<string>();

        const dfs = (taskId: string): void => {
            if (recursionStack.has(taskId)) {
                throw new Error(`Circular dependency detected involving task ${taskId}`);
            }
            
            if (visited.has(taskId)) return;

            visited.add(taskId);
            recursionStack.add(taskId);

            const task = taskMap.get(taskId);
            if (task?.dependencies) {
                for (const depId of task.dependencies) {
                    if (taskMap.has(depId)) {
                        dfs(depId);
                    }
                }
            }

            recursionStack.delete(taskId);
        };

        for (const task of tasks) {
            dfs(task.id);
        }
    }

    /**
     * Wait for dependent agents to complete
     */
    private async waitForDependencies(sessionId: string, dependencies: string[]): Promise<void> {
        if (dependencies.length === 0) return;

        const activeAgents = this.activeSessions.get(sessionId);
        if (!activeAgents) return;

        // Check if dependencies are still active
        const pendingDeps = dependencies.filter(dep => activeAgents.has(dep));
        
        if (pendingDeps.length === 0) {
            // All dependencies completed
            return;
        }

        // Wait for dependencies to complete (with timeout)
        const startTime = Date.now();
        const timeout = 300000; // 5 minutes timeout

        while (pendingDeps.length > 0) {
            if (Date.now() - startTime > timeout) {
                throw new Error(`Timeout waiting for dependencies: ${pendingDeps.join(', ')}`);
            }

            await this.delay(100); // Check every 100ms
            const currentActive = this.activeSessions.get(sessionId);
            if (currentActive) {
                pendingDeps.splice(0, pendingDeps.length, ...pendingDeps.filter(dep => currentActive.has(dep)));
            }
        }
    }

    /**
     * Get current status of all agents in a session
     */
    async getSessionStatus(sessionId: string): Promise<AgentExecutionStatus[]> {
        // This would typically fetch from a database or cache
        // For now, return empty array - would be implemented with proper state management
        return [];
    }

    /**
     * Cancel all agents in a session
     */
    async cancelSession(sessionId: string): Promise<void> {
        this.logger.info(`Cancelling all agents for session ${sessionId}`);
        
        // Remove from active sessions
        this.activeSessions.delete(sessionId);
        
        // Publish cancellation event
        await this.eventBus.publish('session:cancelled', { sessionId });
    }

    /**
     * Get health status of orchestrator
     */
    getHealthStatus() {
        return {
            activeSessions: this.activeSessions.size,
            totalActiveAgents: Array.from(this.activeSessions.values()).reduce((sum, agents) => sum + agents.size, 0),
            uptime: process.uptime()
        };
    }

    /**
     * Utility delay function
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
