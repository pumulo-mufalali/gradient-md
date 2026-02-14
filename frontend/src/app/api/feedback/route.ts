import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { resultId, feedback } = await request.json();

    // Log feedback for now - in production this would go to Gradient AI agent feedback
    console.log(`Feedback received: ${feedback} for result: ${resultId}`);

    // TODO: Send feedback to Gradient AI agent via the feedback API
    // This would use the agent tracing feedback endpoint

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
