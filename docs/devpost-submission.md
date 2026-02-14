# Devpost Submission — GradientMD

## Project Title
GradientMD — AI-Powered Medical Triage Assistant

## Tagline
Understand your symptoms and get cited clinical guidance from CDC, WHO, and NIH sources — powered by DigitalOcean Gradient AI.

## Project Description

### What it does
GradientMD is an AI-powered medical triage assistant that helps people understand their symptoms, assess urgency, and receive clinical guidance backed by citations from official sources.

Users describe their symptoms through a guided intake form, and GradientMD's multi-agent AI system:
- **Classifies urgency** (Emergency / Urgent / Routine / Self-care) based on clinical guidelines
- **Provides cited recommendations** with references to CDC, WHO, and NIH documents
- **Checks drug interactions** using the NIH/FDA database
- **Routes crisis situations** to the 988 Suicide & Crisis Lifeline

Every answer includes citations from real clinical guidelines — not AI hallucinations.

### How we built it
GradientMD is built entirely on DigitalOcean's Gradient AI platform, using **12 Gradient AI features**:

| Feature | How We Use It |
|---------|--------------|
| **Agents (ADK)** | Multi-agent LangGraph system with Router, Triage, Q&A, and Drug Interaction agents |
| **Knowledge Bases** | 3 KBs with CDC guidelines, WHO protocols, and NIH/FDA drug data for RAG |
| **GPU Droplets** | Fine-tuned Llama 3.1 8B on MedQA and PubMedQA datasets using QLoRA |
| **Serverless Inference** | Direct model calls for query routing and symptom parsing |
| **Guardrails** | PII anonymization, jailbreak prevention, and crisis content detection |
| **Function Routing** | OpenFDA drug interaction API, CMS facility lookup, emergency numbers |
| **Agent Evaluations** | Automated medical accuracy testing (85%+ threshold) |
| **Agent Tracing** | Full observability of every triage decision chain |
| **Agent Feedback** | Thumbs up/down feedback collection from users |
| **Spaces** | Document storage for knowledge base data |
| **App Platform** | Hosts the Next.js frontend |
| **Multi-Agent Routing** | Intelligent query classification and specialist routing |

**Tech stack:**
- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Backend: Python, Gradient AI ADK, LangGraph
- AI: Llama 3.1 8B (fine-tuned), Llama 3.3 70B (serverless inference)
- Infrastructure: 100% DigitalOcean

### Challenges we ran into
- Ensuring medical accuracy without hallucinations — solved with RAG over verified clinical guidelines
- Balancing response speed with comprehensive retrieval — optimized with hierarchical chunking
- Handling crisis situations responsibly — implemented content moderation guardrails with 988 routing

### Accomplishments we're proud of
- 12 DigitalOcean Gradient AI features integrated into a single cohesive application
- Fine-tuned a medical LLM that outperforms the base model on medical QA benchmarks
- Built a responsible AI system with three layers of guardrails for medical safety
- Every recommendation is backed by citations from real clinical guidelines

### What we learned
- The full power of DigitalOcean's Gradient AI platform for building production AI apps
- How to build reliable RAG pipelines over medical documents
- The importance of responsible AI practices in healthcare applications
- How multi-agent architectures can create more accurate and specialized AI systems

### What's next for GradientMD
- Expand knowledge bases with more clinical guidelines and drug data
- Add multilingual support (Spanish as the first additional language)
- Implement user accounts for persistent health tracking
- Partner with healthcare providers for clinical validation
- Add telemedicine referral integration

## Built With
- digitalocean-gradient-ai
- langgraph
- nextjs
- react
- typescript
- tailwindcss
- python
- llama
- qlora

## Links
- **GitHub:** https://github.com/your-username/gradientmd
- **Demo:** https://gradientmd.ondigitalocean.app
- **Video:** https://youtube.com/watch?v=YOUR_VIDEO_ID
