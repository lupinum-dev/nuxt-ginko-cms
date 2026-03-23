const HTML_TAGS = /* @__PURE__ */ new Set([
  "a",
  "abbr",
  "article",
  "aside",
  "b",
  "blockquote",
  "br",
  "caption",
  "code",
  "dd",
  "del",
  "details",
  "div",
  "dl",
  "dt",
  "em",
  "figcaption",
  "figure",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "kbd",
  "li",
  "main",
  "mark",
  "ol",
  "p",
  "pre",
  "q",
  "s",
  "section",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "u",
  "ul"
]);
function hasOwn(record, key) {
  return Object.prototype.hasOwnProperty.call(record, key);
}
function toPascalCase(tag) {
  return tag.split(/[^a-z0-9]+/gi).filter(Boolean).map((part) => part.slice(0, 1).toUpperCase() + part.slice(1)).join("");
}
function isHtmlTag(tag) {
  if (tag.includes("-")) {
    return false;
  }
  return HTML_TAGS.has(tag.toLowerCase());
}
function collectCustomTags(node, output) {
  if (Array.isArray(node)) {
    for (const entry of node) {
      collectCustomTags(entry, output);
    }
    return;
  }
  if (!node || typeof node !== "object") {
    return;
  }
  const candidate = node;
  const tag = typeof candidate.tag === "string" ? candidate.tag.trim() : "";
  if (tag && !isHtmlTag(tag)) {
    output.add(tag);
  }
  collectCustomTags(candidate.children, output);
}
function toMap(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {};
  }
  return input;
}
export function inferMdcComponentMap(args) {
  const runtimeMap = toMap(args.runtimeMap);
  const tags = /* @__PURE__ */ new Set();
  collectCustomTags(args.body, tags);
  const inferred = {};
  for (const tag of tags) {
    const pascalTag = toPascalCase(tag);
    if (!pascalTag) {
      continue;
    }
    if (hasOwn(runtimeMap, tag) || hasOwn(runtimeMap, pascalTag)) {
      continue;
    }
    inferred[tag] = `Mdc${pascalTag}`;
  }
  return inferred;
}
export function mergeMdcComponentMap(args) {
  const runtimeMap = toMap(args.runtimeMap);
  return {
    ...inferMdcComponentMap({
      body: args.body,
      runtimeMap
    }),
    ...runtimeMap,
    ...toMap(args.componentOverrides)
  };
}
