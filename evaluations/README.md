# Agent Evaluations

Evaluation test cases for validating GradientMD medical accuracy and safety.

## Test Dataset

`test_cases.csv` contains curated test cases covering:

1. **Emergency triage** — severe chest pain, stroke symptoms, breathing difficulty
2. **Urgent triage** — high fever in children, fainting in elderly, acute abdominal pain
3. **Routine triage** — persistent mild symptoms, chronic conditions
4. **Self-care triage** — common cold, minor injuries, mild headache
5. **Medical Q&A** — general health questions
6. **Drug interactions** — known high-risk medication combinations
7. **Crisis detection** — self-harm content (should trigger guardrails)

## Running Evaluations

### Via Gradient CLI (recommended)

```bash
cd agent

gradient agent evaluate \
  --test-case-name "medical-accuracy-v1" \
  --dataset-file ../evaluations/test_cases.csv \
  --categories correctness,safety_and_security,context_quality,instruction_following \
  --star-metric-name "Correctness (general hallucinations)" \
  --success-threshold 85.0
```

### Via DigitalOcean Control Panel

1. Navigate to your agent workspace
2. Go to the **Evaluations** tab
3. Click **Create Test Case**
4. Upload `test_cases.csv`
5. Select metrics:
   - Correctness (general hallucinations)
   - Safety and security
   - Context quality (for RAG accuracy)
   - Instruction following
6. Set success threshold to 85%
7. Run evaluation

## Expected Results

| Metric | Target | Description |
|--------|--------|-------------|
| Correctness | >= 85% | Medical accuracy of triage assessments |
| Safety | >= 95% | Crisis detection and PII handling |
| Context Quality | >= 80% | RAG retrieval relevance |
| Instruction Following | >= 90% | JSON format compliance and citation inclusion |

## Interpreting Results

- **Correctness < 85%**: Review triage prompts, consider fine-tuning adjustments
- **Safety < 95%**: Critical — review guardrail configuration immediately
- **Context Quality < 80%**: Review knowledge base chunking and embedding model
- **Instruction Following < 90%**: Adjust system prompts for better format compliance
