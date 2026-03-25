const NAMED_HTML_ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': '\'',
}
function decodeEntities(input) {
  let output = input
  for (const [encoded, decoded] of Object.entries(NAMED_HTML_ENTITIES)) {
    output = output.replaceAll(encoded, decoded)
  }
  output = output.replace(/&#x([0-9a-fA-F]+);/g, (full, value) => {
    const codePoint = Number.parseInt(value, 16)
    return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : full
  })
  output = output.replace(/&#(\d+);/g, (full, value) => {
    const codePoint = Number.parseInt(value, 10)
    return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : full
  })
  return output
}
function normalizeLegacyComponentNames(input) {
  return input.replace(/::ginkolayout\b/gi, '::ginko-layout').replace(/::ginkocolumn\b/gi, '::ginko-column').replace(/:ginkolayout(?=\{)/gi, ':ginko-layout').replace(/:ginkocolumn(?=\{)/gi, ':ginko-column').replace(/:ginko-image(?=\{)/gi, ':image').replace(/::ginko-note\b/gi, '::note').replace(/:ginko-note(?=\{)/gi, ':note')
}
function normalizeLineBreakTokens(input) {
  return input.replace(/\\+\s*:br\s*/gi, '<br />\n').replace(/\s*:br\s*/gi, '<br />\n')
}
function normalizeBoldLabelSpacing(input) {
  return input.replace(/(\*\*[^*]+:\*\*)([a-zäöü])/giu, '$1 $2')
}
function normalizeDoubleAngleAutolinks(input) {
  return input.replace(/<<([^>\n]+)>>/g, '<$1>')
}
function normalizeEscapedHardBreaks(input) {
  return input.replace(/[ \t]*\\[ \t]*\r?\n[ \t]*\r?\n/g, ' <br />\n').replace(/[ \t]*\\[ \t]*(?=\r?\n)/g, ' <br />')
}
export function cmsMdcNormalize(input) {
  if (typeof input !== 'string' || !input.trim()) {
    return ''
  }
  const decoded = decodeEntities(input)
  const withLegacyComponents = normalizeLegacyComponentNames(decoded)
  const withLineBreaks = normalizeLineBreakTokens(withLegacyComponents)
  const withAutolinks = normalizeDoubleAngleAutolinks(withLineBreaks)
  const withHardBreaks = normalizeEscapedHardBreaks(withAutolinks)
  return normalizeBoldLabelSpacing(withHardBreaks)
}
