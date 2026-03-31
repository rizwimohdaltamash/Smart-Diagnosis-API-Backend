const OpenAI = require("openai");

const buildPrompt = (symptoms) => {
  return [
    "You are a medical triage assistant for informational purposes only.",
    "You must return valid JSON only.",
    "Do not add markdown, code fences, or extra keys.",
    "Return this exact shape:",
    '{"diagnosis":[{"condition":"string","probability":"string-with-%","next_steps":"string"}]}',
    "Return exactly 2 or 3 likely conditions based on symptoms.",
    "Probability values must sum approximately to 100%.",
    "Keep next_steps concise and practical.",
    `Symptoms: ${symptoms}`,
  ].join("\n");
};

const parseModelOutput = (outputText) => {
  const rawText = outputText?.trim() || "";
  if (!rawText) {
    throw new Error("AI response text is empty");
  }

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (_error) {
    const start = rawText.indexOf("{");
    const end = rawText.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      throw new Error("Could not find JSON object in AI response");
    }

    parsed = JSON.parse(rawText.slice(start, end + 1));
  }

  if (!Array.isArray(parsed.diagnosis) || parsed.diagnosis.length < 2 || parsed.diagnosis.length > 3) {
    throw new Error("AI response does not contain a valid diagnosis array");
  }

  const diagnosis = parsed.diagnosis.map((item) => {
    const condition = String(item.condition || "").trim();
    const nextSteps = String(item.next_steps || "").trim();
    let probability = String(item.probability || "").trim();

    if (!condition || !nextSteps || !probability) {
      throw new Error("AI response has incomplete diagnosis fields");
    }

    if (!probability.includes("%")) {
      probability = `${probability}%`;
    }

    return {
      condition,
      probability,
      next_steps: nextSteps,
    };
  });

  return { diagnosis };
};

const getAIDiagnosis = async (symptoms) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in environment variables");
  }

  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const response = await client.responses.create({
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
    input: buildPrompt(symptoms),
  });

  return parseModelOutput(response.output_text);
};

module.exports = {
  getAIDiagnosis,
};
