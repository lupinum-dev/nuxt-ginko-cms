function asNonEmptyString(value) {
  return typeof value === 'string' ? value : ''
}
function extractAltTextFromInlineComponent(token) {
  const match = token.match(/\balt=(?:"([^"]*)"|'([^']*)')/i)
  const alt = (match?.[1] || match?.[2] || '').trim()
  return alt || void 0
}
export function sanitizeSearchSnippet(input) {
  let snippet = asNonEmptyString(input)
  if (!snippet) {
    return ''
  }
  // Protect inline code (backtick-wrapped) from sanitization
  const codeSlots: string[] = []
  snippet = snippet.replace(/`([^`]+)`/g, (_, code) => {
    codeSlots.push(code)
    return `\x00CODE${codeSlots.length - 1}\x00`
  })
  snippet = snippet.replace(/:{1,3}[a-z][\w-]*\{[^}]*$/gi, ' ')
  snippet = snippet.replace(/!\[([^\]]*)\]\([^)]+\)/g, ' $1 ')
  snippet = snippet.replace(/\[([^\]]+)\]\([^)]+\)/g, ' $1 ')
  snippet = snippet.replace(/:[a-z][\w-]*\{[^{}]*\}/gi, (token) => {
    const alt = extractAltTextFromInlineComponent(token)
    return alt ? ` ${alt} ` : ' '
  })
  snippet = snippet.replace(/:::[a-z][\w-]*(?:\{[^{}]*\})?/gi, ' ').replace(/::[a-z][\w-]*(?:\{[^{}]*\})?/gi, ' ').replace(/:::/g, ' ').replace(/::/g, ' ')
  snippet = snippet.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ')
  snippet = snippet.replace(/^\s{0,3}#{1,6}\s+/gm, ' ').replace(/^\s{0,3}>\s?/gm, ' ').replace(/^\s*([-*_])(?:\s*\1){2,}\s*$/gm, ' ').replace(/[*`]/g, '').replace(/\b_+|_+\b/g, ' ')
  // Restore inline code content
  snippet = snippet.replace(/\0CODE(\d+)\0/g, (_, i) => codeSlots[Number(i)])
  return snippet.replace(/\s+/g, ' ').trim()
}
