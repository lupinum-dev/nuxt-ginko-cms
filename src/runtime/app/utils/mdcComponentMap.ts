const HTML_TAGS = /* @__PURE__ */ new Set([
  'a',
  'abbr',
  'article',
  'aside',
  'b',
  'blockquote',
  'br',
  'caption',
  'code',
  'dd',
  'del',
  'details',
  'div',
  'dl',
  'dt',
  'em',
  'figcaption',
  'figure',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'img',
  'kbd',
  'li',
  'main',
  'mark',
  'ol',
  'p',
  'pre',
  'q',
  's',
  'section',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
  'u',
  'ul',
])
function hasOwn(record: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key)
}
function toPascalCase(tag: string): string {
  return tag.split(/[^a-z0-9]+/gi).filter(Boolean).map(part => part.slice(0, 1).toUpperCase() + part.slice(1)).join('')
}
function isHtmlTag(tag: string): boolean {
  if (tag.includes('-')) {
    return false
  }
  return HTML_TAGS.has(tag.toLowerCase())
}

interface MdcNode {
  tag?: string
  children?: MdcNode | MdcNode[]
}

function collectCustomTags(node: unknown, output: Set<string>): void {
  if (Array.isArray(node)) {
    for (const entry of node) {
      collectCustomTags(entry, output)
    }
    return
  }
  if (!node || typeof node !== 'object') {
    return
  }
  const candidate = node as MdcNode
  const tag = typeof candidate.tag === 'string' ? candidate.tag.trim() : ''
  if (tag && !isHtmlTag(tag)) {
    output.add(tag)
  }
  collectCustomTags(candidate.children, output)
}
function toMap(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {}
  }
  return input as Record<string, unknown>
}
export function inferMdcComponentMap(args: { body: unknown, runtimeMap?: unknown }): Record<string, string> {
  const runtimeMap = toMap(args.runtimeMap)
  const tags = /* @__PURE__ */ new Set<string>()
  collectCustomTags(args.body, tags)
  const inferred: Record<string, string> = {}
  for (const tag of tags) {
    const pascalTag = toPascalCase(tag)
    if (!pascalTag) {
      continue
    }
    if (hasOwn(runtimeMap, tag) || hasOwn(runtimeMap, pascalTag)) {
      continue
    }
    inferred[tag] = `Mdc${pascalTag}`
  }
  return inferred
}
export function mergeMdcComponentMap(args: { body: unknown, runtimeMap?: unknown, componentOverrides?: unknown }): Record<string, unknown> {
  const runtimeMap = toMap(args.runtimeMap)
  return {
    ...inferMdcComponentMap({
      body: args.body,
      runtimeMap,
    }),
    ...runtimeMap,
    ...toMap(args.componentOverrides),
  }
}
