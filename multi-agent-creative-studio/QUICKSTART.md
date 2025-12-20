# Integration & Quick Start Guide

## Installation & Setup

### 1. Prerequisites

- Node.js 18+
- npm or yarn
- Google API Key (for Gemini models) or OpenAI API Key

### 2. Installation

```bash
cd multi-agent-creative-studio
npm install
```

### 3. Environment Configuration

```bash
# Copy example env
cp .env.example .env

# Edit .env with your API keys
```

**Required Environment Variables:**

```env
# Choose your AI Provider
GENAI_PROVIDER=openai              # or 'google', 'mock'

# For OpenAI
OPENAI_API_KEY=sk-...
GENAI_MODEL=gpt-4

# For Google Gemini
GOOGLE_API_KEY=AIza...
```

### 4. Start Development Server

```bash
npm run dev
```

Server will be available at `http://localhost:3000`

## API Quick Start Examples

### 1. Create a Creative Session

```bash
curl -X POST http://localhost:3000/api/v1/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "title": "Product Innovation Session",
    "description": "Brainstorming new product features"
  }'

# Response:
{
  "id": "session_abc123...",
  "userId": "user123",
  "title": "Product Innovation Session",
  "status": "active",
  "createdAt": "2025-12-20T...",
  "updatedAt": "2025-12-20T...",
  "progress": 0,
  "currentAgent": "waiting"
}
```

### 2. Explore Available Prompts

```bash
# Get all templates for Idea agent
curl http://localhost:3000/api/v1/prompts/idea/templates

# Response:
{
  "agentType": "idea",
  "templates": [
    {
      "id": "creative",
      "name": "Creative Ideation",
      "temperature": 0.9,
      "maxTokens": 2000
    },
    {
      "id": "brainstorm",
      "name": "Rapid Brainstorming",
      "temperature": 0.95,
      "maxTokens": 1500
    },
    ...
  ],
  "totalCount": 4
}
```

### 3. Get Recommended Template

```bash
curl "http://localhost:3000/api/v1/prompts/presenter/recommended?audience=Executive"

# Response:
{
  "agentType": "presenter",
  "recommendedTemplate": "executive"
}
```

### 4. Build Custom Prompt

```bash
curl -X POST http://localhost:3000/api/v1/prompts/build \
  -H "Content-Type: application/json" \
  -d '{
    "agentType": "idea",
    "template": "creative",
    "context": {
      "topic": "AI in Education",
      "count": 3,
      "constraints": ["Budget < $100K", "Team of 5"],
      "audience": "EdTech startups"
    },
    "dynamicAdjustment": true
  }'

# Response:
{
  "systemPrompt": "You are a visionary creative ideator...",
  "userPrompt": "Topic: AI in Education\nConstraints: ...",
  "temperature": 0.95,
  "maxTokens": 2100
}
```

### 5. Run Quick Workflow

```bash
curl -X POST http://localhost:3000/api/v1/sessions/session_abc123/workflow/quick \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "How to improve remote team productivity"
  }'

# Response includes:
{
  "sessionId": "session_abc123",
  "initialIdea": { /* agent output */ },
  "criticisms": [ /* critic analysis */ ],
  "refinedIdea": { /* refined version */ },
  "executionHistory": [ /* all steps */ ],
  "totalDuration": 15432
}
```

### 6. Run Full Workflow

```bash
curl -X POST http://localhost:3000/api/v1/sessions/session_abc123/workflow/full \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Sustainable Fashion E-commerce Platform",
    "audience": "Impact Investors"
  }'
```

### 7. Get Results

```bash
curl http://localhost:3000/api/v1/sessions/session_abc123/result

# Response:
{
  "sessionId": "session_abc123",
  "initialIdea": { ... },
  "criticisms": [ ... ],
  "refinedIdea": { ... },
  "presentation": { ... },
  "summary": {
    "hasInitialIdea": true,
    "hasCriticisms": true,
    "hasRefinedIdea": true,
    "hasPresentation": true,
    "refinementCount": 2
  }
}
```

### 8. Get Explainability

```bash
curl http://localhost:3000/api/v1/sessions/session_abc123/explainability

# Response:
{
  "sessionId": "session_abc123",
  "agentExecutions": [
    {
      "agentName": "Idea Generator",
      "agentType": "idea",
      "input": { ... },
      "output": { ... },
      "reasoning": "...",
      "duration": 2345
    },
    ...
  ],
  "scoreBreakdown": { ... },
  "decisionPath": [ ... ],
  "recommendations": [ ... ]
}
```

## Python Client Example

```python
import requests
import json

BASE_URL = "http://localhost:3000/api/v1"

class CreativeStudioClient:
    def __init__(self, base_url=BASE_URL):
        self.base_url = base_url
    
    def create_session(self, user_id, title, description=""):
        response = requests.post(
            f"{self.base_url}/sessions",
            json={
                "userId": user_id,
                "title": title,
                "description": description
            }
        )
        return response.json()
    
    def run_quick_workflow(self, session_id, topic):
        response = requests.post(
            f"{self.base_url}/sessions/{session_id}/workflow/quick",
            json={"topic": topic}
        )
        return response.json()
    
    def run_full_workflow(self, session_id, topic, audience="general"):
        response = requests.post(
            f"{self.base_url}/sessions/{session_id}/workflow/full",
            json={"topic": topic, "audience": audience}
        )
        return response.json()
    
    def get_result(self, session_id):
        response = requests.get(f"{self.base_url}/sessions/{session_id}/result")
        return response.json()
    
    def get_explainability(self, session_id):
        response = requests.get(f"{self.base_url}/sessions/{session_id}/explainability")
        return response.json()
    
    def get_available_prompts(self, agent_type):
        response = requests.get(f"{self.base_url}/prompts/{agent_type}/templates")
        return response.json()
    
    def build_prompt(self, agent_type, template, context, dynamic=True):
        response = requests.post(
            f"{self.base_url}/prompts/build",
            json={
                "agentType": agent_type,
                "template": template,
                "context": context,
                "dynamicAdjustment": dynamic
            }
        )
        return response.json()

# Usage
client = CreativeStudioClient()

# Create session
session = client.create_session("user1", "AI Innovation Session")
session_id = session["id"]

# Explore prompts
ideas_prompts = client.get_available_prompts("idea")
print(f"Available idea templates: {len(ideas_prompts['templates'])}")

# Run workflow
result = client.run_quick_workflow(session_id, "How to revolutionize customer service")

# Get results
final = client.get_result(session_id)
print(json.dumps(final, indent=2))
```

## JavaScript/TypeScript Client Example

```typescript
import axios from 'axios';

const baseURL = 'http://localhost:3000/api/v1';

interface SessionConfig {
  userId: string;
  title: string;
  description?: string;
}

async function createCreativeSession(config: SessionConfig) {
  const response = await axios.post(`${baseURL}/sessions`, config);
  return response.data;
}

async function runQuickWorkflow(sessionId: string, topic: string) {
  const response = await axios.post(
    `${baseURL}/sessions/${sessionId}/workflow/quick`,
    { topic }
  );
  return response.data;
}

async function buildCustomPrompt(
  agentType: string,
  template: string,
  context: Record<string, any>
) {
  const response = await axios.post(`${baseURL}/prompts/build`, {
    agentType,
    template,
    context,
    dynamicAdjustment: true,
  });
  return response.data;
}

async function getResults(sessionId: string) {
  const response = await axios.get(`${baseURL}/sessions/${sessionId}/result`);
  return response.data;
}

// Usage
async function main() {
  // Create session
  const session = await createCreativeSession({
    userId: 'user123',
    title: 'Innovation Workshop',
    description: 'Brainstorming new product ideas',
  });

  console.log('Created session:', session.id);

  // Run workflow
  const result = await runQuickWorkflow(
    session.id,
    'How to improve e-commerce checkout experience'
  );

  console.log('Workflow completed:', result);

  // Get final results
  const finalResults = await getResults(session.id);
  console.log('Final results:', finalResults);
}

main().catch(console.error);
```

## Postman Collection

Import this into Postman for testing:

```json
{
  "info": {
    "name": "Creative Studio API",
    "version": "1.0"
  },
  "item": [
    {
      "name": "Create Session",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/sessions",
        "body": {
          "mode": "raw",
          "raw": "{\"userId\": \"user1\", \"title\": \"Session 1\"}"
        }
      }
    },
    {
      "name": "Get Available Prompts",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/prompts/{{agentType}}/templates"
      }
    },
    {
      "name": "Quick Workflow",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/sessions/{{sessionId}}/workflow/quick",
        "body": {"mode": "raw", "raw": "{\"topic\": \"Your topic here\"}"}
      }
    },
    {
      "name": "Get Result",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/sessions/{{sessionId}}/result"
      }
    }
  ]
}
```

## Development Workflow

### 1. Adding Custom Prompts

Edit `src/prompts/templates.ts`:

```typescript
export const customAgentPrompts = {
  myTemplate: {
    name: 'My Custom Template',
    systemPrompt: 'Your system instructions...',
    userPromptTemplate: 'Template with {variables}...',
    temperature: 0.75,
    maxTokens: 1500,
  },
};
```

### 2. Testing Agents

```bash
npm run dev
# Make API calls to test endpoints
```

### 3. Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### API Key Issues

```json
Error: OPENAI_API_KEY not configured
```

Solution: Set `OPENAI_API_KEY` in `.env`

```json
Error: Google AI not initialized
```

Solution: Set `GOOGLE_API_KEY` in `.env` and `GENAI_PROVIDER=google`

### TypeScript Errors

```bash
npm run type-check    # Find TypeScript errors
npm run lint -- --fix # Fix linting issues
```

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti :3000 | xargs kill -9
```

## Next Steps

1. **Explore Prompts**: Try different agent templates and contexts
2. **Custom Workflows**: Extend CreativeWorkflow for custom processes
3. **Integrate Services**: Connect to databases, message queues, etc.
4. **Add Auth**: Implement user authentication and authorization
5. **Deploy**: Containerize and deploy to your infrastructure

## Documentation Links

- [Prompts Guide](./PROMPTS.md) - Comprehensive prompt documentation
- [Development Guide](./DEVELOPMENT.md) - Development best practices
- [README](./README.md) - Project overview
