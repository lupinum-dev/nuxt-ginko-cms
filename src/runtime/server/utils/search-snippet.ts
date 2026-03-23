function asNonEmptyString(value) {
  return typeof value === "string" ? value : "";
}
function extractAltTextFromInlineComponent(token) {
  const match = token.match(/\balt=(?:"([^"]*)"|'([^']*)')/i);
  const alt = (match?.[1] || match?.[2] || "").trim();
  return alt || void 0;
}
export function sanitizeSearchSnippet(input) {
  let snippet = asNonEmptyString(input);
  if (!snippet) {
    return "";
  }
  snippet = snippet.replace(/:{1,3}[a-z][\w-]*\{[^}]*$/gi, " ");
  snippet = snippet.replace(/!\[([^\]]*)\]\([^)]+\)/g, " $1 ");
  snippet = snippet.replace(/\[([^\]]+)\]\([^)]+\)/g, " $1 ");
  snippet = snippet.replace(/:[a-z][\w-]*\{[^{}]*\}/gi, (token) => {
    const alt = extractAltTextFromInlineComponent(token);
    return alt ? ` ${alt} ` : " ";
  });
  snippet = snippet.replace(/:::[a-z][\w-]*(?:\{[^{}]*\})?/gi, " ").replace(/::[a-z][\w-]*(?:\{[^{}]*\})?/gi, " ").replace(/:::/g, " ").replace(/::/g, " ");
  snippet = snippet.replace(/<!--[\s\S]*?-->/g, " ").replace(/<[^>]+>/g, " ");
  snippet = snippet.replace(/^\s{0,3}#{1,6}\s+/gm, " ").replace(/^\s{0,3}>\s?/gm, " ").replace(/^\s*([-*_])(?:\s*\1){2,}\s*$/gm, " ").replace(/[*_`]/g, "");
  return snippet.replace(/\s+/g, " ").trim();
}
