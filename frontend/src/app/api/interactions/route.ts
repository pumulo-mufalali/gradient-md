import { NextRequest, NextResponse } from "next/server";

const AGENT_ENDPOINT = process.env.AGENT_ENDPOINT;
const DIGITALOCEAN_API_TOKEN = process.env.DIGITALOCEAN_API_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const { medications } = await request.json();

    if (!medications || medications.length < 2) {
      return NextResponse.json(
        { error: "At least 2 medications are required" },
        { status: 400 }
      );
    }

    if (!AGENT_ENDPOINT || !DIGITALOCEAN_API_TOKEN) {
      console.error("Agent endpoint not configured. Using fallback response.");
      return NextResponse.json(getFallbackResponse(medications), {
        status: 200,
      });
    }

    // Send structured JSON data to the agent
    const prompt = JSON.stringify({
      type: "drug_interaction_check",
      medications: medications,
      instructions:
        "Check for drug-drug interactions using the NIH/FDA database. Return severity levels (high/moderate/low) and clinical significance.",
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
        include_functions_info: true,
      }),
    });

    if (!response.ok) {
      console.error("Agent request failed");
      return NextResponse.json(getFallbackResponse(medications), {
        status: 200,
      });
    }

    const agentResponse = await response.json();

    let result;
    try {
      const content = agentResponse.response || agentResponse;
      result = typeof content === "string" ? JSON.parse(content) : content;

      // Validate response structure
      if (!result.interactions || !Array.isArray(result.interactions)) {
        throw new Error("Invalid response structure");
      }
    } catch (parseError) {
      console.error("Failed to parse agent response:", parseError);
      return NextResponse.json(getFallbackResponse(medications), {
        status: 200,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Interactions API error:", error);
    return NextResponse.json(
      {
        interactions: [],
        summary:
          "An error occurred while checking for interactions. Please consult your pharmacist or healthcare provider.",
      },
      { status: 200 }
    );
  }
}

function getFallbackResponse(medications: string[]) {
  return {
    interactions: [],
    summary: `Unable to check interactions for ${medications.length} medications at this time. Please consult your pharmacist or healthcare provider for a comprehensive interaction review. Always inform your healthcare providers about all medications you're taking, including over-the-counter drugs and supplements.`,
    disclaimer:
      "This tool is for informational purposes only and should not replace professional medical advice.",
  };
}
