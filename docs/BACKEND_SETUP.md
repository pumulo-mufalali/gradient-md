# GradientMD Backend API Setup

This document explains how to set up and deploy the GradientMD backend API.

## Architecture Overview

GradientMD uses a **multi-agent architecture** powered by:
- **LangGraph** for agent orchestration
- **DigitalOcean Gradient AI** for serverless inference
- **Next.js API Routes** as the frontend-backend bridge
- **Knowledge Bases** for RAG (CDC, WHO, NIH guidelines)

```
Frontend (Next.js) → API Routes → Agent Endpoint (DigitalOcean) → Multi-Agent System
```

## Local Development Setup

### 1. Environment Configuration

Create `frontend/.env.local`:

```bash
# For local development with mock agent
AGENT_ENDPOINT=http://localhost:3000/api/mock-agent
DIGITALOCEAN_API_TOKEN=dev-token-placeholder
```

The mock agent endpoint (`/api/mock-agent`) simulates the deployed agent for testing without requiring DigitalOcean deployment.

### 2. Test the Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Visit `http://localhost:3000` and test the triage flow. The mock agent will return realistic sample responses.

## Production Deployment

### Prerequisites

1. **DigitalOcean Account** with Gradient AI access
2. **DigitalOcean API Token** ([create one here](https://cloud.digitalocean.com/account/api/tokens))
3. **doctl CLI** installed and configured

### Step 1: Deploy the Agent

```bash
cd agent

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your credentials:
# - DIGITALOCEAN_API_TOKEN
# - GRADIENT_MODEL_ACCESS_KEY

# Deploy the agent to DigitalOcean
doctl serverless deploy .
```

After deployment, you'll receive an **agent endpoint URL** like:
```
https://your-namespace-abc123.do-ai.run
```

### Step 2: Configure Frontend Environment

Update `frontend/.env.local` with your production values:

```bash
# Production agent endpoint
AGENT_ENDPOINT=https://your-namespace-abc123.do-ai.run
DIGITALOCEAN_API_TOKEN=your_actual_api_token_here
```

### Step 3: Deploy Frontend

Deploy to Vercel, Netlify, or DigitalOcean App Platform:

#### Option A: Vercel (Recommended)

```bash
cd frontend
vercel --prod
```

Add environment variables in Vercel dashboard:
- `AGENT_ENDPOINT`
- `DIGITALOCEAN_API_TOKEN`

#### Option B: DigitalOcean App Platform

The `.do/app.yaml` file is already configured. Deploy via:

```bash
doctl apps create --spec .do/app.yaml
```

## API Endpoints

### POST `/api/triage`

Performs medical triage assessment.

**Request:**
```json
{
  "age": "35",
  "sex": "male",
  "symptoms": "persistent headache, nausea",
  "duration": "2-3 days",
  "severity": "6",
  "medications": "ibuprofen",
  "conditions": "none",
  "additionalInfo": "stress at work"
}
```

**Response:**
```json
{
  "severity": "ROUTINE|URGENT|EMERGENCY|SELF_CARE",
  "title": "Condition title",
  "summary": "Assessment summary",
  "recommendations": ["..."],
  "citations": [{
    "source": "CDC|WHO|NIH",
    "document": "...",
    "excerpt": "...",
    "url": "..."
  }],
  "nextSteps": ["..."],
  "warningSignsToWatch": ["..."]
}
```

### POST `/api/interactions`

Checks for drug-drug interactions.

**Request:**
```json
{
  "medications": ["Lisinopril", "Ibuprofen", "Metformin"]
}
```

**Response:**
```json
{
  "interactions": [{
    "drug1": "Lisinopril",
    "drug2": "Ibuprofen",
    "severity": "moderate",
    "description": "...",
    "source": "FDA"
  }],
  "summary": "Overall interaction summary"
}
```

### POST `/api/ask`

Medical Q&A with RAG citations.

**Request:**
```json
{
  "question": "What are the symptoms of diabetes?",
  "context": "Patient has family history",
  "history": [
    {"role": "user", "content": "Previous question"},
    {"role": "assistant", "content": "Previous answer"}
  ]
}
```

**Response:**
```json
{
  "answer": "Detailed answer with citations..."
}
```

## Agent Architecture

The `agent/` directory contains the multi-agent system:

```
agent/
├── main.py                 # LangGraph workflow entrypoint
├── agents/
│   ├── router.py          # Routes queries to specialist agents
│   ├── triage.py          # Symptom assessment agent
│   ├── medical_qa.py      # Q&A agent with RAG
│   └── drug_check.py      # Drug interaction agent
├── prompts/               # System prompts for each agent
├── tools/                 # Knowledge base search tools
└── models/                # Data models
```

### Agent Flow

1. **Router Agent** classifies the query type
2. Routes to appropriate specialist:
   - **Triage Agent** → symptom assessment
   - **Medical Q&A Agent** → health questions
   - **Drug Check Agent** → medication interactions
3. Specialist retrieves relevant knowledge from RAG
4. Response formatted and returned

## Troubleshooting

### "Agent endpoint not configured" error

- Ensure `.env.local` exists with `AGENT_ENDPOINT` set
- For local dev, use the mock endpoint
- For production, deploy the agent first

### Agent returns errors

- Check agent logs: `doctl serverless activations logs`
- Verify API token has correct permissions
- Ensure knowledge bases are deployed

### Mock agent not working

- Restart the dev server: `pnpm dev`
- Check console for errors
- Verify `/api/mock-agent/route.ts` exists

## Next Steps

1. ✅ **Local Testing**: Use mock agent for development
2. 🚀 **Deploy Agent**: Push to DigitalOcean Gradient AI
3. 🔗 **Connect Frontend**: Update environment variables
4. 📊 **Monitor**: Set up logging and analytics
5. 🔒 **Secure**: Add rate limiting and authentication

## Resources

- [DigitalOcean Gradient AI Docs](https://docs.digitalocean.com/products/ai/)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
