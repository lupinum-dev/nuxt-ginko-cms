import type { ComputedRef, Ref } from 'vue'
import type { GinkoCollections, GinkoNavGroup, GinkoNavItem, GinkoNavSection } from '../../types/index.js'
import type { GinkoError } from '../../types/error.js'
import { useAsyncData, useNuxtApp, useRequestFetch, useRoute, useRuntimeConfig } from '#imports'
import { computed, ref, watch } from 'vue'
import { toGinkoError } from '../../types/error.js'
import { resolveGinkoLocale } from './_ginkoUtils.js'

/** Raw navigation node from BFF. */
interface RawNavNode {
  title?: string
  slug?: string
  kind?: 'page' | 'folder' | 'group' | 'section'
  icon?: string
  badge?: string
  path?: string
  children?: RawNavNode[]
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

function getKind(node: RawNavNode): string {
  return node.kind ?? 'page'
}

function mapNavItem(node: RawNavNode): GinkoNavItem {
  return {
    title: node.title || 'Untitled',
    path: node.path,
    icon: node.icon,
    badge: node.badge,
    children: (node.children ?? [])
      .filter(child => getKind(child) !== 'group' && getKind(child) !== 'section')
      .map(mapNavItem),
  }
}

function findFirstPath(items: GinkoNavItem[]): string | undefined {
  for (const item of items) {
    if (item.path) {
      return item.path
    }
    const nestedPath = findFirstPath(item.children)
    if (nestedPath) {
      return nestedPath
    }
  }
  return undefined
}

/** Group children of a parent node into NavGroups. Group nodes become group headings. */
function groupChildren(children: RawNavNode[]): GinkoNavGroup[] {
  const groups: GinkoNavGroup[] = []
  const ungrouped: GinkoNavItem[] = []

  for (const child of children) {
    const kind = getKind(child)
    if (kind === 'group') {
      groups.push({
        id: slugify(child.title || 'group'),
        title: child.title || undefined,
        items: (child.children ?? []).map(mapNavItem),
      })
    }
    else if (kind !== 'section') {
      ungrouped.push(mapNavItem(child))
    }
  }

  if (ungrouped.length > 0) {
    groups.unshift({
      id: 'ungrouped',
      title: undefined,
      items: ungrouped,
    })
  }

  return groups
}

function resolveSectionPath(groups: GinkoNavGroup[]): string | undefined {
  for (const group of groups) {
    const path = findFirstPath(group.items)
    if (path) {
      return path
    }
  }
  return undefined
}

/** Process raw tree into sections. */
function buildSections(rawTree: RawNavNode[]): GinkoNavSection[] {
  const sectionNodes = rawTree.filter(node => getKind(node) === 'section')

  if (sectionNodes.length > 0) {
    return sectionNodes.map((node) => {
      const groups = groupChildren(node.children ?? [])
      return {
        id: slugify(node.slug || node.title || 'section'),
        slug: node.slug,
        title: node.title || 'Untitled',
        path: resolveSectionPath(groups),
        icon: node.icon,
        groups,
      }
    })
  }

  // No section nodes → everything goes into one implicit section
  const groups = groupChildren(rawTree)
  return [{
    id: 'default',
    path: resolveSectionPath(groups),
    title: '',
    groups,
  }]
}

/** Flatten all items from sections for search/breadcrumb usage. */
function flattenItems(sections: GinkoNavSection[]): GinkoNavItem[] {
  const items: GinkoNavItem[] = []
  const walk = (navItems: GinkoNavItem[]) => {
    for (const item of navItems) {
      items.push(item)
      if (item.children.length) walk(item.children)
    }
  }
  for (const section of sections) {
    for (const group of section.groups) {
      walk(group.items)
    }
  }
  return items
}

/** Find which section a path belongs to. */
function detectActiveSection(path: string, sections: GinkoNavSection[]): string {
  for (const section of sections) {
    for (const group of section.groups) {
      for (const item of group.items) {
        if (item.path === path) return section.id
        if (item.children.some(c => c.path === path)) return section.id
      }
    }
  }
  return sections[0]?.id ?? 'default'
}

/** Options for {@link useGinkoNav}. */
export interface UseGinkoNavOptions {
  /** Locale override. */
  locale?: Ref<string> | string
  /** Watch for reactive refetching. @default true */
  watch?: boolean
}

/** Return shape of {@link useGinkoNav}. */
export interface UseGinkoNavResult {
  /** All navigation sections (pre-grouped from CMS tree). */
  sections: Ref<GinkoNavSection[]>
  /** Active section id. Writable — auto-tracks route, clears override on navigation. */
  activeSection: Ref<string>
  /** Groups for the currently active section. */
  groups: ComputedRef<GinkoNavGroup[]>
  /** All items flattened (for search, breadcrumbs). */
  flat: ComputedRef<GinkoNavItem[]>
  /** Whether a fetch is in progress. */
  pending: Ref<boolean>
  /** Error from last fetch. */
  error: Ref<GinkoError | null>
  /** Manually refetch. */
  refresh: () => Promise<void>
}

/**
 * Fetch pre-grouped hierarchy navigation for a collection.
 *
 * Returns sections/groups/items ready for sidebar rendering.
 * `activeSection` auto-tracks the current route. Writing to it
 * overrides until the next route change.
 *
 * @module ginko
 * @scope navigation
 * @state Shared
 * @mutations None
 *
 * @example
 * ```ts
 * const { sections, activeSection, groups } = useGinkoNav('docs')
 * ```
 */
export function useGinkoNav<K extends keyof GinkoCollections | (string & {})>(
  collectionKey: K,
  options: UseGinkoNavOptions = {},
): UseGinkoNavResult {
  const { watch: enableWatch = true } = options
  const nuxtApp = useNuxtApp()
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const requestFetch = useRequestFetch()
  const resolvedLocale = resolveGinkoLocale(options.locale, nuxtApp, route, runtimeConfig)
  const routeBase = String(runtimeConfig.public.ginkoCms?.routeBase || '/api/ginko').replace(/\/$/, '')

  const cacheKey = () => `ginko-nav:${String(collectionKey)}:${resolvedLocale.value}`

  const { data: rawTree, pending, error: rawError, refresh } = useAsyncData(
    cacheKey,
    async () => {
      const payload = {
        op: 'navigation',
        collectionKey: String(collectionKey),
        locale: resolvedLocale.value || undefined,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await requestFetch(`${routeBase}/query`, {
        method: 'POST',
        body: payload,
      })
      return Array.isArray(response.data) ? response.data as RawNavNode[] : []
    },
    {
      default: () => [] as RawNavNode[],
      watch: enableWatch ? [resolvedLocale] : [],
    },
  )

  const sections = computed<GinkoNavSection[]>(() => buildSections(rawTree.value))

  // activeSection: auto-tracks route, writable for manual override
  const manualOverride = ref<string | null>(null)
  const activeSection = computed<string>({
    get: () => manualOverride.value ?? detectActiveSection(route.path, sections.value),
    set: (val) => { manualOverride.value = val },
  })

  // Clear manual override on route change
  watch(() => route.path, () => {
    manualOverride.value = null
  })

  const groups = computed<GinkoNavGroup[]>(() => {
    const section = sections.value.find(s => s.id === activeSection.value)
    return section?.groups ?? sections.value[0]?.groups ?? []
  })

  const flat = computed<GinkoNavItem[]>(() => flattenItems(sections.value))

  const typedError = computed<GinkoError | null>(() =>
    rawError.value ? toGinkoError(rawError.value) : null,
  )

  return {
    sections: sections as unknown as Ref<GinkoNavSection[]>,
    activeSection: activeSection as unknown as Ref<string>,
    groups,
    flat,
    pending,
    error: typedError as Ref<GinkoError | null>,
    refresh,
  }
}
