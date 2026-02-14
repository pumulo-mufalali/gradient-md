# Deployment Guide

## Agent Deployment (Python ADK)

### Prerequisites
- Python 3.10+
- `gradient-adk` installed
- `.env` file configured

### Deploy

```bash
cd agent
pip install -r requirements.txt

# Test locally first
gradient agent run --verbose

# Deploy to DigitalOcean
export DIGITALOCEAN_API_TOKEN="your-token"
gradient agent deploy
```

The deployment URL will be printed after successful deployment:
```
Deployment URL: https://agents.do-ai.run/v1/{workspace-id}/production/run
```

Save this URL as `AGENT_ENDPOINT` in your frontend `.env.local`.

## Frontend Deployment (App Platform)

### Option A: Via DigitalOcean Control Panel

1. Push code to a public GitHub repository
2. Go to **App Platform** > **Create App**
3. Connect your GitHub repo
4. Set source directory to `frontend/`
5. Add environment variables:
   - `AGENT_ENDPOINT`
   - `DIGITALOCEAN_API_TOKEN`
6. Deploy

### Option B: Via doctl CLI

```bash
doctl apps create --spec .do/app.yaml
```

### App Spec (`.do/app.yaml`)

```yaml
name: gradientmd
region: nyc
services:
  - name: frontend
    github:
      repo: your-username/gradientmd
      branch: main
      deploy_on_push: true
    source_dir: frontend
    build_command: pnpm install && pnpm build
    run_command: pnpm start
    http_port: 3000
    instance_size_slug: apps-s-1vcpu-0.5gb
    instance_count: 1
    envs:
      - key: AGENT_ENDPOINT
        value: "${AGENT_ENDPOINT}"
        type: SECRET
      - key: DIGITALOCEAN_API_TOKEN
        value: "${DIGITALOCEAN_API_TOKEN}"
        type: SECRET
```

## GPU Droplet (Fine-Tuned Model Serving)

After fine-tuning (see `fine-tuning/README.md`), serve the model:

```bash
# SSH into GPU Droplet
ssh root@your-gpu-droplet-ip

# Start vLLM server
python -m vllm.entrypoints.openai.api_server \
  --model ./output/gradientmd-medical-llama3.1-8b \
  --host 0.0.0.0 \
  --port 8000 \
  --max-model-len 4096
```

The model will be available at `http://your-gpu-droplet-ip:8000/v1`.
