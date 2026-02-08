// corepAi.ts
// OpenRouter + Claude Opus 4.6 COREP Assistant

/* =======================
   Environment Variables
   =======================

VITE_OPENROUTER_API_KEY=your_openrouter_api_key
VITE_OPENROUTER_SITE_URL=http://localhost:5173   (optional)
VITE_OPENROUTER_SITE_NAME=COREP Assistant        (optional)

*/

const OPENROUTER_API_KEY = import.meta.env.VITE_OPEN_ROUTER_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

if (!OPENROUTER_API_KEY) {
  console.warn("Missing VITE_OPENROUTER_API_KEY");
}

/* =======================
   OpenRouter Call Helper
   ======================= */

async function callOpenRouter(prompt: string): Promise<string> {
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": import.meta.env.VITE_OPENROUTER_SITE_URL || "",
      "X-Title": import.meta.env.VITE_OPENROUTER_SITE_NAME || "",
    },
    body: JSON.stringify({
      model: "arcee-ai/trinity-large-preview:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenRouter API error: ${errorText}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "";
}

/* =======================
   Chat With User
   ======================= */

export async function chatWithUser(message: string): Promise<string> {
  const prompt = `You are a COREP Regulatory Reporting Assistant for UK PRA reporting.

Context:
- Jurisdiction: United Kingdom
- Regulation: PRA Rulebook (CRR Firms)
- Reporting framework: COREP
- Role: Assist a human analyst (do not automate)

User message:
"${message}"

Instructions:
1. Identify relevant COREP reporting considerations.
2. Reference PRA Rulebook or COREP Instructions where applicable.
3. Respond concisely.
4. Do NOT claim regulatory compliance.
5. Treat output as draft guidance only.`;

  return await callOpenRouter(prompt);
}

/* =======================
   Types
   ======================= */

export type Suggestion = {
  rowCode: string;
  suggestedAmount?: string;
  suggestedStatus?: "draft" | "accepted" | "missing";
  reasoning: string;
  evidence: string;
};

/* =======================
   Generate Suggestions
   ======================= */

export async function generateSuggestions(
  latestMessage: string,
  rows: Array<{
    rowCode: string;
    item: string;
    amount?: string;
    status?: string;
  }>
): Promise<Suggestion[]> {
  // RAG sources (served from /public)
  const instrPath = "/Data/INSTRUCTIONS/OWN_FUND_INSTRUCTION.txt";
  const rulesPath = "/Data/RULES/OWN_FUNDS.txt";

  let instructions = "";
  let rules = "";

  try {
    const [iRes, rRes] = await Promise.all([
      fetch(instrPath),
      fetch(rulesPath),
    ]);

    if (iRes.ok) instructions = await iRes.text();
    if (rRes.ok) rules = await rRes.text();
  } catch (err) {
    console.warn("RAG files not available, continuing without them", err);
  }

  const rowsContext = rows
    .slice(0, 50) // keep prompt size bounded
    .map(
      r => `${r.rowCode} — ${r.item} — amount:${r.amount || ""} status:${r.status || "draft"}`
    )
    .join("\n");

  const prompt = `You are a COREP assistant. Follow these layers strictly:


LAYER 1) Instruction extracts (if available):
${instructions.substring(0, 8000)}

LAYER 2) Rules text:
${rules.substring(0, 8000)}

LAYER 3) Based on the table rows, propose suggested updates.

For each suggestion return a JSON object with:
- rowCode
- suggestedAmount (string, may be empty)
- suggestedStatus (draft | accepted | missing)
- reasoning (short)
- evidence (verbatim extract from rules/instructions)

User request:
"${latestMessage}"

Table rows:
${rowsContext}

Return ONLY a valid JSON array.
Example:
[
  {
    "rowCode": "010",
    "suggestedAmount": "100",
    "suggestedStatus": "accepted",
    "reasoning": "...",
    "evidence": "..."
  }
]`;

  const text = await callOpenRouter(prompt);

  // Robust JSON array extraction: find matching closing bracket for first '['
  const extractJsonArray = (s: string) => {
    const start = s.indexOf("[");
    if (start === -1) return null;
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let i = start; i < s.length; i++) {
      const ch = s[i];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === '"') {
        inString = !inString;
        continue;
      }
      if (inString) continue;
      if (ch === "[") depth++;
      else if (ch === "]") {
        depth--;
        if (depth === 0) {
          return s.slice(start, i + 1);
        }
      }
    }
    return null;
  };

  try {
    const jsonText = extractJsonArray(text);
    if (!jsonText) throw new Error("No complete JSON array found in model output");
    const parsed = JSON.parse(jsonText);
    return parsed as Suggestion[];
  } catch (err) {
    console.warn("Failed to parse model JSON output", err);
    console.warn("Model output was:\n", text.slice(0, 20000));
    return [];
  }
}
