import { promises as fs } from 'fs';
import path from 'path';
import { IPersistenceAdapter, MemoryStore } from '../services/memory.service';
import { Logger } from '../utils/logger';

export class FileAdapter implements IPersistenceAdapter {
    private filePath: string;
    private logger = Logger.getLogger('MemoryFileAdapter');
    private memoryCache: Map<string, MemoryStore> = new Map();
    private sessionMetadata: Map<string, { userId?: string; createdAt: Date; updatedAt: Date }> = new Map();
    private loaded: boolean = false;

    constructor(filePath?: string) {
        // Default to a file in the project root if not provided
        this.filePath = filePath || path.join(process.cwd(), 'sessions.json');
        this.loadFromFile().catch(err => {
            this.logger.error('Failed to load initial session data', err);
        });
    }

    private async loadFromFile(): Promise<void> {
        try {
            const fileExists = await fs.stat(this.filePath).then(() => true).catch(() => false);
            if (fileExists) {
                const data = await fs.readFile(this.filePath, 'utf-8');
                const json = JSON.parse(data);

                // Reconstruct Maps from JSON objects
                Object.entries(json).forEach(([id, session]: [string, any]) => {
                    const dataMap = new Map();
                    if (session.data) {
                        Object.entries(session.data).forEach(([k, v]) => dataMap.set(k, v));
                    }

                    this.memoryCache.set(id, {
                        sessionId: id,
                        data: dataMap,
                        createdAt: new Date(session.createdAt),
                        updatedAt: new Date(session.updatedAt),
                    });

                    // Store metadata for session tracking
                    this.sessionMetadata.set(id, {
                        userId: session.userId,
                        createdAt: new Date(session.createdAt),
                        updatedAt: new Date(session.updatedAt),
                    });
                });

                this.loaded = true;
                this.logger.info(`Loaded ${this.memoryCache.size} sessions from file`);
            }
        } catch (error) {
            this.logger.error('Error loading sessions from file:', error);
            // Don't crash, just start empty
        }
    }

    private async saveToFile(): Promise<void> {
        try {
            const exportable: Record<string, any> = {};
            this.memoryCache.forEach((store, id) => {
                // Convert Map to Object for JSON serialization
                const dataObj: Record<string, any> = {};
                store.data.forEach((val, key) => dataObj[key] = val);

                const metadata = this.sessionMetadata.get(id);
                exportable[id] = {
                    sessionId: store.sessionId,
                    userId: metadata?.userId,
                    data: dataObj,
                    createdAt: store.createdAt,
                    updatedAt: store.updatedAt
                };
            });

            await fs.writeFile(this.filePath, JSON.stringify(exportable, null, 2));
        } catch (error) {
            this.logger.error('Error saving sessions to file:', error);
        }
    }

    async initializeSession(sessionId: string, userId?: string): Promise<void> {
        if (!this.memoryCache.has(sessionId)) {
            const now = new Date();
            this.memoryCache.set(sessionId, {
                sessionId,
                data: new Map(),
                createdAt: now,
                updatedAt: now,
            });
            
            this.sessionMetadata.set(sessionId, {
                userId,
                createdAt: now,
                updatedAt: now,
            });
            
            await this.saveToFile();
            this.logger.info(`Memory initialized for session: ${sessionId}`, { userId });
        }
    }

    async store(sessionId: string, key: string, value: any): Promise<void> {
        if (!this.memoryCache.has(sessionId)) {
            await this.initializeSession(sessionId);
        }
        const store = this.memoryCache.get(sessionId)!;
        store.data.set(key, value);
        store.updatedAt = new Date();
        
        // Update metadata
        const metadata = this.sessionMetadata.get(sessionId);
        if (metadata) {
            metadata.updatedAt = new Date();
        }
        
        await this.saveToFile();
    }

    async retrieve(sessionId: string, key: string): Promise<any> {
        const store = this.memoryCache.get(sessionId);
        return store?.data.get(key);
    }

    async getAll(sessionId: string): Promise<Record<string, any>> {
        const store = this.memoryCache.get(sessionId);
        if (!store) return {};
        const result: Record<string, any> = {};
        store.data.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }

    async clear(sessionId: string): Promise<void> {
        this.memoryCache.delete(sessionId);
        await this.saveToFile();
        this.logger.info(`Memory cleared for session: ${sessionId}`);
    }

    async exists(sessionId: string): Promise<boolean> {
        return this.memoryCache.has(sessionId);
    }

    async pushContext(sessionId: string, agentName: string, context: Record<string, any>): Promise<void> {
        const executionHistory = (await this.retrieve(sessionId, 'executionHistory')) || [];
        executionHistory.push({
            agent: agentName,
            context,
            timestamp: new Date(),
        });
        // This calls store() which calls saveToFile()
        await this.store(sessionId, 'executionHistory', executionHistory);
    }

    async getExecutionHistory(sessionId: string): Promise<any[]> {
        return (await this.retrieve(sessionId, 'executionHistory')) || [];
    }

    /**
     * Get all sessions for a specific user
     */
    async getAllUserSessions(userId: string): Promise<any[]> {
        const sessions: any[] = [];
        
        this.memoryCache.forEach((store, sessionId) => {
            const metadata = this.sessionMetadata.get(sessionId);
            if (metadata?.userId === userId) {
                const sessionData = store.data.get('sessionData');
                sessions.push({
                    ...sessionData,
                    sessionId,
                    createdAt: metadata.createdAt,
                    updatedAt: metadata.updatedAt,
                    executionHistoryLength: store.data.get('executionHistory')?.length || 0,
                });
            }
        });
        
        return sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
}
