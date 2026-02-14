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
      return NextResponse.json(
        { error: "Agent endpoint not configured" },
        { status: 500 }
      );
    }

    const prompt = `Check for drug interactions between the following medications:
${medications.map((m: string, i: number) => `${i + 1}. ${m}`).join("\n")}

Use the NIH/FDA drug interaction database to identify potential interactions.
Return the response as JSON with this exact structure:
{
  "interactions": [
    {
      "drug1": "medication name",
      "drug2": "medication name",
      "severity": "high|moderate|low",
      "description": "description of the interaction and its clinical significance",
      "source": "NIH DailyMed / FDA / other source"
    }
  ],
  "summary": "Brief overall summary of the interaction check results"
}

If no interactions are found, return an empty interactions array with an appropriate summary.`;

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
      return NextResponse.json(
        { error: "Agent request failed" },
        { status: response.status }
      );
    }

    const agentResponse = await response.json();

    let result;
    try {
      const content = agentResponse.response || agentResponse;
      result = typeof content === "string" ? JSON.parse(content) : content;
    } catch {
      result = {
        interactions: [],
        summary:
          agentResponse.response ||
          "Unable to parse interaction results. Please consult your pharmacist.",
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Interactions API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
