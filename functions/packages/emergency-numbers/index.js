/**
 * DigitalOcean Function: get_emergency_numbers
 *
 * Returns emergency contact numbers for a given country.
 *
 * Parameters:
 *   - country_code (string): ISO country code (default: "US")
 *
 * Returns:
 *   - body: { numbers: object, country: string }
 */

const EMERGENCY_NUMBERS = {
  US: {
    emergency: "911",
    poison_control: "1-800-222-1222",
    suicide_crisis: "988 (Suicide & Crisis Lifeline)",
    domestic_violence: "1-800-799-7233 (National Domestic Violence Hotline)",
    substance_abuse: "1-800-662-4357 (SAMHSA Helpline)",
    veterans_crisis: "988 then press 1",
    child_abuse: "1-800-422-4453 (Childhelp National Hotline)",
  },
  UK: {
    emergency: "999",
    non_emergency_medical: "111 (NHS)",
    suicide_crisis: "116 123 (Samaritans)",
    domestic_violence: "0808 2000 247",
  },
  CA: {
    emergency: "911",
    poison_control: "1-800-268-9017",
    suicide_crisis: "988",
    kids_help: "1-800-668-6868",
  },
  AU: {
    emergency: "000",
    poison_control: "13 11 26",
    suicide_crisis: "13 11 14 (Lifeline)",
    mental_health: "1300 22 4636 (Beyond Blue)",
  },
};

async function main(args) {
  const countryCode = (args.country_code || "US").toUpperCase();

  const numbers = EMERGENCY_NUMBERS[countryCode] || {
    emergency: "Call local emergency services",
    note: `Specific numbers not available for country code: ${countryCode}`,
  };

  return {
    body: {
      numbers,
      country: countryCode,
      disclaimer:
        "If you are experiencing a life-threatening emergency, call your local emergency number immediately.",
    },
  };
}

module.exports = { main };
