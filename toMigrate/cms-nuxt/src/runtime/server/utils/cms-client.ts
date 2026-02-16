/**
 * CMS HTTP Client
 *
 * Provides methods to interact with the Convex CMS Public API
 */

import type { $Fetch } from 'ofetch'
import type { CmsItem, CmsItemResponse, CmsListResponse } from '../../types/api'
import { ofetch } from 'ofetch'

export interface CmsClientOptions {
  apiUrl: string
  apiKey: string
  teamSlug: string
}

export interface ListOptions {
  locale?: string
  limit?: number
  offset?: number
  populate?: string[]
}

export interface GetOptions {
  locale?: string
  populate?: string[]
}

export class CmsClient {
  private client: $Fetch
  private teamSlug: string

  constructor(options: CmsClientOptions) {
    this.teamSlug = options.teamSlug
    this.client = ofetch.create({
      baseURL: `${options.apiUrl}/api/v1/cms/${options.teamSlug}`,
      headers: {
        'Authorization': `Bearer ${options.apiKey}`,
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * List items from a collection
   */
  async listItems(
    collectionSlug: string,
    options: ListOptions = {},
  ): Promise<CmsListResponse> {
    const params = new URLSearchParams()

    if (options.locale)
      params.set('locale', options.locale)
    if (options.limit)
      params.set('limit', String(options.limit))
    if (options.offset)
      params.set('offset', String(options.offset))
    if (options.populate?.length)
      params.set('populate', options.populate.join(','))

    const queryString = params.toString()
    const url = `/${collectionSlug}${queryString ? `?${queryString}` : ''}`

    return this.client<CmsListResponse>(url)
  }

  /**
   * Get a single item by slug
   */
  async getItem(
    collectionSlug: string,
    itemSlug: string,
    options: GetOptions = {},
  ): Promise<CmsItemResponse> {
    const params = new URLSearchParams()

    if (options.locale)
      params.set('locale', options.locale)
    if (options.populate?.length)
      params.set('populate', options.populate.join(','))

    const queryString = params.toString()
    const url = `/${collectionSlug}/${itemSlug}${queryString ? `?${queryString}` : ''}`

    return this.client<CmsItemResponse>(url)
  }

  /**
   * Fetch all items from a collection (handles pagination)
   */
  async fetchAllItems(
    collectionSlug: string,
    locale: string,
    populate?: string[],
  ): Promise<CmsItem[]> {
    const allItems: CmsItem[] = []
    let offset = 0
    const limit = 100
    let hasMore = true

    while (hasMore) {
      const response = await this.listItems(collectionSlug, {
        locale,
        limit,
        offset,
        populate,
      })

      allItems.push(...response.data)
      offset += limit
      hasMore = offset < response.meta.total
    }

    return allItems
  }

  /**
   * Get storage URL for an asset
   */
  getStorageUrl(storageId: string): string {
    // Convex storage URL format
    return `https://${this.teamSlug}.convex.cloud/api/storage/${storageId}`
  }
}

/**
 * Create a CMS client instance
 */
export function createCmsClient(options: CmsClientOptions): CmsClient {
  return new CmsClient(options)
}
