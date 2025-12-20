# 🚀 Byte Defenders - Multi-Agent Creative Studio

## Transform Ideas into Reality with AI-Powered Multi-Agent Collaboration

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

[Live Demo](#-quick-start) • [API Documentation](#-api-endpoints) • [Architecture](#-architecture) • [Deployment](#-deployment-guide) • [Monitoring](#-monitoring--logging)

---

## 🎯 The Story Behind Byte Defenders

### The Problem: Creative Bottlenecks in Innovation

Imagine a startup founder spending weeks in isolation, trying to brainstorm the perfect product idea. Or a product manager stuck in endless meetings, struggling to get constructive feedback on innovative concepts. Traditional creative processes are:

- **Time-consuming**: Days or weeks to generate, critique, and refine ideas
- **Expensive**: Multiple stakeholders, consultants, and workshop facilitators  
- **Limited by human bias**: Echo chambers, groupthink, and subjective opinions
- **Inconsistent quality**: Varying levels of critique and refinement
- **Scalability challenges**: Limited by team availability and coordination

### Our Solution: AI-Powered Creative Intelligence

**Byte Defenders** democratizes creative intelligence by providing instant access to a virtual team of AI specialists that:

- ⚡ **Generate ideas** in seconds, not weeks
- 🎯 **Provide unbiased critique** from multiple perspectives
- 🔄 **Iteratively refine** concepts based on structured feedback
- 📊 **Create professional presentations** ready for stakeholders
- 💰 **Offer flexible pricing** with pay-per-use model
- 🌐 **Scale infinitely** without resource constraints

### Value Proposition

> **"Transform 4 weeks of traditional creative workshops into 4 minutes of AI-powered innovation"**

---

## 🏗️ Architecture Overview

### System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        WebApp[🌐 Web Application]
        MobileApp[📱 Mobile App]
        APIClient[🔌 API Clients]
        Webhook[🔗 Webhooks]
    end
    
    subgraph "API Gateway Layer"
        LoadBalancer[⚖️ Load Balancer]
        APIGateway[🚪 API Gateway]
        AuthService[🔐 Auth Service]
        RateLimiter[🚦 Rate Limiter]
    end
    
    subgraph "Application Layer"
        SessionManager[📝 Session Manager]
        WorkflowEngine[⚙️ Workflow Engine]
        AgentOrchestrator[🎭 Agent Orchestrator]
        PaymentService[💳 Payment Service]
        EventBus[📡 Event Bus]
    end
    
    subgraph "AI Agent Layer"
        IdeaAgent[💡 Idea Agent]
        CriticAgent[🎯 Critic Agent]
        RefinerAgent[🔧 Refiner Agent]
        PresenterAgent[📊 Presenter Agent]
        MarketAgent[📈 Market Research Agent]
        TechAgent[⚙️ Technical Feasibility Agent]
    end
    
    subgraph "Service Layer"
        GenAIService[🤖 GenAI Service]
        MemoryService[🧠 Memory Service]
        CacheService[⚡ Cache Service]
        NotificationService[🔔 Notification Service]
        AnalyticsService[📊 Analytics Service]
    end
    
    subgraph "External Services"
        OpenAI[🧠 OpenAI GPT-4]
        Moti[🚀 Moti Backend]
        RazorPay[💰 RazorPay]
        SendGrid[📧 SendGrid]
        AWS[☁️ AWS Services]
    end
    
    subgraph "Data Layer"
        PostgreSQL[(🗄️ PostgreSQL)]
        Redis[(⚡ Redis Cache)]
        S3[🗂️ AWS S3]
        InfluxDB[(📈 Time Series DB)]
    end
    
    subgraph "Infrastructure"
        Monitoring[📊 Monitoring]
        Logging[📝 Logging]
        Security[🛡️ Security]
        Backup[💾 Backup]
    end
    
    %% Connections
    WebApp --> LoadBalancer
    MobileApp --> LoadBalancer
    APIClient --> LoadBalancer
    Webhook --> APIGateway
    
    LoadBalancer --> APIGateway
    APIGateway --> AuthService
    APIGateway --> RateLimiter
    APIGateway --> SessionManager
    
    SessionManager --> WorkflowEngine
    WorkflowEngine --> AgentOrchestrator
    AgentOrchestrator --> IdeaAgent
    AgentOrchestrator --> CriticAgent
    AgentOrchestrator --> RefinerAgent
    AgentOrchestrator --> PresenterAgent
    AgentOrchestrator --> MarketAgent
    AgentOrchestrator --> TechAgent
    
    PaymentService --> RazorPay
    SessionManager --> MemoryService
    WorkflowEngine --> EventBus
    EventBus --> NotificationService
    
    IdeaAgent --> GenAIService
    CriticAgent --> GenAIService
    RefinerAgent --> GenAIService
    PresenterAgent --> GenAIService
    
    GenAIService --> OpenAI
    GenAIService --> Moti
    
    SessionManager --> PostgreSQL
    MemoryService --> Redis
    WorkflowEngine --> InfluxDB
    NotificationService --> SendGrid
    
    Monitoring --> Logging
    Logging --> Security
    Security --> Backup
    
    classDef client fill:#e3f2fd
    classDef gateway fill:#f3e5f5
    classDef app fill:#e8f5e8
    classDef agent fill:#fff3e0
    classDef service fill:#fce4ec
    classDef external fill:#f1f8e9
    classDef data fill:#e0f2f1
    classDef infra fill:#fafafa
    
    class WebApp,MobileApp,APIClient,Webhook client
    class LoadBalancer,APIGateway,AuthService,RateLimiter gateway
    class SessionManager,WorkflowEngine,AgentOrchestrator,PaymentService,EventBus app
    class IdeaAgent,CriticAgent,RefinerAgent,PresenterAgent,MarketAgent,TechAgent agent
    class GenAIService,MemoryService,CacheService,NotificationService,AnalyticsService service
    class OpenAI,Moti,RazorPay,SendGrid,AWS external
    class PostgreSQL,Redis,S3,InfluxDB data
    class Monitoring,Logging,Security,Backup infra
```

### Agent Interaction Patterns

```mermaid
sequenceDiagram
    participant U as User
    participant SE as Session Engine
    participant IA as Idea Agent
    participant CA as Critic Agent
    participant RA as Refiner Agent
    participant PA as Presenter Agent
    participant MS as Memory Service
    participant ES as Event Bus
    
    U->>SE: Start Quick Workflow
    SE->>MS: Create Session
    SE->>IA: Generate Ideas
    IA->>ES: Emit idea:completed
    IA->>SE: Return Initial Ideas
    
    SE->>CA: Provide Criticism
    CA->>ES: Emit critic:completed
    CA->>SE: Return Feedback
    
    SE->>RA: Refine Ideas
    RA->>ES: Emit refine:completed
    RA->>SE: Return Refined Ideas
    
    SE->>PA: Create Presentation
    PA->>ES: Emit present:completed
    PA->>SE: Return Presentation
    
    SE->>U: Return Complete Results
    
    Note over ES: All events logged for analytics
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js**: 18.0+ (LTS recommended)
- **npm**: 9.0+ or **yarn**: 1.22+
- **PostgreSQL**: 13+ (optional, for persistence)
- **Redis**: 6+ (optional, for caching)
- **Docker**: 20.10+ (for containerized deployment)

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/your-username/byte-defenders.git
cd byte-defenders

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start development server
npm run dev

# In another terminal, start database (optional)
docker-compose up -d postgres redis
```

### Environment Variables

```env
# =============================================================================
# SERVER CONFIGURATION
# =============================================================================
NODE_ENV=development
PORT=3000
HOST=localhost
LOG_LEVEL=info

# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================
DATABASE_URL=postgresql://user:password@localhost:5432/byte_defenders
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_SSL=false

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_KEY_PREFIX=byte_defenders:

# =============================================================================
# AUTHENTICATION & SECURITY
# =============================================================================
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# API Keys
API_KEY_HEADER=X-API-Key
API_KEYS=key1,key2,key3

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
CORS_CREDENTIALS=true

# =============================================================================
# AI/GENAI SERVICE CONFIGURATION
# =============================================================================
GENAI_PROVIDER=openai
GENAI_API_KEY=your_openai_api_key_here
GENAI_BASE_URL=https://api.openai.com/v1
GENAI_MODEL=gpt-4-turbo-preview
GENAI_MAX_TOKENS=4000
GENAI_TEMPERATURE=0.7
GENAI_TIMEOUT=30000

# Moti Backend (Optional)
MOTI_ENABLED=false
MOTI_API_KEY=your_moti_api_key
MOTI_BASE_URL=http://localhost:8000

# =============================================================================
# PAYMENT PROCESSING (RAZORPAY)
# =============================================================================
RAZORPAY_ENABLED=true
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
RAZORPAY_CURRENCY=INR

# Payment Plans
PAYMENT_PLANS_JSON={"free":{"price":0,"workflows":3},"pro":{"price":999,"workflows":100},"enterprise":{"price":4999,"workflows":"unlimited"}}

# =============================================================================
# EMAIL & NOTIFICATIONS
# =============================================================================
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
SMTP_FROM=noreply@byte-defenders.com
SMTP_SECURE=false

# Notification Channels
NOTIFY_EMAIL_ENABLED=true
NOTIFY_WEBHOOK_ENABLED=false
NOTIFY_SLACK_ENABLED=false
SLACK_WEBHOOK_URL=

# =============================================================================
# MONITORING & LOGGING
# =============================================================================
LOG_FORMAT=combined
LOG_FILE_PATH=./logs/app.log
LOG_MAX_SIZE=10m
LOG_MAX_FILES=5

# Metrics
METRICS_ENABLED=true
METRICS_PORT=9090
PROMETHEUS_ENABLED=true

# =============================================================================
# RATE LIMITING & THROTTLING
# =============================================================================
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS=false

# Workflow Rate Limiting
WORKFLOW_RATE_LIMIT=10
WORKFLOW_RATE_LIMIT_WINDOW=3600000

# =============================================================================
# CACHING CONFIGURATION
# =============================================================================
CACHE_TTL=3600
CACHE_MAX_KEYS=1000
CACHE_COMPRESSION=true

# AI Response Caching
AI_CACHE_ENABLED=true
AI_CACHE_TTL=1800

# =============================================================================
# FILE STORAGE
# =============================================================================
UPLOAD_MAX_SIZE=10MB
UPLOAD_ALLOWED_TYPES=pdf,doc,docx,txt
STORAGE_TYPE=local
STORAGE_PATH=./uploads

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=byte-defenders-storage

# =============================================================================
# EXTERNAL INTEGRATIONS
# =============================================================================
SLACK_BOT_TOKEN=
SLACK_SIGNING_SECRET=
DISCORD_BOT_TOKEN=
WEBHOOK_SECRET=your_webhook_secret

# =============================================================================
# FEATURE FLAGS
# =============================================================================
FEATURE_ADVANCED_AGENTS=false
FEATURE_MARKET_RESEARCH=false
FEATURE_WHITE_LABEL=false
FEATURE_API_V2=true

# =============================================================================
# DEVELOPMENT OPTIONS
# =============================================================================
HOT_RELOAD=true
DEBUG_MODE=false
MOCK_PAYMENTS=false
MOCK_EMAIL=false
SEED_DATABASE=false
```

---

## 🚀 Deployment Guide

### Docker Deployment (Recommended)

#### Development Environment

```bash
# Clone and setup
git clone https://github.com/your-username/byte-defenders.git
cd byte-defenders

# Create environment file
cp .env.example .env
# Edit .env with your values

# Start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

#### Production Environment

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# With monitoring stack
docker-compose -f docker-compose.full.yml up -d
```

#### Docker Compose Files

**docker-compose.yml** (Development)

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    env_file:
      - .env
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - postgres
      - redis
    networks:
      - app-network

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=byte_defenders
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./migrations:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

### Cloud Deployment Options

#### AWS Deployment

## Using AWS ECS with Fargate

```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

docker build -t byte-defenders:latest .
docker tag byte-defenders:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/byte-defenders:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/byte-defenders:latest

# Deploy using ECS
aws ecs create-cluster --cluster-name byte-defenders-prod
aws ecs create-service --cluster byte-defenders-prod --service-name byte-defenders-api --task-definition byte-defenders-task
```

### Google Cloud Platform

## Using Cloud Run

```bash
# Build and deploy to Cloud Run
gcloud builds submit --tag gcr.io/PROJECT_ID/byte-defenders

gcloud run deploy byte-defenders \
  --image gcr.io/PROJECT_ID/byte-defenders \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,DATABASE_URL=postgresql://user:pass@host:5432/db" \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10
```

---

## 📡 API Endpoints

### Authentication

All API requests require authentication using one of the following methods:

#### API Key Authentication

```http
GET /api/v1/sessions
Authorization: Bearer your-api-key-here
Content-Type: application/json
```

#### JWT Token Authentication

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "jwt-token-here",
  "expiresIn": "7d",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "plan": "pro"
  }
}
```

### Session Management

#### Create Session

```http
POST /api/v1/sessions
Authorization: Bearer your-token
Content-Type: application/json

{
  "userId": "user_123",
  "title": "Product Innovation Session",
  "description": "Brainstorming new features for Q1",
  "plan": "pro",
  "metadata": {
    "department": "Product",
    "priority": "high",
    "tags": ["innovation", "mobile", "ai"]
  }
}
```

**Response (201 Created):**

```json
{
  "id": "session_550e8400e29b41d4a716446655440000",
  "userId": "user_123",
  "title": "Product Innovation Session",
  "description": "Brainstorming new features for Q1",
  "status": "active",
  "plan": "pro",
  "createdAt": "2025-12-20T10:30:00Z",
  "updatedAt": "2025-12-20T10:30:00Z",
  "progress": 0,
  "currentAgent": "waiting",
  "workflowLimit": 100,
  "workflowsUsed": 0,
  "metadata": {
    "department": "Product",
    "priority": "high",
    "tags": ["innovation", "mobile", "ai"]
  }
}
```

#### Get Session Details

```http
GET /api/v1/sessions/{sessionId}
Authorization: Bearer your-token
```

**Response (200 OK):**

```json
{
  "id": "session_550e8400e29b41d4a716446655440000",
  "userId": "user_123",
  "title": "Product Innovation Session",
  "status": "active",
  "plan": "pro",
  "createdAt": "2025-12-20T10:30:00Z",
  "updatedAt": "2025-12-20T10:35:00Z",
  "progress": 50,
  "currentAgent": "critic",
  "executionHistoryLength": 2,
  "currentProgress": 50,
  "workflowLimit": 100,
  "workflowsUsed": 1,
  "memorySnapshot": {
    "hasInitialIdea": true,
    "hasCriticisms": true,
    "hasRefinedIdea": false,
    "hasPresentation": false,
    "hasMarketResearch": false,
    "hasTechnicalFeasibility": false
  },
  "performance": {
    "totalDuration": 8900,
    "averageAgentTime": 2225,
    "successRate": 100
  }
}
```

### Payment Integration (RazorPay)

#### Create Payment Order

```http
POST /api/v1/payments/create-order
Authorization: Bearer your-token
Content-Type: application/json

{
  "plan": "pro",
  "duration": "monthly",
  "currency": "INR",
  "customerId": "cust_123"
}
```

**Response (200 OK):**

```json
{
  "orderId": "order_IpDk4eVZJb0D2s",
  "amount": 99900,
  "currency": "INR",
  "plan": "pro",
  "duration": "monthly",
  "status": "created",
  "keyId": "rzp_test_key_id",
  "checkoutUrl": "https://checkout.razorpay.com/v1/IpDk4eVZJb0D2s",
  "expiresAt": "2025-12-21T10:30:00Z"
}
```

#### Verify Payment

```http
POST /api/v1/payments/verify
Authorization: Bearer your-token
Content-Type: application/json

{
  "orderId": "order_IpDk4eVZJb0D2s",
  "paymentId": "pay_IpDk4eVZJb0D2s",
  "signature": "signature_hash",
  "subscription": false
}
```

**Response (200 OK):**

```json
{
  "paymentId": "pay_IpDk4eVZJb0D2s",
  "orderId": "order_IpDk4eVZJb0D2s",
  "status": "verified",
  "amount": 99900,
  "currency": "INR",
  "plan": "pro",
  "subscriptionId": null,
  "customerId": "cust_123",
  "verifiedAt": "2025-12-20T10:35:00Z"
}
```

### Workflow Execution

#### Quick Workflow (Idea + Critique)

```http
POST /api/v1/sessions/{sessionId}/workflow/quick
Authorization: Bearer your-token
Content-Type: application/json

{
  "topic": "How to improve remote team productivity",
  "constraints": [
    "Budget under $50K",
    "Implementation within 6 months",
    "Must work for distributed teams"
  ],
  "requirements": [
    "Scalable solution",
    "Integration with existing tools"
  ],
  "audience": "Product managers",
  "creativity": 0.8,
  "depth": "standard"
}
```

**Response (200 OK):**

```json
{
  "sessionId": "session_550e8400e29b41d4a716446655440000",
  "workflowType": "quick",
  "status": "completed",
  "initialIdea": {
    "id": "output_550e8400e29b41d4a716446655440001",
    "agentName": "Idea Generator",
    "agentType": "idea",
    "input": {
      "topic": "How to improve remote team productivity",
      "constraints": ["Budget under $50K", "Implementation within 6 months"],
      "requirements": ["Scalable solution", "Integration with existing tools"],
      "audience": "Product managers",
      "creativity": 0.8
    },
    "output": {
      "text": "## AI-Powered Virtual Office Assistant\n\n**Core Concept**: An intelligent virtual assistant that uses AI to simulate an office environment, helping remote teams collaborate more effectively through:\n\n### Key Features:\n1. **Smart Scheduling**: AI optimizes meeting times across time zones\n2. **Contextual Notifications**: Smart reminders based on work patterns\n3. **Virtual Watercooler**: AI-facilitated casual team interactions\n4. **Productivity Analytics**: Data-driven insights on team performance",
      "metadata": {
        "wordCount": 145,
        "sections": 4,
        "tags": ["ai", "productivity", "remote-work"],
        "confidence": 0.92
      }
    },
    "reasoning": "Generated based on productivity research, remote work challenges, and AI capabilities to create an innovative yet feasible solution.",
    "timestamp": "2025-12-20T10:30:15Z",
    "duration": 3245,
    "success": true,
    "tokensUsed": 1250,
    "model": "gpt-4-turbo-preview"
  },
  "criticisms": [
    {
      "id": "output_550e8400e29b41d4a716446655440002",
      "agentName": "Critic",
      "agentType": "critic",
      "input": {
        "originalIdea": "AI-Powered Virtual Office Assistant...",
        "criteria": ["feasibility", "market-potential", "implementation-difficulty"]
      },
      "output": {
        "text": "## Critical Analysis\n\n### Strengths:\n- Addresses real pain point in remote work\n- AI component provides differentiation\n- Scalable across different team sizes\n\n### Concerns:\n- **High Development Cost**: AI features require significant R&D investment\n- **Privacy Issues**: Employee monitoring could face resistance\n- **Complex Integration**: May be difficult to integrate with existing tools\n\n### Recommendations:\n1. Start with MVP focusing on scheduling optimization\n2. Ensure GDPR/privacy compliance from day one\n3. Consider freemium model to reduce adoption barriers",
        "metadata": {
          "categories": ["technical", "market", "financial"],
          "riskLevel": "medium",
          "recommendationCount": 3
        }
      },
      "reasoning": "Evaluated idea across multiple dimensions including technical feasibility, market viability, and implementation complexity.",
      "timestamp": "2025-12-20T10:32:30Z",
      "duration": 2890,
      "success": true,
      "tokensUsed": 890,
      "model": "gpt-4-turbo-preview"
    }
  ],
  "executionHistory": [
    {
      "step": 1,
      "agent": "idea",
      "status": "completed",
      "duration": 3245,
      "timestamp": "2025-12-20T10:30:15Z"
    },
    {
      "step": 2,
      "agent": "critic",
      "status": "completed", 
      "duration": 2890,
      "timestamp": "2025-12-20T10:32:30Z"
    }
  ],
  "totalDuration": 6135,
  "tokensUsed": 2140,
  "costEstimate": {
    "aiCost": 0.12,
    "platformFee": 0.03,
    "total": 0.15
  }
}
```

#### Full Workflow (Complete Process)

```http
POST /api/v1/sessions/{sessionId}/workflow/full
Authorization: Bearer your-token
Content-Type: application/json

{
  "topic": "Sustainable fashion e-commerce platform",
  "audience": "Impact investors",
  "constraints": [
    "Launch within 12 months",
    "Bootstrap funding model",
    "Focus on B2C market"
  ],
  "requirements": [
    "Mobile-first design",
    "Social commerce features",
    "Sustainability tracking"
  ],
  "depth": "comprehensive",
  "includeMarketResearch": true,
  "includeTechnicalFeasibility": true
}
```

### Error Handling

#### Standard Error Response

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The provided topic is too short. Minimum 10 characters required.",
    "details": {
      "field": "topic",
      "minLength": 10,
      "provided": 5
    },
    "requestId": "req_550e8400e29b41d4a716446655440000",
    "timestamp": "2025-12-20T10:30:00Z"
  }
}
```

#### Rate Limit Error

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "API rate limit exceeded. Try again in 900 seconds.",
    "details": {
      "limit": 100,
      "window": "15 minutes",
      "resetAt": "2025-12-20T10:45:00Z"
    },
    "retryAfter": 900
  }
}
```

---

## 🔧 Integration Guides

### RazorPay Integration

#### Setup Instructions

1. **Create RazorPay Account**
   - Sign up at [razorpay.com](https://razorpay.com)
   - Complete business verification
   - Obtain API keys from dashboard

2. **Configure Webhook**

   ```bash
   # Webhook URL for production
   https://your-domain.com/api/v1/webhooks/razorpay
   
   # Events to subscribe:
   - payment.authorized
   - payment.captured
   - payment.failed
   - subscription.created
   - subscription.cancelled
   ```

3. **Environment Configuration**

   ```env
   RAZORPAY_ENABLED=true
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   RAZORPAY_CURRENCY=INR
   ```

#### Payment Flow Implementation

```typescript
// Create order
const createOrder = async (plan: string, userId: string) => {
  const amount = PLANS[plan].price * 100; // Convert to paise
  
  const order = await razorpay.orders.create({
    amount,
    currency: process.env.RAZORPAY_CURRENCY,
    receipt: `receipt_${Date.now()}`,
    notes: {
      plan,
      userId
    }
  });
  
  return order;
};

// Verify payment
const verifyPayment = async (orderId: string, paymentId: string, signature: string) => {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(orderId + "|" + paymentId)
    .digest('hex');
    
  if (expectedSignature === signature) {
    // Payment verified successfully
    await updateUserPlan(paymentId);
    return { verified: true };
  } else {
    throw new Error('Invalid signature');
  }
};

// Handle webhook
const handleWebhook = async (event: RazorpayEvent) => {
  switch (event.event) {
    case 'payment.captured':
      await handleSuccessfulPayment(event.payload.payment);
      break;
    case 'payment.failed':
      await handleFailedPayment(event.payload.payment);
      break;
    case 'subscription.cancelled':
      await handleSubscriptionCancellation(event.payload.subscription);
      break;
  }
};
```

---

## 📊 Performance Optimization

### Caching Strategy

#### Multi-Level Caching Architecture

```mermaid
graph TB
    Request[API Request] --> L1[L1: In-Memory Cache]
    L1 -->|Cache Hit| Response[Response]
    L1 -->|Cache Miss| L2[L2: Redis Cache]
    L2 -->|Cache Hit| Response
    L2 -->|Cache Miss| Database[(Database)]
    Database --> L2
    L2 --> L1
    Response --> L1
```

#### Implementation

```typescript
// L1 Cache (In-Memory) - For frequently accessed data
class InMemoryCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize = 1000;
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    entry.lastAccessed = Date.now();
    return entry.data;
  }
  
  set<T>(key: string, data: T, ttlMs: number): void {
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }
    
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
      lastAccessed: Date.now()
    });
  }
  
  private evictOldest(): void {
    let oldestKey = '';
    let oldestTime = Date.now();
    
    for (const [key, entry] of this.cache) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }
}

// L2 Cache (Redis) - For session data and AI responses
class RedisCache {
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }
  
  async set<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
    const serialized = JSON.stringify(data);
    await redis.setex(key, ttlSeconds, serialized);
  }
}

// Cache Manager
export class CacheManager {
  private l1Cache = new InMemoryCache();
  private l2Cache = new RedisCache();
  
  async get<T>(key: string, ttlSeconds: number): Promise<T | null> {
    // Try L1 first
    let result = this.l1Cache.get<T>(key);
    if (result) return result;
    
    // Try L2
    result = await this.l2Cache.get<T>(key);
    if (result) {
      // Populate L1
      this.l1Cache.set(key, result, ttlSeconds * 1000);
      return result;
    }
    
    return null;
  }
  
  async set<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
    // Set in both caches
    this.l1Cache.set(key, data, ttlSeconds * 1000);
    await this.l2Cache.set(key, data, ttlSeconds);
  }
}
```

### Database Optimization

#### Connection Pooling and Query Optimization

```typescript
// Optimized database configuration
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  
  // Connection pool settings
  min: parseInt(process.env.DB_POOL_MIN || '2'),
  max: parseInt(process.env.DB_POOL_MAX || '20'),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  
  // SSL and security
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  
  // Performance optimizations
  statement_timeout: 30000,
  query_timeout: 30000,
  
  // Connection recycling
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000
};

// Query optimization with prepared statements
export class OptimizedQueries {
  // Batch insert for outputs
  static async batchInsertOutputs(outputs: Output[]): Promise<void> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const query = `
        INSERT INTO outputs (session_id, agent_name, agent_type, input, output, reasoning, duration, tokens_used, success, model)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          input = EXCLUDED.input,
          output = EXCLUDED.output,
          reasoning = EXCLUDED.reasoning,
          duration = EXCLUDED.duration,
          tokens_used = EXCLUDED.tokens_used,
          success = EXCLUDED.success
      `;
      
      for (const output of outputs) {
        await client.query(query, [
          output.sessionId,
          output.agentName,
          output.agentType,
          JSON.stringify(output.input),
          JSON.stringify(output.output),
          output.reasoning,
          output.duration,
          output.tokensUsed,
          output.success,
          output.model
        ]);
      }
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Optimized session query with joins
  static async getSessionWithOutputs(sessionId: string): Promise<SessionWithOutputs> {
    const query = `
      SELECT 
        s.*,
        json_agg(
          json_build_object(
            'id', o.id,
            'agentName', o.agent_name,
            'agentType', o.agent_type,
            'input', o.input,
            'output', o.output,
            'reasoning', o.reasoning,
            'duration', o.duration,
            'success', o.success,
            'createdAt', o.created_at
          ) ORDER BY o.created_at
        ) FILTER (WHERE o.id IS NOT NULL) as outputs
      FROM sessions s
      LEFT JOIN outputs o ON s.id = o.session_id
      WHERE s.id = $1
      GROUP BY s.id
    `;
    
    const result = await pool.query(query, [sessionId]);
    return this.mapSessionWithOutputs(result.rows[0]);
  }
}
```

---

## 🛡️ Security Best Practices

### Authentication & Authorization

#### JWT Implementation

```typescript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class AuthService {
  private jwtSecret = process.env.JWT_SECRET!;
  private jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    return bcrypt.hash(password, saltRounds);
  }
  
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
  
  generateToken(payload: UserPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
      issuer: 'byte-defenders',
      audience: 'byte-defenders-users'
    });
  }
  
  verifyToken(token: string): UserPayload {
    try {
      return jwt.verify(token, this.jwtSecret, {
        issuer: 'byte-defenders',
        audience: 'byte-defenders-users'
      }) as UserPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
  
  refreshToken(token: string): string {
    const payload = this.verifyToken(token);
    return this.generateToken({
      userId: payload.userId,
      email: payload.email,
      plan: payload.plan
    });
  }
}

// JWT Middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json(ResponseFormatter.error('UNAUTHORIZED', 'Access token required'));
  }
  
  try {
    const authService = new AuthService();
    const payload = authService.verifyToken(token);
    (req as any).user = payload;
    next();
  } catch (error) {
    return res.status(403).json(ResponseFormatter.error('FORBIDDEN', 'Invalid or expired token'));
  }
};

// Role-based access control
export const requirePlan = (requiredPlan: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const userPlan = user?.plan;
    
    if (!this.hasRequiredPlan(userPlan, requiredPlan)) {
      return res.status(403).json(ResponseFormatter.error('INSUFFICIENT_PLAN', 
        `This feature requires ${requiredPlan} plan or higher`));
    }
    
    next();
  };
};
```

### Rate Limiting & DDoS Protection

#### Advanced Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

// Redis-backed rate limiter
const createRateLimiter = (options: RateLimitOptions) => {
  return rateLimit({
    store: new RedisStore({
      client: redis,
      prefix: `rl:${options.keyGenerator ? 'custom' : 'default'}`
    }),
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
    max: options.max || 100, // limit each IP to 100 requests per windowMs
    message: ResponseFormatter.error('RATE_LIMIT_EXCEEDED', 
      'Too many requests, please try again later'),
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: options.keyGenerator,
    skip: options.skip,
    onLimitReached: (options as any).onLimitReached
  });
};

// Global rate limiter
app.use(createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per 15 minutes
  onLimitReached: (req, res, optionsUsed) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip}`);
  }
}));

// Workflow-specific rate limiting
const workflowLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 workflows per hour
  keyGenerator: (req) => {
    const user = (req as any).user;
    return user ? `workflow:${user.id}` : req.ip;
  }
});

// Apply to workflow endpoints
app.use('/api/v1/sessions/*/workflow', workflowLimiter);
```

---

## 🧪 Testing Strategies

### Unit Testing

#### Test Setup and Configuration

```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.ts',
    '<rootDir>/tests/integration/**/*.test.ts'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

#### Agent Testing

```typescript
// tests/unit/agents/IdeaAgent.test.ts
import { IdeaAgent } from '../../../src/agents/idea.agent';
import { GenAIService } from '../../../src/services/genai.service';

describe('IdeaAgent', () => {
  let agent: IdeaAgent;
  let mockGenAI: jest.Mocked<GenAIService>;
  
  beforeEach(() => {
    mockGenAI = {
      generateResponse: jest.fn(),
      getInstance: jest.fn()
    } as any;
    
    agent = new IdeaAgent();
    (agent as any).genAI = mockGenAI;
  });
  
  describe('generateIdeas', () => {
    it('should generate ideas successfully', async () => {
      // Arrange
      const input = {
        topic: 'AI-powered productivity tools',
        count: 3,
        constraints: ['Budget under $10K', 'Launch within 6 months'],
        audience: 'remote workers'
      };
      
      const mockResponse = {
        choices: [{
          message: {
            content: '# AI Productivity Assistant\n\n## Smart Calendar Integration\n\nAn AI that automatically...'
          }
        }],
        usage: { total_tokens: 500 },
        model: 'gpt-4'
      };
      
      mockGenAI.generateResponse.mockResolvedValue(mockResponse as any);
      
      // Act
      const result = await agent.generateIdeas(input);
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.output.text).toContain('AI Productivity Assistant');
      expect(result.tokensUsed).toBe(500);
      expect(mockGenAI.generateResponse).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ role: 'system' }),
          expect.objectContaining({ role: 'user' })
        ]),
        expect.objectContaining({
          temperature: 0.8,
          maxTokens: 2000
        })
      );
    });
    
    it('should handle generation errors gracefully', async () => {
      // Arrange
      const input = { topic: 'test topic' };
      mockGenAI.generateResponse.mockRejectedValue(new Error('API Error'));
      
      // Act & Assert
      await expect(agent.generateIdeas(input)).rejects.toThrow('API Error');
    });
    
    it('should respect creativity parameter', async () => {
      // Arrange
      const input = { topic: 'test', creativity: 0.9 };
      const mockResponse = {
        choices: [{ message: { content: 'Creative response' } }],
        usage: { total_tokens: 300 },
        model: 'gpt-4'
      };
      
      mockGenAI.generateResponse.mockResolvedValue(mockResponse as any);
      
      // Act
      await agent.generateIdeas(input);
      
      // Assert
      expect(mockGenAI.generateResponse).toHaveBeenCalledWith(
        expect.any(Array),
        expect.objectContaining({
          temperature: 0.9
        })
      );
    });
  });
});
```

---

## 📊 Monitoring & Logging

### Logging Configuration

#### Structured Logging with Winston

```typescript
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

// Transport configuration
const transports: winston.transport[] = [];

// Console transport for development
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
      level: process.env.LOG_LEVEL || 'debug'
    })
  );
}

// File transport for production
transports.push(
  new DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: process.env.LOG_MAX_SIZE || '10m',
    maxFiles: process.env.LOG_MAX_FILES || '5d',
    format: logFormat,
    level: 'info'
  })
);

// Error logging
transports.push(
  new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '10m',
    maxFiles: '14d',
    format: logFormat,
    level: 'error',
    handleExceptions: true,
    handleRejections: true
  })
);

// Create logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports,
  exitOnError: false
});

// Performance logging middleware
export const performanceLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const userId = (req as any).user?.id || 'anonymous';
    const sessionId = req.params.sessionId || 'none';
    
    logger.info('Request completed', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration,
      userId,
      sessionId,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
    
    // Log slow requests
    if (duration > 5000) {
      logger.warn('Slow request detected', {
        method: req.method,
        url: req.originalUrl,
        duration,
        userId,
        sessionId
      });
    }
  });
  
  next();
};
```

### Metrics Collection

#### Prometheus Metrics

```typescript
import { register, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

// Collect default Node.js metrics
collectDefaultMetrics();

// Custom metrics
const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5, 10]
});

const activeWorkflows = new Gauge({
  name: 'active_workflows',
  help: 'Number of currently running workflows'
});

const agentExecutionDuration = new Histogram({
  name: 'agent_execution_duration_seconds',
  help: 'Duration of agent executions in seconds',
  labelNames: ['agent_type', 'status'],
  buckets: [1, 2, 5, 10, 30, 60, 120]
});

const workflowCompletions = new Counter({
  name: 'workflow_completions_total',
  help: 'Total number of workflow completions',
  labelNames: ['workflow_type', 'status']
});

const aiTokenUsage = new Counter({
  name: 'ai_tokens_used_total',
  help: 'Total number of AI tokens used',
  labelNames: ['model', 'agent_type']
});

const paymentEvents = new Counter({
  name: 'payment_events_total',
  help: 'Total number of payment events',
  labelNames: ['event_type', 'status', 'plan']
});

// Metrics middleware
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;
    
    httpRequestTotal
      .labels(req.method, route, res.statusCode.toString())
      .inc();
      
    httpRequestDuration
      .labels(req.method, route, res.statusCode.toString())
      .observe(duration);
  });
  
  next();
};
```

### Health Checks

#### Comprehensive Health Monitoring

```typescript
// Health check service
export class HealthCheckService {
  private checks: Map<string, HealthCheck> = new Map();
  
  constructor() {
    this.registerDefaultChecks();
  }
  
  registerDefaultChecks(): void {
    this.registerCheck('database', this.checkDatabase.bind(this));
    this.registerCheck('redis', this.checkRedis.bind(this));
    this.registerCheck('openai', this.checkOpenAI.bind(this));
    this.registerCheck('razorpay', this.checkRazorPay.bind(this));
    this.registerCheck('disk-space', this.checkDiskSpace.bind(this));
    this.registerCheck('memory', this.checkMemory.bind(this));
  }
  
  registerCheck(name: string, check: HealthCheck): void {
    this.checks.set(name, check);
  }
  
  async getHealth(): Promise<HealthStatus> {
    const results = await Promise.allSettled(
      Array.from(this.checks.entries()).map(async ([name, check]) => {
        try {
          const result = await check();
          return { name, ...result };
        } catch (error) {
          return {
            name,
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
          };
        }
      })
    );
    
    const checks = results.map(result => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          name: 'unknown',
          status: 'unhealthy',
          error: 'Health check failed',
          timestamp: new Date().toISOString()
        };
      }
    });
    
    const healthyCount = checks.filter(c => c.status === 'healthy').length;
    const totalCount = checks.length;
    
    return {
      status: healthyCount === totalCount ? 'healthy' : 
              healthyCount > totalCount / 2 ? 'degraded' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      checks
    };
  }
  
  private async checkDatabase(): Promise<HealthCheckResult> {
    try {
      const result = await DatabaseService.query('SELECT 1');
      return {
        status: 'healthy',
        message: 'Database connection successful',
        timestamp: new Date().toISOString(),
        responseTime: 0
      };
    } catch (error) {
      throw new Error(`Database connection failed: ${error}`);
    }
  }
  
  private async checkRedis(): Promise<HealthCheckResult> {
    const start = Date.now();
    try {
      await redis.ping();
      return {
        status: 'healthy',
        message: 'Redis connection successful',
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - start
      };
    } catch (error) {
      throw new Error(`Redis connection failed: ${error}`);
    }
  }
  
  private async checkOpenAI(): Promise<HealthCheckResult> {
    const start = Date.now();
    try {
      const response = await fetch(`${process.env.GENAI_BASE_URL}/models`, {
        headers: {
          'Authorization': `Bearer ${process.env.GENAI_API_KEY}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API returned ${response.status}`);
      }
      
      return {
        status: 'healthy',
        message: 'OpenAI API connection successful',
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - start
      };
    } catch (error) {
      throw new Error(`OpenAI API connection failed: ${error}`);
    }
  }
}

// Health check endpoints
const healthService = new HealthCheckService();

app.get('/health', async (req: Request, res: Response) => {
  const health = await healthService.getHealth();
  const statusCode = health.status === 'healthy' ? 200 : 
                    health.status === 'degraded' ? 200 : 503;
  
  res.status(statusCode).json(health);
});

app.get('/health/ready', async (req: Request, res: Response) => {
  // Liveness probe - basic health check
  res.json({ status: 'ready', timestamp: new Date().toISOString() });
});

app.get('/health/live', async (req: Request, res: Response) => {
  // Readiness probe - detailed health check
  const health = await healthService.getHealth();
  const statusCode = health.status === 'healthy' ? 200 : 503;
  
  res.status(statusCode).json(health);
});
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Database Connection Issues

**Problem**: `ECONNREFUSED` error when connecting to PostgreSQL

```typescript
// Diagnostic function
export const diagnoseDatabaseConnection = async (): Promise<DiagnosticResult> => {
  const results: DiagnosticStep[] = [];
  
  // Check if PostgreSQL is running
  try {
    await exec('pg_isready -h localhost -p 5432');
    results.push({
      step: 'PostgreSQL Service',
      status: 'success',
      message: 'PostgreSQL is running'
    });
  } catch (error) {
    results.push({
      step: 'PostgreSQL Service',
      status: 'error',
      message: 'PostgreSQL is not running. Start it with: sudo systemctl start postgresql'
    });
  }
  
  // Check connection string format
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL not set');
    }
    
    const url = new URL(connectionString);
    results.push({
      step: 'Connection String',
      status: 'success',
      message: `Valid connection string for ${url.hostname}:${url.port || 5432}`
    });
  } catch (error) {
    results.push({
      step: 'Connection String',
      status: 'error',
      message: 'Invalid DATABASE_URL format. Expected: postgresql://user:pass@host:port/db'
    });
  }
  
  // Test actual connection
  try {
    await DatabaseService.query('SELECT 1');
    results.push({
      step: 'Database Connection',
      status: 'success',
      message: 'Successfully connected to database'
    });
  } catch (error) {
    results.push({
      step: 'Database Connection',
      status: 'error',
      message: `Connection failed: ${error}`,
      resolution: 'Check database credentials and ensure database exists'
    });
  }
  
  return {
    overall: results.some(r => r.status === 'error') ? 'unhealthy' : 'healthy',
    steps: results
  };
};
```

**Solutions**:

```bash
# Start PostgreSQL service
sudo systemctl start postgresql

# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection manually
psql "postgresql://user:pass@localhost:5432/db" -c "SELECT 1;"

# Reset database password
sudo -u postgres psql
\password username
```

#### OpenAI API Issues

**Problem**: `401 Unauthorized` from OpenAI API

```typescript
// OpenAI diagnostic
export const diagnoseOpenAIConnection = async (): Promise<DiagnosticResult> => {
  const results: DiagnosticStep[] = [];
  
  // Check API key format
  const apiKey = process.env.GENAI_API_KEY;
  if (!apiKey) {
    results.push({
      step: 'API Key',
      status: 'error',
      message: 'GENAI_API_KEY not set',
      resolution: 'Set your OpenAI API key in .env file'
    });
  } else if (!apiKey.startsWith('sk-')) {
    results.push({
      step: 'API Key',
      status: 'error',
      message: 'Invalid API key format',
      resolution: 'OpenAI API keys should start with "sk-"'
    });
  } else {
    results.push({
      step: 'API Key',
      status: 'success',
      message: 'API key format is valid'
    });
  }
  
  // Test API connection
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    if (response.ok) {
      results.push({
        step: 'API Connection',
        status: 'success',
        message: 'Successfully connected to OpenAI API'
      });
    } else if (response.status === 401) {
      results.push({
        step: 'API Connection',
        status: 'error',
        message: 'Invalid API key - authentication failed',
        resolution: 'Check your OpenAI API key and billing status'
      });
    } else {
      results.push({
        step: 'API Connection',
        status: 'error',
        message: `API returned ${response.status}`,
        resolution: 'Check OpenAI service status and API limits'
      });
    }
  } catch (error) {
    results.push({
      step: 'API Connection',
      status: 'error',
      message: `Network error: ${error}`,
      resolution: 'Check internet connection and firewall settings'
    });
  }
  
  return {
    overall: results.some(r => r.status === 'error') ? 'unhealthy' : 'healthy',
    steps: results
  };
};
```

### Debug Mode and Logging

```typescript
// Debug configuration
export const configureDebug = () => {
  if (process.env.DEBUG_MODE === 'true') {
    // Enable debug logging for specific modules
    process.env.DEBUG = 'workflow:*,agent:*,database:*';
    
    // Add debug middleware
    app.use((req, res, next) => {
      logger.debug('Request details', {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    });
  }
};
```

---

## 🤝 Contributing Guidelines

### Development Setup

#### Prerequisites and Environment

```bash
# Required tools
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 1.22+
- PostgreSQL 13+
- Redis 6+
- Git

# Recommended VS Code extensions
- TypeScript and JavaScript Language Features
- ESLint
- Prettier - Code formatter
- Thunder Client (API testing)
- PostgreSQL
- Redis
```

#### Project Setup

```bash
# Clone the repository
git clone https://github.com/your-username/byte-defenders.git
cd byte-defenders

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
npm run db:migrate
npm run db:seed

# Start development server
npm run dev

# Run tests
npm run test
npm run test:watch
npm run test:coverage
```

### Code Standards and Style

#### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": false,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "removeComments": true,
    "importHelpers": true,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "tests",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

### Git Workflow

#### Branch Strategy

```bash
# Feature development
git checkout -b feature/agent-improvements
git checkout -b fix/workflow-timeout-issue
git checkout -b docs/api-documentation-update

# Release branches
git checkout -b release/v1.2.0

# Hotfix branches
git checkout -b hotfix/security-patch
```

#### Commit Message Format

```bash
# Format: type(scope): description

# Types:
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style changes (formatting, etc.)
refactor: Code refactoring
test:     Adding or updating tests
chore:    Build process or auxiliary tool changes

# Examples:
feat(agents): add market research agent functionality
fix(workflow): resolve timeout issue in long-running workflows
docs(api): update endpoint documentation with new examples
test(services): add unit tests for workflow engine
refactor(database): optimize session query performance
```

---

## 📄 License and Attribution

### License Information

```markdown
MIT License

Copyright (c) 2025 Byte Defenders

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Third-Party Dependencies

```json
// Dependencies used in the project
{
  "dependencies": {
    "express": "^4.18.0",
    "typescript": "^5.0.0",
    "openai": "^4.0.0",
    "pg": "^8.11.0",
    "redis": "^4.6.0",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "winston": "^3.10.0",
    "zod": "^3.22.0",
    "prom-client": "^15.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.0",
    "@types/jest": "^29.5.0",
    "jest": "^29.5.0",
    "supertest": "^6.3.0",
    "eslint": "^8.45.0",
    "prettier": "^3.0.0"
  }
}
```

### Open Source Acknowledgments

This project builds upon and integrates with several excellent open source projects:

#### Core Technologies

- **Express.js** - Web framework for Node.js
- **TypeScript** - Typed superset of JavaScript
- **PostgreSQL** - Advanced open source relational database
- **Redis** - In-memory data structure store

#### AI and Machine Learning

- **OpenAI GPT-4** - Language model for natural language processing

#### Development Tools

- **Jest** - Delightful JavaScript testing framework
- **ESLint** - Pluggable JavaScript linter
- **Prettier** - Opinionated code formatter
- **Winston** - Logger for JavaScript

---

## 🔮 Future Roadmap

### Phase 1: Foundation (Current - Q1 2025)

#### ✅ Completed Features

- [x] Multi-agent workflow engine
- [x] Basic API endpoints (sessions, workflows, results)
- [x] OpenAI integration
- [x] Payment processing (RazorPay)
- [x] Session management
- [x] Basic authentication and authorization
- [x] PostgreSQL database integration
- [x] Redis caching layer
- [x] Docker containerization
- [x] Comprehensive monitoring and logging

#### 🎯 Q1 2025 Goals

- [ ] **Market Research Agent**: Automated market analysis and competitive intelligence
- [ ] **Technical Feasibility Agent**: Architecture recommendations and feasibility analysis  
- [ ] **Financial Projection Agent**: Revenue models and investment analysis
- [ ] **UI/UX Dashboard**: Interactive web interface for managing sessions and workflows
- [ ] **API v2**: RESTful API with GraphQL support
- [ ] **Mobile SDK**: iOS and Android SDKs for mobile app integration
- [ ] **Advanced Analytics**: Detailed usage analytics and performance metrics

### Phase 2: Enhancement (Q2 2025)

#### 🚀 Advanced AI Capabilities

- [ ] **Multi-Modal Agents**: Support for image, audio, and video input processing
- [ ] **Domain-Specific Agents**: Specialized agents for different industries (fintech, healthcare, education)
- [ ] **Custom Agent Training**: Allow users to train agents on their own data
- [ ] **Agent Marketplace**: Community-driven agent templates and plugins
- [ ] **Collaborative Agents**: Multiple AI models working together on complex tasks

#### 🌐 Enterprise Features

- [ ] **Single Sign-On (SSO)**: SAML, OAuth 2.0, and OpenID Connect support
- [ ] **Role-Based Access Control**: Granular permissions and team management
- [ ] **White-Label Solutions**: Customizable branding and domain
- [ ] **Audit Logging**: Comprehensive activity tracking and compliance
- [ ] **Data Residency**: Regional data storage and compliance (GDPR, CCPA)

#### 🔌 Integration Ecosystem

- [ ] **CRM Integration**: Salesforce, HubSpot, Pipedrive connectors
- [ ] **Project Management**: Jira, Asana, Trello integration
- [ ] **Communication**: Slack, Microsoft Teams, Discord bots
- [ ] **Cloud Storage**: Google Drive, Dropbox, OneDrive integration
- [ ] **Analytics**: Google Analytics, Mixpanel, Amplitude connectors

### Phase 3: Scale (Q3 2025)

#### 🏗️ Infrastructure and Performance

- [ ] **Microservices Architecture**: Service decomposition and independent scaling
- [ ] **Multi-Region Deployment**: Global presence with latency optimization
- [ ] **Edge Computing**: CDN integration for faster response times
- [ ] **Auto-Scaling**: Dynamic resource allocation based on demand
- [ ] **Serverless Functions**: Event-driven serverless workflow execution

#### 🤖 AI Model Improvements

- [ ] **Fine-Tuned Models**: Custom models trained on creative and business domains
- [ ] **Multi-Language Support**: Native support for 20+ languages
- [ ] **Specialized Models**: Industry-specific models (legal, medical, financial)
- [ ] **Model Ensemble**: Multiple AI models voting on outputs for higher accuracy
- [ ] **Real-Time Learning**: Continuous model improvement based on user feedback

### Phase 4: Intelligence (Q4 2025)

#### 🧠 Advanced AI Capabilities

- [ ] **AGI Integration**: Integration with emerging AGI models for enhanced reasoning
- [ ] **Quantum Computing**: Quantum-enhanced optimization for complex problems
- [ ] **Neural Architecture Search**: Automated design of optimal AI architectures
- [ ] **Federated Learning**: Privacy-preserving collaborative model training
- [ ] **Neuromorphic Computing**: Brain-inspired computing for efficient processing

### Phase 5: Platform (2026+)

#### 🏢 Enterprise Platform

- [ ] **Platform as a Service (PaaS)**: Complete platform for building AI-powered applications
- [ ] **Industry Solutions**: Pre-built solutions for specific industries and use cases
- [ ] **Developer Ecosystem**: SDK, APIs, and tools for third-party developers
- [ ] **Marketplace**: Comprehensive marketplace for AI agents, templates, and services
- [ ] **Enterprise Marketplace**: B2B marketplace for custom AI solutions

### Key Metrics and Success Criteria

#### User Growth Targets

- **Q1 2025**: 10,000 registered users, 1,000 active monthly users
- **Q2 2025**: 50,000 registered users, 5,000 active monthly users
- **Q3 2025**: 200,000 registered users, 20,000 active monthly users
- **Q4 2025**: 500,000 registered users, 50,000 active monthly users
- **2026**: 1,000,000 registered users, 100,000 active monthly users

#### Revenue Targets

- **Q1 2025**: $10K MRR (Monthly Recurring Revenue)
- **Q2 2025**: $50K MRR
- **Q3 2025**: $200K MRR
- **Q4 2025**: $500K MRR
- **2026**: $1M+ MRR

---

**🚀 Ready to transform your ideas into reality?**

[Get Started](#-quick-start) • [View Documentation](https://docs.byte-defenders.com) • [Join Community](https://discord.gg/byte-defenders)

Made with ❤️ by the Byte Defenders Team
