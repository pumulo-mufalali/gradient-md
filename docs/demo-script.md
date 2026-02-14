# GradientMD Demo Video Script (3 minutes)

## Recording Tips
- Use screen recording software (OBS, Loom, or similar)
- Record at 1080p or higher
- Use a clear microphone
- Upload to YouTube as unlisted or public

---

## Script

### Opening (0:00 - 0:20)
**[Show title card with GradientMD logo]**

"One in three Americans delay medical care because they can't tell if their
symptoms are serious. GradientMD changes that. It's an AI-powered triage
assistant that analyzes your symptoms and gives you cited clinical guidance
from the CDC, WHO, and NIH — built entirely on DigitalOcean Gradient AI."

### Live Demo: Symptom Triage (0:20 - 1:10)
**[Navigate to gradientmd.app/triage]**

"Let me show you how it works. I'll enter some symptoms..."

1. Fill in the symptom form:
   - Age: 55, Sex: Male
   - Symptoms: "Persistent headache on the right side for the past 3 days,
     with mild nausea and sensitivity to light"
   - Duration: 1-3 days
   - Severity: 6/10
   - No medications, no existing conditions

2. Click "Get Triage Assessment"

**[Show the results page]**

"The AI classified this as ROUTINE urgency — see a doctor within a few days.
Notice every recommendation cites a specific clinical guideline. These aren't
hallucinated — they come from our CDC and WHO knowledge bases through
retrieval-augmented generation."

**[Scroll to citations]**

"Each citation shows the source document, the relevant excerpt, and a link."

### Drug Interaction Check (1:10 - 1:40)
**[Navigate to /interactions]**

"GradientMD also checks drug interactions. Let me enter Warfarin and Aspirin..."

**[Enter medications and click Check]**

"It flags this as a HIGH risk interaction — increased bleeding risk — citing
the FDA drug label database. This data comes from our NIH/FDA knowledge base
and the OpenFDA API through DigitalOcean Function routing."

### Architecture & DigitalOcean Dashboard (1:40 - 2:30)
**[Switch to DigitalOcean Control Panel]**

"Let me show you what's powering this under the hood — everything runs on
DigitalOcean."

1. **Agent Platform**: "Here's our multi-agent system. A router agent
   classifies your query and routes it to either the Triage Agent, Medical
   Q&A Agent, or Drug Interaction Agent."

2. **Knowledge Bases**: "We have three knowledge bases — CDC clinical
   guidelines, WHO treatment protocols, and NIH/FDA drug data. These provide
   the RAG context for every answer."

3. **Guardrails**: "All agents have three guardrail layers — PII protection,
   jailbreak prevention, and content moderation. If someone mentions self-harm,
   it routes them to the 988 crisis lifeline."

4. **Agent Tracing**: "Every decision is traced — you can see the full
   reasoning chain: routing, retrieval, generation."

5. **GPU Droplet**: "We fine-tuned Llama 3.1 8B on medical QA datasets using
   QLoRA on this GPU Droplet to improve medical reasoning accuracy."

6. **Evaluations**: "We run automated evaluations against curated medical test
   cases — currently scoring 87% on medical accuracy."

### Impact & Closing (2:30 - 3:00)
**[Back to the app]**

"GradientMD makes medical guidance accessible, cited, and trustworthy.
Every answer is backed by real clinical guidelines — not AI hallucinations.
It uses 12 DigitalOcean Gradient AI features: agents, knowledge bases, GPU
fine-tuning, serverless inference, guardrails, function routing, evaluations,
tracing, feedback, Spaces, and App Platform."

"Healthcare shouldn't be confusing. GradientMD helps you understand your
symptoms so you know when to rest and when to seek care."

**[Show title card: "GradientMD — Powered by DigitalOcean Gradient AI"]**

---

## Key Points to Hit

- [ ] Show live symptom triage with cited results
- [ ] Show drug interaction checker
- [ ] Show DigitalOcean dashboard (agents, KBs, GPU, traces)
- [ ] Mention the number of DO services used (12)
- [ ] Mention fine-tuning on GPU Droplet
- [ ] Mention guardrails (especially crisis detection)
- [ ] End with impact statement
