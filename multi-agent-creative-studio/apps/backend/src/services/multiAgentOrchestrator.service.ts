
import { AgentRunnerService } from './agentRunner.service';
import { Logger } from '../utils/logger';
import { AgentOutput } from '../models/agentOutput.model';

export interface AgentTask {
    id: string;
    agentType: string;
    input: Record<string, any>;
    context?: Record<string, any>;
    name?: string;
}

export class MultiAgentOrchestrator {
    private static instance: MultiAgentOrchestrator;
    private agentRunner = AgentRunnerService.getInstance();
    private logger = Logger.getLogger('MultiAgentOrchestrator');

    private constructor() { }

    static getInstance(): MultiAgentOrchestrator {
        if (!MultiAgentOrchestrator.instance) {
            MultiAgentOrchestrator.instance = new MultiAgentOrchestrator();
        }
        return MultiAgentOrchestrator.instance;
    }

    /**
     * Run agents in parallel
     */
    async runParallel(sessionId: string, tasks: AgentTask[]): Promise<AgentOutput[]> {
        this.logger.info(`Running ${tasks.length} agents in parallel`, { sessionId });

        const promises = tasks.map(task =>
            this.agentRunner.executeAgent({
                sessionId,
                agentType: task.agentType,
                input: task.input,
                context: task.context
            }).catch(error => {
                this.logger.error(`Error in parallel task ${task.id}`, error);
                return {
                    id: task.id,
                    sessionId,
                    agentName: task.name || task.agentType,
                    agentType: task.agentType, // Type assertion handled by runner
                    input: task.input,
                    output: {},
                    timestamp: new Date(),
                    duration: 0,
                    success: false,
                    error: String(error)
                } as AgentOutput;
            })
        );

        return Promise.all(promises);
    }

    /**
     * Run agents in sequence (chain)
     * The output of previous agent is merged into context of next agent
     */
    async runSequential(sessionId: string, tasks: AgentTask[], initialContext: Record<string, any> = {}): Promise<AgentOutput[]> {
        this.logger.info(`Running ${tasks.length} agents in sequence`, { sessionId });

        const results: AgentOutput[] = [];
        let currentContext = { ...initialContext };

        for (const task of tasks) {
            try {
                const output = await this.agentRunner.executeAgent({
                    sessionId,
                    agentType: task.agentType,
                    input: task.input,
                    context: {
                        ...task.context,
                        ...currentContext,
                        previousResults: results.map(r => r.output)
                    }
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
                this.logger.error(`Error in sequential task ${task.id}`, error);
                throw error; // Stop sequence on error? Or continue? For now throw.
            }
        }

        return results;
    }
}
