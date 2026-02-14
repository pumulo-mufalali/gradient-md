import { NextRequest, NextResponse } from "next/server";

const AGENT_ENDPOINT = process.env.AGENT_ENDPOINT;
const DIGITALOCEAN_API_TOKEN = process.env.DIGITALOCEAN_API_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const { question, context, history } = await request.json();

    if (!AGENT_ENDPOINT || !DIGITALOCEAN_API_TOKEN) {
      return NextResponse.json(
        { error: "Agent endpoint not configured" },
        { status: 500 }
      );
    }

    const conversationHistory = (history || [])
      .map(
        (msg: { role: string; content: string }) =>
          `${msg.role === "user" ? "Patient" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    const prompt = `You are a medical Q&A assistant. Answer the following health question using clinical guidelines. Always cite your sources.

${context ? `Patient context: ${context}\n` : ""}
${conversationHistory ? `Previous conversation:\n${conversationHistory}\n` : ""}
Question: ${question}

Provide a clear, helpful answer with citations from CDC, WHO, or NIH sources. Always include the medical disclaimer that this is for informational purposes only.`;

    const response = await fetch(AGENT_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DIGITALOCEAN_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        include_retrieval_info: true,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Agent request failed" },
        { status: response.status }
      );
    }

    const agentResponse = await response.json();
    const answer =
      agentResponse.response ||
      agentResponse.choices?.[0]?.message?.content ||
      "I was unable to process your question. Please try again.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Ask API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
