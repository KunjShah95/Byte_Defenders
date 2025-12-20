# Advanced Prompt Engineering System

## Overview

The Multi-Agent Creative Studio includes a sophisticated prompt engineering system that manages prompts for all agent types with support for multiple templates, dynamic adjustment, and context-aware optimization.

## Architecture

### Components

1. **Prompt Templates** (`src/prompts/templates.ts`)
   - Centralized repository of prompt templates
   - Organized by agent type (Idea, Critic, Refiner, Presenter)
   - Multiple templates per agent with specific purposes

2. **Prompt Manager Service** (`src/services/promptManager.service.ts`)
   - Builds and optimizes prompts
   - Manages template selection and context filling
   - Provides dynamic parameter adjustment

3. **Prompts API** (`src/api/prompts.ts`)
   - REST endpoints for prompt management
   - Template discovery and exploration
   - Prompt building and recommendation

## Supported Agents & Templates

### Idea Agent

#### 1. **Creative** (Default)

- **Purpose**: Generate innovative, original ideas
- **Temperature**: 0.9 (High creativity)
- **Max Tokens**: 2000
- **Best For**: Novel ideation, brainstorming sessions
- **Context Variables**: topic, count, constraints, requirements, audience

Example:

```bash
POST /api/v1/prompts/build
{
  "agentType": "idea",
  "template": "creative",
  "context": {
    "topic": "Remote work productivity tools",
    "count": 3,
    "constraints": ["Budget under $100K", "6-month timeline"],
    "audience": "Small business owners"
  }
}
```

#### 2. **Brainstorm**

- **Purpose**: Rapid ideation with quantity focus
- **Temperature**: 0.95 (Maximum creativity)
- **Max Tokens**: 1500
- **Best For**: Quick ideation, wild ideas, rapid prototyping
- **Context Variables**: topic, context

#### 3. **Domain-Specific**

- **Purpose**: Expert-level ideas within specific domain
- **Temperature**: 0.75
- **Max Tokens**: 1800
- **Best For**: Industry-specific innovation, technical solutions
- **Context Variables**: domain, topic, marketContext

Example:

```bash
{
  "agentType": "idea",
  "template": "domainSpecific",
  "context": {
    "domain": "FinTech",
    "topic": "Payment gateway security",
    "marketContext": "Rising fraud rates, regulations tightening"
  }
}
```

#### 4. **User-Centric**

- **Purpose**: Solutions focused on user needs
- **Temperature**: 0.8
- **Max Tokens**: 1600
- **Best For**: User research-driven innovation
- **Context Variables**: userProfile, problem, context

### Critic Agent

#### 1. **Thorough** (Default)

- **Purpose**: Comprehensive idea critique
- **Temperature**: 0.7
- **Max Tokens**: 1600
- **Evaluates**: Novelty, feasibility, market viability, user value, scalability, differentiation
- **Best For**: Full-spectrum analysis, decision making
- **Context Variables**: idea, context

#### 2. **Feasibility**

- **Purpose**: Implementation feasibility assessment
- **Temperature**: 0.6 (Lower - more critical)
- **Max Tokens**: 1400
- **Best For**: Technical validation, resource planning
- **Context Variables**: idea, resources, timeline

Example:

```bash
{
  "agentType": "critic",
  "template": "feasibility",
  "context": {
    "idea": "AI-powered customer service chatbot",
    "resources": "3 engineers, $50K budget",
    "timeline": "3 months"
  }
}
```

#### 3. **Market Analysis**

- **Purpose**: Business and market viability
- **Temperature**: 0.7
- **Max Tokens**: 1500
- **Best For**: Market opportunity assessment
- **Context Variables**: idea, market, businessModel

#### 4. **Risk Analysis**

- **Purpose**: Identify risks and challenges
- **Temperature**: 0.65 (Conservative)
- **Max Tokens**: 1400
- **Best For**: Risk management, mitigation planning

### Refiner Agent

#### 1. **Improvement** (Default)

- **Purpose**: Address weaknesses and enhance strengths
- **Temperature**: 0.75
- **Max Tokens**: 1800
- **Best For**: Single refinement round
- **Context Variables**: originalIdea, feedback

#### 2. **Iterative**

- **Purpose**: Progressive improvement across iterations
- **Temperature**: 0.75
- **Max Tokens**: 1700
- **Best For**: Multi-round refinement
- **Context Variables**: idea, iteration, previousContext

#### 3. **Synthesis**

- **Purpose**: Combine multiple ideas
- **Temperature**: 0.8
- **Max Tokens**: 1900
- **Best For**: Merging approaches, creating unified solutions
- **Context Variables**: ideas (comma-separated)

#### 4. **Specification**

- **Purpose**: Detailed implementation specification
- **Temperature**: 0.6
- **Max Tokens**: 2000
- **Best For**: Technical planning, documentation
- **Context Variables**: idea, goals

### Presenter Agent

#### 1. **Executive Summary**

- **Purpose**: Concise business-focused summary
- **Temperature**: 0.7
- **Max Tokens**: 1200
- **Best For**: C-suite presentations, quick pitches
- **Context Variables**: idea, audience, context

#### 2. **Detailed** (Default)

- **Purpose**: Comprehensive presentation structure
- **Temperature**: 0.75
- **Max Tokens**: 2000
- **Best For**: Full presentations, stakeholder engagement
- **Context Variables**: idea, duration, audience

#### 3. **Talking Points**

- **Purpose**: Key messages and Q&A prep
- **Temperature**: 0.75
- **Max Tokens**: 1600
- **Best For**: Speaking preparation, stakeholder communication

#### 4. **Pitch**

- **Purpose**: Concise elevator pitch
- **Temperature**: 0.8
- **Max Tokens**: 600
- **Best For**: Quick pitches, investor meetings
- **Context Variables**: idea, duration, audience

#### 5. **Visual Outline**

- **Purpose**: Visual presentation structure
- **Temperature**: 0.75
- **Max Tokens**: 1400
- **Best For**: Design planning, visual communication

## API Endpoints

### Get Available Templates

```bash
GET /api/v1/prompts/{agentType}/templates

Response:
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

### Get Prompt Statistics

```bash
GET /api/v1/prompts/stats

Response:
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

### Build Optimized Prompt

```bash
POST /api/v1/prompts/build

Request:
{
  "agentType": "idea",
  "template": "creative",
  "context": {
    "topic": "Sustainable packaging",
    "count": 3,
    "constraints": ["Biodegradable", "Cost-effective"],
    "audience": "Eco-conscious brands"
  },
  "dynamicAdjustment": true
}

Response:
{
  "systemPrompt": "You are a visionary creative ideator...",
  "userPrompt": "Topic: Sustainable packaging\nConstraints: ...",
  "temperature": 0.95,
  "maxTokens": 2100
}
```

### Get Recommended Template

```bash
GET /api/v1/prompts/{agentType}/recommended?audience=Executive&constraints=budget,timeline

Response:
{
  "agentType": "presenter",
  "recommendedTemplate": "executive"
}
```

### Export All Prompts

```bash
GET /api/v1/prompts/export/all

Response:
{
  "format": "complete_prompt_library",
  "exportedAt": "2025-12-20T...",
  "prompts": {
    "idea": { ... },
    "critic": { ... },
    ...
  }
}
```

## Dynamic Parameter Adjustment

The Prompt Manager automatically adjusts parameters based on context:

### Creativity Adjustments

- **Idea Agent + Constraints**: Temperature +0.1 (max 1.0)
- **Critic Agent**: Temperature -0.1 (min 0.5)
- **Refiner Agent + Complex Feedback**: Tokens x1.2

### Audience-Based Adjustments

- **Executive/C-level**: Tokens x0.8 (concise)
- **Technical/Engineering**: Tokens x1.1 (detailed)

### Examples

#### Example 1: Executive Presentation

```javascript
const prompt = promptManager.buildOptimizedPrompt({
  agentType: 'presenter',
  templateName: 'executive',
  context: {
    idea: 'AI-powered predictive maintenance platform',
    audience: 'C-level executives',
  },
  dynamicAdjustment: true,
});
// Result: ~960 tokens (1200 x 0.8)
```

#### Example 2: Creative Ideation with Constraints

```javascript
const prompt = promptManager.buildOptimizedPrompt({
  agentType: 'idea',
  templateName: 'creative',
  context: {
    topic: 'EdTech innovation',
    constraints: ['AI-powered', 'Affordable', 'Accessible'],
  },
  dynamicAdjustment: true,
});
// Result: Temperature 1.0 (0.9 + 0.1 cap)
```

## Context Variables Reference

### Global Context Variables

- `topic`: Main subject matter
- `context`: General background information
- `constraints`: List of limitations/requirements
- `requirements`: Specific deliverables
- `audience`: Target audience for the output

### Agent-Specific Variables

**Idea Agent:**

- `count`: Number of ideas to generate
- `constraints`: Limitations
- `requirements`: Specific criteria
- `audience`: Intended beneficiaries

**Critic Agent:**

- `idea`: The idea being critiqued
- `resources`: Available resources
- `timeline`: Project timeline
- `market`: Target market
- `criteria`: Evaluation criteria

**Refiner Agent:**

- `originalIdea`: Initial concept
- `feedback`: Critique/feedback to address
- `iteration`: Current iteration number
- `previousContext`: Context from previous iterations

**Presenter Agent:**

- `idea`: Idea to present
- `duration`: Presentation length
- `audience`: Target audience
- `style`: Presentation style preference

## Best Practices

### 1. Choose the Right Template

- Use the `getRecommendedTemplate` endpoint to get suggestions
- Consider your specific use case and constraints
- Test multiple templates for quality comparison

### 2. Provide Rich Context

- Include all relevant background information
- Specify constraints and requirements clearly
- Define target audience explicitly

### 3. Enable Dynamic Adjustment

- Use `dynamicAdjustment: true` for automatic optimization
- Ensures temperature and tokens are optimized for context

### 4. Validate Configurations

- Use `validatePromptConfig` before execution
- Check error messages for missing variables
- Fill all required context variables

### 5. Monitor Performance

- Track execution times and token usage
- Use `exportAllPrompts` for documentation
- Compare outputs from different templates

## Advanced Usage

### Prompt Chaining

```javascript
const chain = promptManager.buildPromptChain([
  {
    agentType: 'idea',
    template: 'creative',
    context: { topic: 'Healthcare innovation' }
  },
  {
    agentType: 'critic',
    template: 'feasibility',
    context: { resources: '5 engineers, $200K' }
  },
  {
    agentType: 'refiner',
    template: 'improvement',
    context: { /* previous output */ }
  },
  {
    agentType: 'presenter',
    template: 'pitch',
    context: { audience: 'Investors' }
  }
]);
```

### Custom Prompt Creation

Extend the system by adding custom templates:

```typescript
const customTemplate: PromptTemplate = {
  name: 'Custom Innovation',
  systemPrompt: 'Your custom system instructions...',
  userPromptTemplate: 'Custom prompt with {variables}...',
  temperature: 0.8,
  maxTokens: 1500,
};
```

## Troubleshooting

### Missing Variables

- **Error**: Template variables not filled
- **Solution**: Ensure all `{variable}` placeholders are provided in context

### Unexpected Results

- **Check**: Is the right template selected?
- **Check**: Are context values correct?
- **Try**: Adjust temperature or use different template

### Token Limits

- **Issue**: Output cut off at maxTokens
- **Solution**: Enable dynamic adjustment or increase maxTokens
- **Alternative**: Use a template with higher token limit

## Integration Examples

### In Agent Execution

```typescript
const optimizedPrompt = promptManager.buildOptimizedPrompt({
  agentType: request.agentType,
  templateName: recommendedTemplate,
  context: {
    ...request.input,
    ...request.context,
  },
  dynamicAdjustment: true,
});

const response = await genAIService.generateText({
  systemPrompt: optimizedPrompt.systemPrompt,
  userPrompt: optimizedPrompt.userPrompt,
  temperature: optimizedPrompt.temperature,
  maxTokens: optimizedPrompt.maxTokens,
});
```

### In Workflow

```typescript
const workflow = new CreativeWorkflow();
// Workflow automatically uses optimal prompts
const result = await workflow.fullProcess(sessionId, {
  topic: 'AI in Healthcare',
  audience: 'Medical Professionals'
});
```

## Future Enhancements

- [ ] Few-shot learning with examples
- [ ] Prompt versioning and A/B testing
- [ ] User feedback loops for optimization
- [ ] Performance analytics dashboard
- [ ] Custom template builder UI
- [ ] Multi-language prompt generation
- [ ] Prompt compression techniques
- [ ] Cost optimization (token counting)
