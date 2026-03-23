function asString(value) {
  if (typeof value !== "string") {
    return void 0;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : void 0;
}
export function normalizePopulateFields(fields) {
  if (!fields) {
    return [];
  }
  const input = Array.isArray(fields) ? fields : [fields];
  return [...new Set(input.map((value) => asString(value)).filter((value) => Boolean(value)))];
}
export function isPopulateSupportedOperation(op) {
  return op === "first" || op === "find" || op === "page";
}
