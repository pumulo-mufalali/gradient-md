import { NextRequest, NextResponse } from "next/server";

/**
 * Mock Agent Endpoint for Local Development
 * 
 * This simulates the deployed GradientMD agent for testing the frontend
 * without needing to deploy to DigitalOcean.
 * 
 * In production, replace AGENT_ENDPOINT in .env.local with your actual
 * deployed agent URL.
 */

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Detect the type of request based on prompt content
    if (prompt.includes("triage assessment") || prompt.includes("Age:")) {
      // Mock triage response
      return NextResponse.json({
        response: JSON.stringify({
          severity: "ROUTINE",
          title: "Possible Tension Headache",
          summary:
            "Based on your symptoms, this appears to be a tension-type headache. While uncomfortable, this is generally not a medical emergency.",
          recommendations: [
            "Rest in a quiet, dark room",
            "Apply a cold or warm compress to your head or neck",
            "Take over-the-counter pain relievers like ibuprofen or acetaminophen",
            "Stay hydrated and avoid caffeine",
            "Consider stress management techniques",
          ],
          citations: [
            {
              source: "CDC",
              document: "Headache Information Page",
              excerpt:
                "Tension headaches are the most common type of headache. They can be triggered by stress, poor posture, or muscle tension.",
              url: "https://www.cdc.gov/headache",
            },
            {
              source: "WHO",
              document: "Headache Disorders Fact Sheet",
              excerpt:
                "Tension-type headache is characterized by bilateral, pressing or tightening pain of mild to moderate intensity.",
              url: "https://www.who.int/news-room/fact-sheets/detail/headache-disorders",
            },
          ],
          nextSteps: [
            "Monitor symptoms for the next 24-48 hours",
            "If headaches persist for more than a week, consult your doctor",
            "Keep a headache diary to identify triggers",
          ],
          warningSignsToWatch: [
            "Sudden, severe headache (thunderclap headache)",
            "Headache with fever, stiff neck, confusion, or vision changes",
            "Headache after a head injury",
            "Progressive headache that worsens over days",
            "New headache pattern if you're over 50",
          ],
        }),
        route: "symptom_assessment",
      });
    } else if (prompt.includes("drug interactions")) {
      // Mock drug interaction response
      return NextResponse.json({
        response: JSON.stringify({
          interactions: [
            {
              drug1: "Lisinopril",
              drug2: "Ibuprofen",
              severity: "moderate",
              description:
                "NSAIDs like ibuprofen may reduce the blood pressure-lowering effects of ACE inhibitors like lisinopril. Additionally, this combination may increase the risk of kidney problems.",
              source: "FDA Drug Label Database",
            },
          ],
          summary:
            "1 moderate interaction found. Consult your doctor or pharmacist before taking these medications together.",
        }),
        route: "medication_check",
      });
    } else {
      // Mock medical Q&A response
      return NextResponse.json({
        response:
          "Based on current medical guidelines, I recommend consulting with your healthcare provider for personalized advice. This information is for educational purposes only and should not replace professional medical consultation.\n\n**Citations:**\n- CDC Clinical Guidelines\n- WHO Health Recommendations\n\n**Disclaimer:** This is not medical advice. Always consult a qualified healthcare professional for medical concerns.",
        route: "health_question",
      });
    }
  } catch (error) {
    console.error("Mock agent error:", error);
    return NextResponse.json(
      { error: "Mock agent processing failed" },
      { status: 500 }
    );
  }
}
