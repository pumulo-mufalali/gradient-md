# DigitalOcean Setup Guide

Step-by-step instructions for setting up all DigitalOcean services for GradientMD.

## 1. Create a DigitalOcean Account

1. Sign up at [cloud.digitalocean.com](https://cloud.digitalocean.com)
2. Complete account verification

## 2. Enable Gradient AI Platform

1. In the Control Panel, click **Agent Platform** in the left menu
2. If prompted, enable the Gradient AI Platform feature
3. For ADK access, go to **Feature Preview** and enable **Agent Development Kit**

## 3. Create API Tokens

### Personal Access Token (for ADK deployment)
1. Go to **API** > **Tokens** in the Control Panel
2. Click **Generate New Token**
3. Name it `GradientMD-ADK`
4. Set scopes: Create/Read/Update/Delete for `genai`, Read for `project`
5. Save the token as `DIGITALOCEAN_API_TOKEN` in your `.env` file

### Model Access Key (for Serverless Inference)
1. Go to **Agent Platform** > **Serverless Inference**
2. Scroll to **Model Access Keys**
3. Click **Create Access Key**
4. Save as `GRADIENT_MODEL_ACCESS_KEY` in your `.env` file

## 4. Create Knowledge Bases

### CDC Clinical Guidelines KB
1. Click **Create** > **Knowledge Bases**
2. Name: `CDC Clinical Guidelines`
3. Data source: **URL for web crawling**
   - Seed URL: `https://www.cdc.gov/clinical-guidance/index.html`
   - Also upload PDF files from `data/cdc/` directory
4. OpenSearch: Create new cluster (Basic plan)
5. Embedding model: **Qwen3 Embedding 0.6B**
6. Chunking: **Hierarchical** (parent: 750, child: 400)
7. Create and wait for indexing to complete

### WHO Treatment Protocols KB
1. Click **Create** > **Knowledge Bases**
2. Name: `WHO Treatment Protocols`
3. Data source: **URL for web crawling**
   - Seed URL: `https://www.who.int/publications/guidelines`
   - Also upload PDF files from `data/who/` directory
4. OpenSearch: Use existing cluster
5. Embedding model: **Qwen3 Embedding 0.6B**
6. Chunking: **Hierarchical** (parent: 750, child: 400)

### NIH/FDA Drug Database KB
1. Click **Create** > **Knowledge Bases**
2. Name: `NIH FDA Drug Database`
3. Data source: **File upload**
   - Upload drug interaction data from `data/nih/` directory
   - Also crawl: `https://dailymed.nlm.nih.gov`
4. OpenSearch: Use existing cluster
5. Embedding model: **Qwen3 Embedding 0.6B**
6. Chunking: **Semantic** (for drug data which is less structured)

## 5. Create Agents (via Control Panel, for non-ADK agents)

If not using the ADK, create agents manually:

### Router Agent
1. **Create Agent** > Name: `GradientMD Router`
2. Model: `llama3.3-70b-instruct`
3. Instructions: See `agent/prompts/router_prompt.py`
4. Attach all 3 knowledge bases
5. Add child agent routes to Triage, Q&A, and Drug Check agents

### Triage Agent
1. **Create Agent** > Name: `GradientMD Triage`
2. Model: `llama3.3-70b-instruct`
3. Instructions: See `agent/prompts/triage_prompt.py`
4. Attach CDC and WHO knowledge bases

### Medical Q&A Agent
1. **Create Agent** > Name: `GradientMD Medical QA`
2. Model: `llama3.3-70b-instruct`
3. Instructions: See `agent/prompts/qa_prompt.py`
4. Attach all 3 knowledge bases

### Drug Interaction Agent
1. **Create Agent** > Name: `GradientMD Drug Check`
2. Model: `llama3.3-70b-instruct`
3. Instructions: See `agent/prompts/drug_prompt.py`
4. Attach NIH/FDA knowledge base

## 6. Attach Guardrails

For each agent created above:
1. Go to agent **Settings** > **Guardrails**
2. Attach:
   - **Sensitive Data** (anonymize PII)
   - **Jailbreak** (prevent prompt injection)
   - **Content Moderation** (filter harmful content)

## 7. Create Access Keys

For each agent:
1. Go to agent **Settings** > **Endpoint Access Keys**
2. Click **Create Key**
3. Save the key securely

## 8. Set Up GPU Droplet (for Fine-Tuning)

1. Go to **Droplets** > **Create Droplet**
2. Choose **GPU Droplet**
3. Image: AI/ML Ready (Ubuntu 22.04, CUDA 12.9, NVIDIA 575)
4. Size: Single NVIDIA RTX 4000 Ada (for budget) or L40S (for speed)
5. Region: Choose closest to you
6. SSH key: Add your SSH key
7. Create and note the IP address

## 9. Deploy to App Platform

1. Go to **App Platform** > **Create App**
2. Source: GitHub repo
3. Build: Next.js (auto-detected)
4. Source directory: `frontend/`
5. Environment variables:
   - `AGENT_ENDPOINT`: Your deployed ADK agent URL
   - `DIGITALOCEAN_API_TOKEN`: Your API token
6. Deploy

## Environment Variables Summary

```bash
# .env for agent/
DIGITALOCEAN_API_TOKEN=dop_v1_xxxx
GRADIENT_MODEL_ACCESS_KEY=xxxx
FINE_TUNED_MODEL_URL=http://gpu-droplet-ip:8000/v1

# .env.local for frontend/
AGENT_ENDPOINT=https://agents.do-ai.run/v1/workspace-id/production/run
DIGITALOCEAN_API_TOKEN=dop_v1_xxxx
```
