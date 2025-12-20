# Complete API Reference

## Base URL

```API
http://localhost:3000/api/v1
```

## Health Check

### Get Server Health

```http
GET /health
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-12-20T...",
  "uptime": 1234.56
}
```

---

## Session Management

### Create Session

```http
POST /sessions
```

**Request Body:**

```json
{
  "userId": "user123",
  "title": "Product Innovation Session",
  "description": "Optional description",
  "metadata": {
    "department": "Product",
    "priority": "high"
  }
}
```

**Required Fields:**

- `userId` (string) - User identifier
- `title` (string) - Session title

**Optional Fields:**

- `description` (string) - Session description
- `metadata` (object) - Custom metadata

**Response (201 Created):**

```json
{
  "id": "session_550e8400e29b41d4a716446655440000",
  "userId": "user123",
  "title": "Product Innovation Session",
  "description": "Optional description",
  "status": "active",
  "createdAt": "2025-12-20T10:30:00Z",
  "updatedAt": "2025-12-20T10:30:00Z",
  "progress": 0,
  "currentAgent": "waiting",
  "metadata": { ... }
}
```

---

### Get Session Details

```http
GET /sessions/{sessionId}
```

**Path Parameters:**

- `sessionId` (string) - Session ID from create response

**Response (200 OK):**

```json
{
  "id": "session_...",
  "userId": "user123",
  "title": "Product Innovation Session",
  "status": "active",
  "createdAt": "2025-12-20T10:30:00Z",
  "updatedAt": "2025-12-20T10:35:00Z",
  "progress": 50,
  "currentAgent": "critic",
  "executionHistoryLength": 2,
  "currentProgress": 50,
  "memorySnapshot": {
    "hasInitialIdea": true,
    "hasCriticisms": true,
    "hasRefinedIdea": false,
    "hasPresentation": false
  }
}
```

---

## Workflow Execution

### Run Quick Workflow

```http
POST /sessions/{sessionId}/workflow/quick
```

**Request Body:**

```json
{
  "topic": "How to improve remote team productivity"
}
```

**Required Fields:**

- `topic` (string) - Topic for idea generation

**Response (200 OK):**

```json
{
  "sessionId": "session_...",
  "initialIdea": {
    "id": "output_...",
    "sessionId": "session_...",
    "agentName": "Idea Generator",
    "agentType": "idea",
    "input": { ... },
    "output": {
      "text": "Here's an innovative idea...",
      "metadata": { ... }
    },
    "reasoning": "...",
    "timestamp": "2025-12-20T10:30:00Z",
    "duration": 2345,
    "success": true
  },
  "criticisms": [
    {
      "id": "output_...",
      "agentName": "Critic",
      "agentType": "critic",
      "output": { ... },
      ...
    }
  ],
  "refinedIdea": {
    "agentName": "Refiner",
    ...
  },
  "executionHistory": [ ... ],
  "totalDuration": 8900
}
```

---

### Run Full Workflow

```http
POST /sessions/{sessionId}/workflow/full
```

**Request Body:**

```json
{
  "topic": "Sustainable Fashion E-commerce Platform",
  "audience": "Impact Investors"
}
```

**Optional Fields:**

- `audience` (string) - Target audience (default: "general")

**Response (200 OK):**

```json
{
  "sessionId": "session_...",
  "initialIdea": { ... },
  "criticisms": [ ... ],
  "refinedIdea": { ... },
  "presentation": {
    "agentName": "Presenter",
    "agentType": "presenter",
    "output": {
      "text": "Final presentation structure...",
      ...
    }
  },
  "executionHistory": [ ... ],
  "totalDuration": 25000
}
```

---

## Results & Analytics

### Get Session Results

```http
GET /sessions/{sessionId}/result
```

**Response (200 OK):**

```json
{
  "sessionId": "session_...",
  "initialIdea": { ... },
  "criticisms": [ ... ],
  "refinedIdea": { ... },
  "presentation": { ... },
  "refinementIterations": [ ... ],
  "executionHistory": [ ... ],
  "summary": {
    "hasInitialIdea": true,
    "hasCriticisms": true,
    "hasRefinedIdea": true,
    "hasPresentation": true,
    "refinementCount": 2
  }
}
```

---

### Get Explainability Data

```http
GET /sessions/{sessionId}/explainability
```

**Response (200 OK):**

```json
{
  "sessionId": "session_...",
  "agentExecutions": [
    {
      "agentName": "Idea Generator",
      "agentType": "idea",
      "input": { "topic": "...", ... },
      "output": { "text": "...", ... },
      "reasoning": "Generated based on topic and constraints...",
      "duration": 2345
    },
    {
      "agentName": "Critic",
      "agentType": "critic",
      "input": { ... },
      "output": { ... },
      "reasoning": "...",
      "duration": 1890
    },
    ...
  ],
  "scoreBreakdown": {
    "Idea Generator": {
      "metrics": {
        "creativity": 85,
        "originality": 80,
        "clarity": 75
      },
      "overallScore": 80
    },
    "Critic": {
      "metrics": {
        "thoroughness": 90,
        "fairness": 85,
        "constructiveness": 80
      },
      "overallScore": 85
    },
    ...
  },
  "decisionPath": [
    "Idea Generator: Processed and generated output",
    "Critic: Processed and generated output",
    "Refiner: Processed and generated output",
    "Presenter: Processed and generated output"
  ],
  "recommendations": [
    "Address the criticisms mentioned in the review phase",
    "Consider implementing the refinements in the next iteration",
    "Use the generated presentation for stakeholder communication",
    "Gather feedback from stakeholders to validate the final idea"
  ]
}
```

---

## Prompt Management

### Get Prompt Statistics

```http
GET /prompts/stats
```

**Response (200 OK):**

```json
{
  "totalAgents": 4,
  "totalTemplates": 16,
  "agentBreakdown": {
    "idea": 4,
    "critic": 4,
    "refiner": 4,
    "presenter": 5
  }
}
```

---

### Get Available Templates

```http
GET /prompts/{agentType}/templates
```

**Path Parameters:**

- `agentType` (string) - Agent type: `idea`, `critic`, `refiner`, `presenter`

**Response (200 OK):**

```json
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
    {
      "id": "domainSpecific",
      "name": "Domain-Specific Innovation",
      "temperature": 0.75,
      "maxTokens": 1800
    },
    {
      "id": "userCentric",
      "name": "User-Centric Innovation",
      "temperature": 0.8,
      "maxTokens": 1600
    }
  ],
  "totalCount": 4
}
```

---

### Get Recommended Template

```http
GET /prompts/{agentType}/recommended
```

**Path Parameters:**

- `agentType` (string) - Agent type

**Query Parameters (Optional):**

- `audience` (string) - Target audience (e.g., "Executive")
- `constraints` (string) - Comma-separated constraints
- `feedback` (string) - Feedback context

**Response (200 OK):**

```json
{
  "agentType": "presenter",
  "recommendedTemplate": "executive"
}
```

---

### Build Custom Prompt

```http
POST /prompts/build
```

**Query Parameters (Optional):**

- `dynamicAdjustment` (boolean) - Enable dynamic adjustment (true/false)

**Request Body:**

```json
{
  "agentType": "idea",
  "template": "creative",
  "context": {
    "topic": "AI in Education",
    "count": 3,
    "constraints": ["Budget < $100K", "6-month timeline"],
    "requirements": ["Must be scalable", "Must support mobile"],
    "audience": "EdTech startups"
  }
}
```

**Required Fields:**

- `agentType` (string) - One of: `idea`, `critic`, `refiner`, `presenter`
- `template` (string) - Template ID from templates endpoint
- `context` (object) - Context variables for prompt

**Response (200 OK):**

```json
{
  "systemPrompt": "You are a visionary creative ideator...",
  "userPrompt": "Topic: AI in Education\n\nContext:\n- count: 3\n- constraints: Budget < $100K, 6-month timeline\n...",
  "temperature": 0.95,
  "maxTokens": 2100
}
```

**Error Response (400 Bad Request):**

```json
{
  "error": "Invalid prompt configuration",
  "details": [
    "Unknown template 'invalid' for agent 'idea'",
    "Context is required"
  ]
}
```

---

### Export All Prompts

```http
GET /prompts/export/all
```

**Response (200 OK):**

```json
{
  "format": "complete_prompt_library",
  "exportedAt": "2025-12-20T10:30:00Z",
  "prompts": {
    "idea": {
      "creative": {
        "name": "Creative Ideation",
        "systemPrompt": "...",
        "userPromptTemplate": "...",
        "temperature": 0.9,
        "maxTokens": 2000,
        "examples": [ ... ]
      },
      "brainstorm": { ... },
      ...
    },
    "critic": { ... },
    "refiner": { ... },
    "presenter": { ... }
  }
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Error message",
  "details": "Additional context"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found",
  "path": "/api/v1/sessions/invalid-id"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal Server Error",
  "details": "Error details (development only)"
}
```

---

## Response Formats

### Agent Output Format

```json
{
  "id": "output_...",
  "sessionId": "session_...",
  "agentName": "Agent Name",
  "agentType": "idea|critic|refiner|presenter",
  "input": {
    "topic": "...",
    "constraints": [ ... ]
  },
  "output": {
    "text": "Generated content...",
    "metadata": {
      "model": "gpt-4",
      "provider": "openai",
      "tokensUsed": 500
    }
  },
  "reasoning": "Reasoning behind output...",
  "timestamp": "2025-12-20T10:30:00Z",
  "duration": 2345,
  "success": true
}
```

### Context Variables

#### Idea Agent Context

- `topic` (string, required) - Topic for idea generation
- `count` (number) - Number of ideas to generate
- `constraints` (string[]) - List of constraints
- `requirements` (string[]) - Specific requirements
- `audience` (string) - Target audience

#### Critic Agent Context

- `idea` (string, required) - Idea to critique
- `resources` (string) - Available resources
- `timeline` (string) - Project timeline
- `market` (string) - Target market
- `criteria` (string[]) - Evaluation criteria

#### Refiner Agent Context

- `originalIdea` (string, required) - Initial idea
- `feedback` (string) - Feedback to address
- `iteration` (number) - Iteration number
- `previousContext` (object) - Previous iteration context

#### Presenter Agent Context

- `idea` (string, required) - Idea to present
- `duration` (string) - Presentation duration
- `audience` (string) - Target audience
- `style` (string) - Presentation style

---

## Rate Limiting

All endpoints are subject to rate limiting:

- **Window**: 15 minutes (configurable)
- **Max Requests**: 100 per window (configurable)
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Authentication

Currently unauthenticated. For production, implement:

- JWT tokens
- API key validation
- OAuth 2.0

---

## CORS

Configured origins:

- `http://localhost:3000` (development)
- Add more in `.env` `CORS_ORIGIN`

---

## Examples

### cURL - Create and Run Workflow

```bash
# 1. Create session
SESSION=$(curl -s -X POST http://localhost:3000/api/v1/sessions \
  -H "Content-Type: application/json" \
  -d '{"userId":"user1","title":"Innovation"}' | jq -r '.id')

# 2. Run quick workflow
curl -X POST http://localhost:3000/api/v1/sessions/$SESSION/workflow/quick \
  -H "Content-Type: application/json" \
  -d '{"topic":"AI in Healthcare"}'

# 3. Get results
curl http://localhost:3000/api/v1/sessions/$SESSION/result
```

### Python - Full Workflow

```python
import requests
import json

base = "http://localhost:3000/api/v1"

# Create session
s = requests.post(f"{base}/sessions", json={
    "userId": "user1",
    "title": "Session"
}).json()

# Run workflow
result = requests.post(
    f"{base}/sessions/{s['id']}/workflow/full",
    json={"topic": "Topic", "audience": "Investors"}
).json()

# Get explainability
explain = requests.get(
    f"{base}/sessions/{s['id']}/explainability"
).json()

print(json.dumps(explain, indent=2))
```

---

## Changelog

### Version 1.0.0

- Initial release
- 4 agents (Idea, Critic, Refiner, Presenter)
- 16 prompt templates
- Google & OpenAI integration
- 11 API endpoints
- Complete documentation

---

## Support

For issues and questions:

1. Check `QUICKSTART.md` for common problems
2. Review `PROMPTS.md` for prompt-specific questions
3. See `DEVELOPMENT.md` for architecture questions
