import { NextRequest, NextResponse } from "next/server";

const AGENT_ENDPOINT = process.env.AGENT_ENDPOINT;
const DIGITALOCEAN_API_TOKEN = process.env.DIGITALOCEAN_API_TOKEN;

interface SymptomData {
  age: string;
  sex: string;
  symptoms: string;
  duration: string;
  severity: string;
  medications?: string;
  conditions?: string;
  additionalInfo?: string;
}

export async function POST(request: NextRequest) {
  try {
    const symptomData: SymptomData = await request.json();

    // Validate required fields
    if (!symptomData.age || !symptomData.sex || !symptomData.symptoms) {
      return NextResponse.json(
        { error: "Missing required fields: age, sex, and symptoms are required" },
        { status: 400 }
      );
    }

    if (!AGENT_ENDPOINT || !DIGITALOCEAN_API_TOKEN) {
      console.error("Agent endpoint not configured. Using fallback response.");
      return NextResponse.json(getFallbackResponse(), { status: 200 });
    }

    // Send structured JSON data to the agent
    const prompt = JSON.stringify({
      type: "triage_assessment",
      patient: {
        age: symptomData.age,
        sex: symptomData.sex,
        symptoms: symptomData.symptoms,
        duration: symptomData.duration,
        severity: symptomData.severity,
        medications: symptomData.medications || "None",
        conditions: symptomData.conditions || "None",
        additionalInfo: symptomData.additionalInfo || "None",
      },
      instructions: "Perform a medical triage assessment and classify urgency as EMERGENCY, URGENT, ROUTINE, or SELF_CARE. Provide citations from clinical guidelines.",
    });

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
      return NextResponse.json(getFallbackResponse(), { status: 200 });
    }

    const agentResponse = await response.json();

    // Parse the agent's response
    let triageResult;
    try {
      const content = agentResponse.response || agentResponse;
      triageResult = typeof content === "string" ? JSON.parse(content) : content;

      // Validate the response structure
      if (!triageResult.severity || !triageResult.title) {
        throw new Error("Invalid response structure");
      }
    } catch (parseError) {
      console.error("Failed to parse agent response:", parseError);
      return NextResponse.json(getFallbackResponse(), { status: 200 });
    }

    return NextResponse.json(triageResult);
  } catch (error) {
    console.error("Triage API error:", error);
    return NextResponse.json(getFallbackResponse(), { status: 200 });
  }
}

function getFallbackResponse() {
  return {
    severity: "ROUTINE",
    title: "Assessment Unavailable",
    summary:
      "We're unable to complete a full assessment at this time. If you're experiencing severe symptoms, please seek immediate medical attention.",
    recommendations: [
      "Contact your primary care physician for an evaluation",
      "If symptoms are severe or worsening, call 911 or go to the nearest emergency room",
      "Monitor your symptoms and seek care if they persist or worsen",
    ],
    citations: [],
    nextSteps: [
      "Schedule an appointment with your healthcare provider",
      "Keep track of your symptoms and any changes",
      "If this is an emergency, call 911 immediately",
    ],
    warningSignsToWatch: [
      "Sudden severe pain",
      "Difficulty breathing or shortness of breath",
      "Chest pain or pressure",
      "Confusion or altered mental status",
      "Loss of consciousness",
      "Severe bleeding",
      "Signs of stroke (facial drooping, arm weakness, speech difficulty)",
    ],
  };
}
