/**
 * DigitalOcean Function: get_nearby_facilities
 *
 * Looks up nearby hospitals and urgent care centers by ZIP code
 * using the CMS (Centers for Medicare & Medicaid Services) public API.
 *
 * Parameters:
 *   - zip_code (string): US ZIP code
 *   - limit (number): Max results (default 5)
 *
 * Returns:
 *   - body: { facilities: Array }
 */

const axios = require("axios");

const CMS_API = "https://data.cms.gov/provider-data/api/1/datastore/query/xubh-q36u/0";

async function main(args) {
  const { zip_code, limit = 5 } = args;

  if (!zip_code) {
    return {
      body: {
        error: "zip_code parameter is required",
        facilities: [],
      },
    };
  }

  try {
    const response = await axios.get(CMS_API, {
      params: {
        "conditions[0][property]": "zip_code",
        "conditions[0][value]": zip_code,
        "conditions[0][operator]": "=",
        limit: Math.min(limit, 10),
        "sort[0][property]": "hospital_name",
        "sort[0][order]": "asc",
      },
      timeout: 10000,
    });

    const facilities = (response.data.results || []).map((r) => ({
      name: r.hospital_name || "Unknown",
      address: `${r.address || ""}, ${r.city || ""}, ${r.state || ""} ${r.zip_code || ""}`.trim(),
      phone: r.phone_number || "N/A",
      type: r.hospital_type || "General",
      emergency_services: r.emergency_services === "Yes",
      rating: r.hospital_overall_rating || "N/A",
    }));

    return {
      body: {
        facilities,
        count: facilities.length,
        zip_code,
      },
    };
  } catch (error) {
    return {
      body: {
        error: `Facility lookup failed: ${error.message}`,
        facilities: [],
      },
    };
  }
}

module.exports = { main };
