/**
 * DigitalOcean Function: check_drug_interaction
 *
 * Queries the OpenFDA API to check for drug-drug interactions.
 * This function is called by the Drug Interaction Agent via function routing.
 *
 * Parameters:
 *   - drug1 (string): First medication name
 *   - drug2 (string): Second medication name
 *
 * Returns:
 *   - body: { found: boolean, interaction: object | null }
 */

const axios = require("axios");

const OPENFDA_BASE = "https://api.fda.gov/drug/label.json";

async function main(args) {
  const { drug1, drug2 } = args;

  if (!drug1 || !drug2) {
    return {
      body: {
        error: "Both drug1 and drug2 parameters are required",
        found: false,
        interaction: null,
      },
    };
  }

  try {
    // Search for drug1 label mentioning drug2 in interactions
    const response = await axios.get(OPENFDA_BASE, {
      params: {
        search: `(openfda.generic_name:"${drug1}") AND (drug_interactions:"${drug2}")`,
        limit: 1,
      },
      timeout: 10000,
    });

    if (response.data.results && response.data.results.length > 0) {
      const result = response.data.results[0];
      const interactionText = result.drug_interactions
        ? result.drug_interactions[0]
        : "Interaction details not available";

      const severity = classifySeverity(interactionText);

      return {
        body: {
          found: true,
          interaction: {
            drug1,
            drug2,
            severity,
            description: interactionText.substring(0, 500),
            source: "FDA Drug Label Database (OpenFDA)",
            brand_name: result.openfda?.brand_name?.[0] || drug1,
          },
        },
      };
    }

    // Try reverse search
    const reverseResponse = await axios.get(OPENFDA_BASE, {
      params: {
        search: `(openfda.generic_name:"${drug2}") AND (drug_interactions:"${drug1}")`,
        limit: 1,
      },
      timeout: 10000,
    });

    if (
      reverseResponse.data.results &&
      reverseResponse.data.results.length > 0
    ) {
      const result = reverseResponse.data.results[0];
      const interactionText = result.drug_interactions
        ? result.drug_interactions[0]
        : "Interaction details not available";

      const severity = classifySeverity(interactionText);

      return {
        body: {
          found: true,
          interaction: {
            drug1,
            drug2,
            severity,
            description: interactionText.substring(0, 500),
            source: "FDA Drug Label Database (OpenFDA)",
            brand_name: result.openfda?.brand_name?.[0] || drug2,
          },
        },
      };
    }

    return {
      body: {
        found: false,
        interaction: null,
        message: `No known interactions found between ${drug1} and ${drug2} in the FDA database.`,
      },
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return {
        body: {
          found: false,
          interaction: null,
          message: `No data found for the specified medications.`,
        },
      };
    }

    return {
      body: {
        error: `API error: ${error.message}`,
        found: false,
        interaction: null,
      },
    };
  }
}

function classifySeverity(text) {
  const lower = text.toLowerCase();
  const highKeywords = [
    "contraindicated",
    "fatal",
    "death",
    "life-threatening",
    "do not use",
    "serious",
    "severe",
    "serotonin syndrome",
    "cardiac arrest",
  ];
  const moderateKeywords = [
    "caution",
    "monitor",
    "may increase",
    "may decrease",
    "adjust dose",
    "concurrent use",
  ];

  if (highKeywords.some((kw) => lower.includes(kw))) return "high";
  if (moderateKeywords.some((kw) => lower.includes(kw))) return "moderate";
  return "low";
}

module.exports = { main };
