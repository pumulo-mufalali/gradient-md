import { NextRequest, NextResponse } from "next/server";

const AGENT_ENDPOINT = process.env.AGENT_ENDPOINT;
const DIGITALOCEAN_API_TOKEN = process.env.DIGITALOCEAN_API_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const symptomData = await request.json();

    if (!AGENT_ENDPOINT || !DIGITALOCEAN_API_TOKEN) {
      return NextResponse.json(
        { error: "Agent endpoint not configured" },
        { status: 500 }
      );
    }

    const prompt = `Perform a medical triage assessment for the following patient information:

Age: ${symptomData.age}
Sex: ${symptomData.sex}
Symptoms: ${symptomData.symptoms}
Duration: ${symptomData.duration}
Severity (self-reported): ${symptomData.severity}/10
Current Medications: ${symptomData.medications || "None"}
Existing Conditions: ${symptomData.conditions || "None"}
Additional Info: ${symptomData.additionalInfo || "None"}

Classify the urgency as one of: EMERGENCY, URGENT, ROUTINE, SELF_CARE.
Provide your assessment with citations from clinical guidelines.
Return the response as JSON with this exact structure:
{
  "severity": "EMERGENCY|URGENT|ROUTINE|SELF_CARE",
  "title": "Brief condition title",
  "summary": "1-2 sentence summary",
  "recommendations": ["recommendation 1", "recommendation 2"],
  "citations": [{"source": "CDC|WHO|NIH", "document": "document name", "excerpt": "relevant quote", "url": "optional url"}],
  "nextSteps": ["step 1", "step 2"],
  "warningSignsToWatch": ["sign 1", "sign 2"]
}`;

    const response = await fetch(AGENT_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DIGITALOCEAN_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        include_retrieval_info: true,
        include_guardrails_info: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Agent error:", errorText);
      return NextResponse.json(
        { error: "Agent request failed" },
        { status: response.status }
      );
    }

    const agentResponse = await response.json();

    // Parse the agent's response - the LangGraph agent returns structured JSON
    let triageResult;
    try {
      const content = agentResponse.response || agentResponse;
      triageResult =
        typeof content === "string" ? JSON.parse(content) : content;
    } catch {
      // If the agent returns unstructured text, wrap it
      triageResult = {
        severity: "ROUTINE",
        title: "Assessment Complete",
        summary: agentResponse.response || "Please consult a healthcare provider for a detailed assessment.",
        recommendations: [
          "Consider scheduling an appointment with your primary care physician.",
        ],
        citations: [],
        nextSteps: [
          "Monitor your symptoms",
          "Seek immediate care if symptoms worsen",
        ],
        warningSignsToWatch: [
          "Sudden worsening of symptoms",
          "New or unusual symptoms",
        ],
      };
    }

    return NextResponse.json(triageResult);
  } catch (error) {
    console.error("Triage API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
