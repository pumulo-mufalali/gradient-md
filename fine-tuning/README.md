# Fine-Tuning Pipeline

Fine-tune Llama 3.1 8B Instruct on medical QA datasets using QLoRA on a DigitalOcean GPU Droplet.

## Prerequisites

- DigitalOcean GPU Droplet (NVIDIA RTX 4000 Ada or L40S)
- Python 3.10+
- Hugging Face account (for Llama model access)

## Setup on GPU Droplet

```bash
# SSH into the GPU Droplet
ssh root@your-gpu-droplet-ip

# Clone the repo
git clone https://github.com/your-username/gradientmd.git
cd gradientmd/fine-tuning

# Create virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Login to Hugging Face (for Llama access)
huggingface-cli login
```

## Step 1: Prepare Data

```bash
python prepare_data.py
```

This downloads MedQA and PubMedQA datasets and formats them for instruction tuning.

Output:
- `data/processed/train.jsonl`
- `data/processed/val.jsonl`

## Step 2: Train

```bash
python train.py
```

Estimated time: 2-4 hours on a single GPU.

Output:
- `output/gradientmd-medical-llama3.1-8b/` (model weights + tokenizer)

## Step 3: Evaluate

```bash
python evaluate.py --model output/gradientmd-medical-llama3.1-8b --samples 100
```

## Step 4: Serve with vLLM

```bash
pip install vllm

python -m vllm.entrypoints.openai.api_server \
  --model output/gradientmd-medical-llama3.1-8b \
  --host 0.0.0.0 \
  --port 8000 \
  --max-model-len 4096
```

The model is now accessible at `http://your-gpu-droplet-ip:8000/v1` as an OpenAI-compatible API.

Set this URL as `FINE_TUNED_MODEL_URL` in your agent `.env` file.
