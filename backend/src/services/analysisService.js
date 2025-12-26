// Lightweight heuristic analysis. Replace with a real NLP/LLM pipeline for production.
export function analyzeFeedbackText(text) {
  const lower = text.toLowerCase();
  const positiveWords = ["love", "great", "good", "awesome", "amazing", "fast", "helpful"];
  const negativeWords = ["bad", "terrible", "slow", "hate", "broken", "bug", "crash"];
  const toxicWords = ["stupid", "idiot", "dumb", "hate", "worst"];

  const hasPositive = positiveWords.some((w) => lower.includes(w));
  const hasNegative = negativeWords.some((w) => lower.includes(w));

  let sentiment = "neutral";
  if (hasPositive && !hasNegative) sentiment = "positive";
  if (hasNegative && !hasPositive) sentiment = "negative";
  if (hasPositive && hasNegative) sentiment = "neutral";

  const tokens = lower.split(/\W+/).filter((w) => w.length > 3);
  const keywords = [...new Set(tokens)].slice(0, 8);

  const toxicityHits = toxicWords.filter((w) => lower.includes(w)).length;
  const toxicity = Math.min(1, toxicityHits * 0.3);

  const language = detectLanguage(lower);
  const summary = summarize(lower);

  return { sentiment, keywords, toxicity, language, summary };
}

function detectLanguage(text) {
  // Super-naive language guesser by character range and stopwords.
  const hasAccent = /[áéíóúñü]/i.test(text);
  const spanishHints = [" el ", " la ", " los ", " las ", " de ", " que ", " y "];
  if (hasAccent || spanishHints.some((w) => text.includes(w))) return "es";
  return "en";
}

function summarize(text) {
  const sentences = text.split(/[.!?]/).map((s) => s.trim()).filter(Boolean);
  if (!sentences.length) return "";
  const first = sentences[0];
  return first.length > 180 ? `${first.slice(0, 177)}...` : first;
}

