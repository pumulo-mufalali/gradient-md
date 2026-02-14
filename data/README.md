# Knowledge Base Data Sources

This directory contains reference lists and preparation scripts for the documents
ingested into DigitalOcean Gradient AI Knowledge Bases.

## Directory Structure

```
data/
├── cdc/          # CDC clinical guideline PDFs
├── who/          # WHO treatment protocol PDFs
├── nih/          # NIH/FDA drug interaction data
├── urls.json     # Web crawl seed URLs for each KB
└── README.md
```

## Document Sources

### CDC Clinical Guidelines (`cdc/`)
Download these PDFs and place them in `data/cdc/`:

1. **Emergency Triage Protocols**
   - ESI (Emergency Severity Index) Handbook v4
   - URL: https://www.ahrq.gov/patient-safety/settings/emergency/esi.html

2. **Symptom-Specific Guidelines**
   - Acute Respiratory Illness guidelines
   - Chest Pain evaluation protocols
   - Headache assessment guidelines
   - Abdominal Pain triage criteria
   - Fever evaluation in adults

3. **Disease-Specific Guidelines**
   - COVID-19 clinical guidance
   - Influenza treatment guidelines
   - STI treatment guidelines

### WHO Treatment Protocols (`who/`)
Download these PDFs and place them in `data/who/`:

1. **Essential Medicines**
   - WHO Model List of Essential Medicines (23rd edition)
   - URL: https://www.who.int/publications/i/item/WHO-MHP-HPS-EML-2023.02

2. **Disease Fact Sheets**
   - Top 20 disease fact sheets (diabetes, hypertension, asthma, etc.)

3. **Clinical Treatment Guidelines**
   - WHO guidelines on pain management
   - Mental health gap action programme (mhGAP)

### NIH/FDA Drug Database (`nih/`)

1. **Drug Interaction Data**
   - Export from OpenFDA drug interaction database
   - DailyMed drug label data
   - URL: https://dailymed.nlm.nih.gov/dailymed/

2. **Medication Guides**
   - FDA medication guides for high-risk drugs
   - URL: https://www.fda.gov/drugs/drug-safety-and-availability/medication-guides

## Web Crawl URLs

The following URLs are used as seed URLs for Knowledge Base web crawling:

```json
{
  "cdc": [
    "https://www.cdc.gov/clinical-guidance/index.html",
    "https://www.cdc.gov/emergency/index.html"
  ],
  "who": [
    "https://www.who.int/publications/guidelines",
    "https://www.who.int/health-topics"
  ],
  "nih": [
    "https://dailymed.nlm.nih.gov/dailymed/",
    "https://medlineplus.gov/druginformation.html"
  ]
}
```

## Ingestion Instructions

1. Download PDFs into respective directories
2. Upload to DigitalOcean Spaces or directly to Knowledge Base via Control Panel
3. Configure web crawling with seed URLs above
4. Use Qwen3 Embedding 0.6B model for all knowledge bases
5. Set hierarchical chunking (parent: 750, child: 400)
6. Start indexing and monitor via Activity Logs
