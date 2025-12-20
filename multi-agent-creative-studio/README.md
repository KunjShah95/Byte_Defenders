# Byte Defenders

A sophisticated multi-agent system for creative ideation, criticism, refinement, and presentation using TypeScript and Express.js.

## Architecture Overview

This project implements a multi-agent creative studio with the following components:

### Agents

- **Idea Agent**: Generates creative ideas based on prompts
- **Critic Agent**: Provides constructive criticism and evaluation
- **Refiner Agent**: Improves ideas based on feedback
- **Presenter Agent**: Formats final ideas for presentation

### Core Services

- **GenAI Service**: Interfaces with AI models (OpenAI, Moti, etc.)
- **Agent Runner Service**: Orchestrates agent execution
- **Memory Service**: Manages session state and context
- **Event Bus**: Enables inter-component communication

### Workflows

- **Quick Process**: Generate and provide one round of critique
- **Full Process**: Multi-iteration refinement with presentation
- **Custom Process**: User-defined agent execution steps

## Project Structure

```json
multi-agent-creative-studio/
├── apps/
│   └── backend/
│       └── src/
│           ├── agents/          # Individual agent implementations
│           ├── workflows/        # Workflow orchestration
│           ├── api/             # Express route handlers
│           ├── services/        # Core services
│           ├── models/          # Data models and interfaces
│           ├── events/          # Event bus
│           ├── utils/           # Utilities (logger, uuid)
│           ├── config.ts        # Configuration management
│           └── index.ts         # Main entry point
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Server
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# AI/GenAI Service
GENAI_API_KEY=your_api_key_here
GENAI_BASE_URL=https://api.openai.com/v1
GENAI_MODEL=gpt-4

# Moti Backend (Optional)
MOTI_API_KEY=your_moti_api_key
MOTI_BASE_URL=http://localhost:8000
MOTI_ENABLED=false

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Development

Start the development server:

```bash
npm run dev
```

### Building

Compile TypeScript to JavaScript:

```bash
npm run build
```

### Production

Run the compiled application:

```bash
npm start
```

## API Endpoints

### Session Management

#### Create Session

```json
POST /api/v1/sessions
Body: {
  "userId": "user123",
  "title": "Product Innovation Session",
  "description": "Brainstorming new features",
  "metadata": { /* optional */ }
}
```

#### Get Session

```json
GET /api/v1/sessions/{sessionId}
```

### Workflows final

#### Quick Workflow

```json
POST /api/v1/sessions/{sessionId}/workflow/quick
Body: {
  "topic": "How to make remote work more productive"
}
```

#### Full Workflow

```json
POST /api/v1/sessions/{sessionId}/workflow/full
Body: {
  "topic": "Innovation in education technology",
  "audience": "EdTech investors"
}
```

### Results & Explainability

#### Get Result

```json
GET /api/v1/sessions/{sessionId}/result
```

#### Get Explainability

```json
GET /api/v1/sessions/{sessionId}/explainability
```

## Usage Example

```typescript
const workflow = new CreativeWorkflow();

// Quick process
const result = await workflow.quickProcess(
  sessionId,
  'Mobile app for elderly care'
);

// Full process with all iterations
const fullResult = await workflow.fullProcess(sessionId, {
  topic: 'Sustainable fashion retail',
  audience: 'Impact investors'
});

// Custom process
const customResult = await workflow.customProcess(sessionId, [
  { type: 'idea', params: { topic: 'AI ethics' } },
  { type: 'critique', params: { idea: 'previous output' } },
  { type: 'refine', params: { idea: 'previous', feedback: 'feedback text' } },
]);
```

## Event System

Subscribe to workflow events:

```bash
# Server-Sent Events (SSE)
curl http://localhost:3000/api/v1/events/subscribe
```

Events published:

- `workflow:started` - Workflow initialization
- `workflow:completed` - Successful completion
- `workflow:failed` - Error occurred
- `agent:idea:completed` - Idea generation done
- `agent:critic:completed` - Criticism complete
- `agent:refiner:completed` - Refinement complete
- `agent:presenter:completed` - Presentation ready

## Configuration Options

### Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)
- `LOG_LEVEL` - Logging level (debug/info/warn/error)
- `GENAI_API_KEY` - AI service API key
- `GENAI_BASE_URL` - AI service endpoint
- `GENAI_MODEL` - Default model to use
- `MOTI_ENABLED` - Enable Moti backend integration

## Performance Considerations

- Session memory is stored in-memory; use persistent storage for production
- GenAI service calls have built-in caching at the workflow level
- Event bus supports multiple concurrent subscribers
- Agent execution is sequential; consider parallelization for certain workflows

## Security Notes

- API keys should be stored securely (use AWS Secrets Manager, HashiCorp Vault, etc.)
- Implement authentication/authorization before deployment
- Enable CORS only for trusted origins
- Use HTTPS in production
- Implement rate limiting for production deployments

## Future Enhancements

- [ ] Persistent database integration (PostgreSQL/MongoDB)
- [ ] Advanced caching with Redis
- [ ] Multi-model support with fallback mechanisms
- [ ] User authentication and authorization
- [ ] Analytics and performance monitoring
- [ ] WebSocket support for real-time updates
- [ ] Distributed workflow execution
- [ ] Advanced prompt engineering templates

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
