import { asBoolean as _asBoolean, asChildren, asNumber, asRecord, asString } from './type-guards'

interface HierarchyEntry {
  id: string
  itemId: string | undefined
  contentId: string | undefined
  slug: string | undefined
  title: string
  nodeKind: string
  status: string
  order: number
  updatedAt: number | undefined
  icon: string | undefined
  badge: string | undefined
  path: string | undefined
  depth: number
  segments: string[]
  folderSegments: string[]
  folderTitles: string[]
  folderItemIds: string[]
  content: Record<string, unknown>
  children: HierarchyEntry[]
}

interface GinkoHierarchyState {
  locale: string
  defaultLocale: string
  baseSegment: string
  tree: HierarchyEntry[]
  flat: HierarchyEntry[]
  pages: HierarchyEntry[]
  folders: HierarchyEntry[]
  nodeByPath: Record<string, HierarchyEntry>
  nodeByItemId: Record<string, HierarchyEntry>
  nodeByContentId: Record<string, HierarchyEntry>
  pathBySlug: Record<string, string>
  pathByContentId: Record<string, string>
  pathByItemId: Record<string, string>
  root: { slug: string, sourcePath: string, path: string, itemId: string | undefined, contentId: string | undefined } | undefined
}

interface WalkContext {
  folderSegments: string[]
  folderTitles: string[]
  folderItemIds: string[]
  depth: number
}

function toIsoOrder(raw: Record<string, unknown>, content: Record<string, unknown>, contentOrderField: string): number {
  return asNumber(content[contentOrderField]) ?? asNumber(raw.order) ?? Number.MAX_SAFE_INTEGER
}
function getNodeKind(raw: Record<string, unknown>): string {
  const explicit = asString(raw.kind)
  if (explicit === 'page' || explicit === 'folder' || explicit === 'group' || explicit === 'section') {
    return explicit
  }
  return 'page'
}
function getAdornment(raw: Record<string, unknown>, content: Record<string, unknown>, key: string): string | undefined {
  return asString(content[key]) || asString(raw[key])
}
function sortRawNodes(nodes: Record<string, unknown>[], contentOrderField: string, contentTitleField: string): Record<string, unknown>[] {
  return [...nodes].sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
    const contentA = asRecord(a.content)
    const contentB = asRecord(b.content)
    const orderA = toIsoOrder(a, contentA, contentOrderField)
    const orderB = toIsoOrder(b, contentB, contentOrderField)
    if (orderA !== orderB) {
      return orderA - orderB
    }
    const titleA = asString(contentA[contentTitleField]) || asString(a.title) || ''
    const titleB = asString(contentB[contentTitleField]) || asString(b.title) || ''
    return titleA.localeCompare(titleB)
  })
}
function normalizePath(path: string): string {
  const withoutHash = path.split('#')[0] || ''
  const withoutQuery = withoutHash.split('?')[0] || ''
  const collapsed = withoutQuery.replace(/\/{2,}/g, '/')
  if (!collapsed || collapsed === '/') {
    return '/'
  }
  return collapsed.endsWith('/') ? collapsed.slice(0, -1) : collapsed
}
function normalizeSlugSegment(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return void 0
  }
  const trimmed = value.trim()
  if (!trimmed) {
    return void 0
  }
  const cleaned = trimmed.replace(/^\/+|\/+$/g, '').replace(/\s+/g, '-').toLowerCase()
  return cleaned || void 0
}
function localizePath(path: string, locale: string, defaultLocale: string): string {
  const normalized = normalizePath(path)
  if (locale === defaultLocale) {
    return normalized
  }
  const localePrefix = `/${locale}`
  if (normalized === localePrefix || normalized.startsWith(`${localePrefix}/`)) {
    return normalized
  }
  return normalizePath(`${localePrefix}${normalized}`)
}
function extractContentIdFromSlug(slug: string): string | undefined {
  const match = slug.match(/-([a-f0-9]{8,})$/i)
  return match ? match[1] : void 0
}
function normalizeBaseSegment(segment: unknown): string {
  const normalized = normalizeSlugSegment(segment)
  if (!normalized) {
    throw new Error('[ginko-cms] Invalid hierarchy base segment')
  }
  return normalized
}
function buildPath(args: { baseSegment: string, locale: string, defaultLocale: string, segments: string[] }): string | undefined {
  if (!args.segments.length) {
    return void 0
  }
  return localizePath(`/${args.baseSegment}/${args.segments.join('/')}`, args.locale, args.defaultLocale)
}
function resolveRootEntry(state: GinkoHierarchyState, entry: HierarchyEntry): GinkoHierarchyState['root'] {
  const root = state.root
  if (!root || !entry.path) {
    return void 0
  }
  if (root.itemId && entry.itemId === root.itemId) {
    return root
  }
  if (root.contentId && entry.contentId === root.contentId) {
    return root
  }
  if (root.slug && entry.slug === root.slug) {
    return root
  }
  return void 0
}
function buildGinkoHierarchyState(rawNodes: Record<string, unknown>[], options: Record<string, unknown>): GinkoHierarchyState {
  const locale = asString(options.locale) || 'en'
  const defaultLocale = asString(options.defaultLocale) || 'en'
  const baseSegment = normalizeBaseSegment(options.baseSegment)
  const contentSlugField = asString(options.contentSlugField) || 'slug'
  const contentTitleField = asString(options.contentTitleField) || 'title'
  const contentOrderField = asString(options.contentOrderField) || 'pageOrder'
  const contentIdField = asString(options.contentIdField) || 'colocationFolderId'
  const includeFolders = options.includeFolders !== false
  const rootSlug = normalizeSlugSegment(options.rootSlug)
  const state: GinkoHierarchyState = {
    locale,
    defaultLocale,
    baseSegment,
    tree: [],
    flat: [],
    pages: [],
    folders: [],
    nodeByPath: {},
    nodeByItemId: {},
    nodeByContentId: {},
    pathBySlug: {},
    pathByContentId: {},
    pathByItemId: {},
    root: void 0,
  }
  const register = (entry: HierarchyEntry): void => {
    state.flat.push(entry)
    if (entry.nodeKind === 'folder') {
      state.folders.push(entry)
    }
    else if (entry.nodeKind === 'page') {
      state.pages.push(entry)
    }
    if (entry.path) {
      state.nodeByPath[entry.path] = entry
      if (entry.slug && !state.pathBySlug[entry.slug]) {
        state.pathBySlug[entry.slug] = entry.path
      }
      if (entry.contentId && !state.pathByContentId[entry.contentId]) {
        state.pathByContentId[entry.contentId] = entry.path
      }
      if (entry.itemId && !state.pathByItemId[entry.itemId]) {
        state.pathByItemId[entry.itemId] = entry.path
      }
    }
    if (entry.itemId && !state.nodeByItemId[entry.itemId]) {
      state.nodeByItemId[entry.itemId] = entry
    }
    if (entry.contentId && !state.nodeByContentId[entry.contentId]) {
      state.nodeByContentId[entry.contentId] = entry
    }
  }
  const maxRecursionDepth = 20
  const walk = (nodes: Record<string, unknown>[], context: WalkContext): HierarchyEntry[] => {
    if (context.depth >= maxRecursionDepth) {
      return []
    }
    const output: HierarchyEntry[] = []
    const sorted = sortRawNodes(nodes, contentOrderField, contentTitleField)
    for (const raw of sorted) {
      const content = asRecord(raw.content)
      const nodeKind = getNodeKind(raw)
      const isFolder = nodeKind === 'folder'
      const isGroup = nodeKind === 'group'
      const isPage = nodeKind === 'page'
      const itemId = asString(raw.id)
      const rawSlug = isGroup ? void 0 : normalizeSlugSegment(content[contentSlugField]) || normalizeSlugSegment(raw.slug)
      const title = asString(content[contentTitleField]) || asString(raw.title) || rawSlug || 'Untitled'
      const order = toIsoOrder(raw, content, contentOrderField)
      const childNodes = asChildren(raw.children)
      const carriesChildPathSegments = isFolder || (isPage && childNodes.length > 0)
      const nextFolderSegments = carriesChildPathSegments && rawSlug ? [...context.folderSegments, rawSlug] : context.folderSegments
      const nextFolderTitles = carriesChildPathSegments ? [...context.folderTitles, title] : context.folderTitles
      const nextFolderItemIds = carriesChildPathSegments && itemId ? [...context.folderItemIds, itemId] : context.folderItemIds
      const segments = isFolder ? nextFolderSegments : !isGroup && rawSlug ? [...context.folderSegments, rawSlug] : []
      const path = buildPath({
        baseSegment,
        locale,
        defaultLocale,
        segments,
      })
      const contentIdFromField = asString(content[contentIdField])
      const contentId = contentIdFromField || (rawSlug ? extractContentIdFromSlug(rawSlug) : void 0)
      const shouldInclude = isGroup ? Boolean(title) : isFolder ? includeFolders && Boolean(path) : Boolean(path)
      if (!shouldInclude) {
        const children = walk(childNodes, {
          folderSegments: nextFolderSegments,
          folderTitles: nextFolderTitles,
          folderItemIds: nextFolderItemIds,
          depth: context.depth + 1,
        })
        output.push(...children)
        continue
      }
      const entryId = itemId || contentId || `${isFolder ? 'folder' : 'page'}:${segments.join('/') || title}`
      const entry: HierarchyEntry = {
        id: entryId,
        itemId,
        contentId,
        slug: rawSlug,
        title,
        nodeKind,
        status: asString(raw.status) || 'published',
        order,
        updatedAt: asNumber(raw.updatedAt),
        icon: getAdornment(raw, content, 'icon'),
        badge: getAdornment(raw, content, 'badge'),
        path,
        depth: context.depth,
        segments,
        folderSegments: context.folderSegments,
        folderTitles: context.folderTitles,
        folderItemIds: context.folderItemIds,
        content,
        children: [],
      }
      register(entry)
      const children = walk(childNodes, {
        folderSegments: nextFolderSegments,
        folderTitles: nextFolderTitles,
        folderItemIds: nextFolderItemIds,
        depth: context.depth + 1,
      })
      entry.children = children
      output.push(entry)
    }
    return output
  }
  state.tree = walk(rawNodes, {
    folderSegments: [],
    folderTitles: [],
    folderItemIds: [],
    depth: 0,
  })
  if (rootSlug) {
    const sourcePath = state.pathBySlug[rootSlug]
    const entry = sourcePath ? state.nodeByPath[sourcePath] : void 0
    if (entry?.path) {
      state.root = {
        slug: rootSlug,
        sourcePath: entry.path,
        path: localizePath(`/${baseSegment}`, locale, defaultLocale),
        itemId: entry.itemId,
        contentId: entry.contentId,
      }
    }
  }
  return state
}
function resolveGinkoHierarchyPath(state: GinkoHierarchyState, path: string): HierarchyEntry | undefined {
  const normalizedPath = normalizePath(path)
  const root = state.root
  if (root && (normalizedPath === root.path || normalizedPath === root.sourcePath)) {
    return state.nodeByPath[root.sourcePath]
  }
  return state.nodeByPath[normalizedPath]
}
function canonicalizeGinkoHierarchyPath(state: GinkoHierarchyState, path: string): string {
  const normalizedPath = normalizePath(path)
  const root = state.root
  if (root && (normalizedPath === root.path || normalizedPath === root.sourcePath)) {
    return root.path
  }
  return normalizedPath
}
function hierarchySubtreeContainsPath(nodes: HierarchyEntry[], path: string): boolean {
  for (const node of nodes) {
    if (node.path === path) {
      return true
    }
    if (hierarchySubtreeContainsPath(node.children || [], path)) {
      return true
    }
  }
  return false
}
function collectNavigableEntries(nodes: HierarchyEntry[], includeFolders: boolean, output: HierarchyEntry[]): HierarchyEntry[] {
  for (const node of nodes) {
    if (node.nodeKind === 'page' || (includeFolders && node.nodeKind === 'folder')) {
      output.push(node)
    }
    if (node.children?.length) {
      collectNavigableEntries(node.children, includeFolders, output)
    }
  }
  return output
}
function getGinkoHierarchySurroundEntries(state: GinkoHierarchyState, path: string, options: Record<string, unknown> = {}): HierarchyEntry[] {
  const scope = options.scope === 'section' ? 'section' : 'collection'
  const includeFolders = options.includeFolders !== false
  const normalizedPath = canonicalizeGinkoHierarchyPath(state, path)
  if (scope !== 'section') {
    return collectNavigableEntries(state.tree, includeFolders, [])
  }
  const sectionNode = state.tree.find((node: HierarchyEntry) => node.nodeKind === 'section' && hierarchySubtreeContainsPath([node], normalizedPath))
  if (!sectionNode) {
    return collectNavigableEntries(state.tree, includeFolders, [])
  }
  return collectNavigableEntries(sectionNode.children || [], includeFolders, [])
}
function getGinkoHierarchyEntryPath(state: GinkoHierarchyState, entry: HierarchyEntry): string | undefined {
  const root = resolveRootEntry(state, entry)
  return root?.path || entry.path
}

export { buildGinkoHierarchyState, canonicalizeGinkoHierarchyPath, extractContentIdFromSlug, getGinkoHierarchyEntryPath, getGinkoHierarchySurroundEntries, localizePath, normalizePath, normalizeSlugSegment, resolveGinkoHierarchyPath }
export type { GinkoHierarchyState, HierarchyEntry }
