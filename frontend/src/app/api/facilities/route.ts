import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const zipCode = request.nextUrl.searchParams.get("zip");

  if (!zipCode || !/^\d{5}$/.test(zipCode)) {
    return NextResponse.json(
      { error: "A valid 5-digit US ZIP code is required." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://data.cms.gov/provider-data/api/1/datastore/query/xubh-q36u/0?` +
        new URLSearchParams({
          "conditions[0][property]": "zip_code",
          "conditions[0][value]": zipCode,
          "conditions[0][operator]": "=",
          limit: "10",
          "sort[0][property]": "hospital_name",
          "sort[0][order]": "asc",
        }),
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error(`CMS API returned ${response.status}`);
    }

    const data = await response.json();
    const results = (data.results || []).map(
      (r: Record<string, string>) => ({
        name: r.hospital_name || "Unknown",
        address: `${r.address || ""}, ${r.city || ""}, ${r.state || ""} ${r.zip_code || ""}`,
        phone: r.phone_number || "N/A",
        type: r.hospital_type || "General",
        emergencyServices: r.emergency_services === "Yes",
        rating: r.hospital_overall_rating || null,
      })
    );

    return NextResponse.json({ facilities: results });
  } catch (error) {
    console.error("Facility lookup error:", error);
    return NextResponse.json(
      { error: "Unable to look up facilities. Please try again." },
      { status: 500 }
    );
  }
}
