export function parseUrlsFromText(text = "") {
  const tokens = text
    .split(/[\s,;]+/)
    .map((t) => t.trim())
    .filter(Boolean);
  const seen = new Set();
  const results = [];

  for (let token of tokens) {
    const maybe = /^https?:\/\//i.test(token) ? token : `https://${token}`;
    try {
      const u = new URL(maybe);
      const normalized = u.href.replace(/\/$/, "");
      if (!seen.has(normalized)) {
        seen.add(normalized);
        results.push({ url: normalized, domain: u.hostname });
      }
    } catch {}
  }
  return results;
}
