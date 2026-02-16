// Auto-generated from CMS schema - DO NOT EDIT
// This file is an example of what `npx cms-nuxt generate-types` produces
// Run that command to regenerate after schema changes

import type { CmsItem } from 'ginko-nuxt'

export interface BlogPost extends CmsItem {
  /** Title */
  title: string
  /** Excerpt */
  excerpt?: string
  /** Content */
  content?: string
  /** Featured Image */
  featuredimage?: string
  /** Author */
  author?: string | Author
}

export interface Author extends CmsItem {
  /** Name */
  name: string
  /** Bio */
  bio?: string
  /** Avatar */
  avatar?: string
}

export interface Legal extends CmsItem {
  /** Title */
  title: string
  /** Content */
  content?: string
}

/**
 * Type map for collection slugs to their item types
 * Use with generic composables: useCmsCollection<CmsCollectionTypes['blogs']>()
 */
export interface CmsCollectionTypes {
  blogs: BlogPost
  authors: Author
  legal: Legal
}
