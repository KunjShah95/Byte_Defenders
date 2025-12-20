# Multi-Agent Creative Studio - Development Guide

## Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment**

   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

   The server will be available at `http://localhost:3000`

## Development Workflow

### Creating a New Agent

1. Create a new file in `src/agents/` (e.g., `newagent.agent.ts`)
2. Implement the agent class extending the pattern used in existing agents
3. Register the agent in `AgentRunnerService.initializeDefaultAgents()`
4. Export from `src/agents/index.ts`

Example:

```typescript
export class MyAgent {
  private agentRunner = AgentRunnerService.getInstance();
  
  async execute(sessionId: string, input: string) {
    const request = {
      sessionId,
      agentType: 'myagent' as const,
      input: { query: input }
    };
    return await this.agentRunner.executeAgent(request);
  }
}
```

### Adding New API Endpoints

1. Create handler file in `src/api/`
2. Import and add route in `src/index.ts`
3. Ensure proper error handling and logging

### Working with Memory Service

```typescript
const memoryService = MemoryService.getInstance();

// Initialize session
memoryService.initializeSession(sessionId);

// Store data
memoryService.store(sessionId, 'myKey', data);

// Retrieve data
const data = memoryService.retrieve(sessionId, 'myKey');

// Get all session data
const allData = memoryService.getAll(sessionId);

// Push execution context
memoryService.pushContext(sessionId, 'AgentName', { /* context */ });
```

### Event Bus Usage

```typescript
const eventBus = EventBus.getInstance();

// Subscribe to events
const unsubscribe = eventBus.subscribe('workflow:completed', (data) => {
  console.log('Workflow completed:', data);
});

// Publish events
await eventBus.publish('custom:event', { data: 'value' });

// Unsubscribe
unsubscribe();
```

## Testing the API

### Using cURL

```bash
# Create session
curl -X POST http://localhost:3000/api/v1/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "title": "Test Session",
    "description": "Testing the API"
  }'

# Get session
curl http://localhost:3000/api/v1/sessions/session_xxxxx

# Run quick workflow
curl -X POST http://localhost:3000/api/v1/sessions/session_xxxxx/workflow/quick \
  -H "Content-Type: application/json" \
  -d '{"topic": "AI in Healthcare"}'

# Get result
curl http://localhost:3000/api/v1/sessions/session_xxxxx/result

# Get explainability
curl http://localhost:3000/api/v1/sessions/session_xxxxx/explainability
```

### Using Postman

1. Import the API endpoints into Postman
2. Set up environment variables for `sessionId` and `baseUrl`
3. Create a collection of requests for testing

## Docker Development

Run with Docker Compose:

```bash
docker-compose up
```

This will:
on

- Start the backend service on port 3000
- Enable hot-reload with volume mounting
- Support optional services (Redis, PostgreSQL) if uncommented

## Debugging

### Enable Debug Logging

```bash
LOG_LEVEL=debug npm run dev
```

### VS Code Debugging

1. Add debug configuration to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Launch Backend",
  "program": "${workspaceFolder}/node_modules/.bin/ts-node",
  "args": ["apps/backend/src/index.ts"],
  "cwd": "${workspaceFolder}",
  "protocol": "inspector"
}
```

1. Press F5 to start debugging

## Performance Optimization

### For Development

- Use hot-reload with `npm run dev`
- Enable source maps for better debugging
- Keep logs at `info` level for clarity

### For Production

- Run `npm run build` then `npm start`
- Set `NODE_ENV=production`
- Set `LOG_LEVEL=warn` or `error`
- Use external caching (Redis)
- Consider database persistence instead of in-memory

## Common Issues

### Port Already in Use

```bash
# Find and kill process on port 3000
lsof -ti :3000 | xargs kill -9
```

### Module Not Found

```bash
# Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Compilation Errors

```bash
# Check types
npm run type-check

# Fix with ESLint
npm run lint -- --fix
```

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Pino Logger Documentation](https://getpino.io/)
