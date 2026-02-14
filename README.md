# GradientMD

**AI-Powered Medical Triage Assistant** — Built entirely on DigitalOcean Gradient AI

GradientMD helps people understand their symptoms, assess urgency, and receive cited clinical guidance from WHO, CDC, and NIH sources. It uses retrieval-augmented generation over official medical guidelines to provide trustworthy, citation-backed health information.

> **Disclaimer:** GradientMD is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition.

## Features

- **Symptom Triage** — Multi-step intake that classifies urgency (Emergency / Urgent / Routine / Self-care)
- **Cited Clinical Guidance** — Every recommendation includes citations from CDC, WHO, and NIH sources
- **Drug Interaction Checker** — Check medication interactions using NIH/FDA data
- **Multi-Agent AI System** — Specialized agents for triage, Q&A, and drug interactions with intelligent routing
- **Medical Safety Guardrails** — PII anonymization, jailbreak prevention, and crisis resource routing

## Architecture

```
┌─────────────────────────────────────────────────────┐
│              Next.js Frontend (App Platform)         │
│    Triage Flow → Results → Drug Checker → Chat      │
└──────────────────────┬──────────────────────────────┘
                       │ POST /run
┌──────────────────────▼──────────────────────────────┐
│         LangGraph Multi-Agent System (ADK)           │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐    │
│  │  Triage   │  │ Medical  │  │    Drug        │    │
│  │  Agent    │  │ Q&A Agent│  │ Interaction    │    │
│  └────┬─────┘  └────┬─────┘  └──────┬─────────┘    │
│       │              │               │               │
│  ┌────▼──────────────▼───────────────▼──────────┐   │
│  │         Knowledge Bases (RAG)                 │   │
│  │    CDC Guidelines │ WHO Protocols │ NIH/FDA   │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## DigitalOcean Services Used

| Service | Purpose |
|---------|---------|
| Gradient AI Agents | Multi-agent system with LangGraph |
| Knowledge Bases | RAG over CDC/WHO/NIH clinical guidelines |
| GPU Droplets | Fine-tune Llama 3.1 8B on medical QA data |
| Serverless Inference | Direct model calls for symptom parsing |
| Guardrails | PII filter, jailbreak prevention, content moderation |
| Functions | External API calls (drug interactions, facility lookup) |
| Agent Evaluations | Medical accuracy testing (85%+ threshold) |
| Agent Tracing | Full observability of agent decisions |
| Spaces | Document storage for knowledge bases |
| App Platform | Host Next.js frontend |

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.10+
- pnpm
- DigitalOcean account with Gradient AI enabled

### Frontend

```bash
cd frontend
pnpm install
cp .env.example .env.local
# Edit .env.local with your agent endpoint and keys
pnpm dev
```

### Agent Backend

```bash
cd agent
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your DigitalOcean credentials
gradient agent run --verbose
```

### Deploy

```bash
# Deploy agent to DigitalOcean
cd agent
gradient agent deploy

# Deploy frontend to App Platform
# See docs/deployment.md for instructions
```

## Project Structure

```
gradientmd/
├── frontend/          # Next.js 16 (TypeScript, Tailwind CSS)
├── agent/             # Python ADK backend (LangGraph multi-agent)
├── fine-tuning/       # Scripts and data for GPU Droplet fine-tuning
├── functions/         # DigitalOcean Functions (external APIs)
├── evaluations/       # Agent evaluation test cases
├── data/              # Clinical guideline documents for Knowledge Base
├── docs/              # Project documentation
└── README.md
```

## License

MIT — see [LICENSE](LICENSE)
