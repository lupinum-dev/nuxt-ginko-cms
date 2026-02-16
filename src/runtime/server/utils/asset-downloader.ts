import type { AssetInfo } from '../../utils/mdc-transform'
import { Buffer } from 'node:buffer'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { ofetch } from 'ofetch'

export interface DownloadOptions {
  /** Convex deployment name (for storage URL) */
  deploymentName: string
  /** Directory to save assets (relative to project root) */
  outputDir: string
  /** Project root directory */
  rootDir: string
}

/**
 * Download a single asset from Convex storage
 *
 * @param assetId - The asset ID from CMS
 * @param storageId - The storage ID from Convex (or the full URL)
 * @param options - Download options
 * @returns AssetInfo with local path
 */
export async function downloadAsset(
  assetId: string,
  storageId: string,
  options: DownloadOptions,
): Promise<AssetInfo> {
  const storageUrl = `https://${options.deploymentName}.convex.cloud/api/storage/${storageId}`

  // Fetch the asset
  const response = await ofetch.raw(storageUrl, {
    responseType: 'arrayBuffer',
  })

  // Get content type and determine extension
  const contentType = response.headers.get('content-type') || 'application/octet-stream'
  const extension = getExtensionFromMimeType(contentType)
  const filename = `${assetId}${extension}`

  // Ensure output directory exists
  const outputPath = join(options.rootDir, 'public', options.outputDir, filename)
  await mkdir(dirname(outputPath), { recursive: true })

  // Write the file
  const buffer = Buffer.from(response._data as ArrayBuffer)
  await writeFile(outputPath, buffer)

  return {
    assetId,
    storageUrl,
    localPath: `/${options.outputDir}/${filename}`,
    filename,
    mimeType: contentType,
  }
}

/**
 * Download multiple assets in parallel with concurrency limit
 *
 * @param assets - Array of { assetId, storageId } objects
 * @param options - Download options
 * @param concurrency - Max concurrent downloads (default: 5)
 * @returns Map of assetId to AssetInfo
 */
export async function downloadAssets(
  assets: Array<{ assetId: string, storageId: string }>,
  options: DownloadOptions,
  concurrency = 5,
): Promise<Map<string, AssetInfo>> {
  const results = new Map<string, AssetInfo>()

  // Process in batches
  for (let i = 0; i < assets.length; i += concurrency) {
    const batch = assets.slice(i, i + concurrency)
    const batchResults = await Promise.all(
      batch.map(async ({ assetId, storageId }) => {
        try {
          const info = await downloadAsset(assetId, storageId, options)
          return { assetId, info }
        }
        catch (error) {
          console.warn(`Failed to download asset ${assetId}:`, error)
          return null
        }
      }),
    )

    for (const result of batchResults) {
      if (result) {
        results.set(result.assetId, result.info)
      }
    }
  }

  return results
}

/**
 * Get file extension from MIME type
 */
function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'image/avif': '.avif',
    'application/pdf': '.pdf',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'audio/mpeg': '.mp3',
    'audio/ogg': '.ogg',
    'application/json': '.json',
    'text/plain': '.txt',
    'text/html': '.html',
    'text/css': '.css',
    'application/javascript': '.js',
  }

  // Get the base type without parameters (e.g., 'image/jpeg; charset=utf-8' -> 'image/jpeg')
  const baseType = (mimeType.split(';')[0] ?? '').trim().toLowerCase()

  return mimeToExt[baseType] || ''
}

/**
 * Download a single asset from a full storage URL
 *
 * @param storageUrl - The full Convex storage URL
 * @param options - Download options
 * @returns Local path to the downloaded file
 */
export async function downloadAssetFromUrl(
  storageUrl: string,
  options: Pick<DownloadOptions, 'outputDir' | 'rootDir'>,
): Promise<string> {
  // Extract storage ID from URL for filename (supports UUID, base62, etc.)
  const storageIdMatch = storageUrl.match(/\/api\/storage\/([\w-]+)/)
  const storageId = storageIdMatch?.[1] || Date.now().toString()

  // Fetch the asset
  const response = await ofetch.raw(storageUrl, {
    responseType: 'arrayBuffer',
  })

  // Get content type and determine extension
  const contentType = response.headers.get('content-type') || 'application/octet-stream'
  const extension = getExtensionFromMimeType(contentType)
  const filename = `${storageId}${extension}`

  // Ensure output directory exists
  const outputPath = join(options.rootDir, 'public', options.outputDir, filename)
  await mkdir(dirname(outputPath), { recursive: true })

  // Write the file
  const buffer = Buffer.from(response._data as ArrayBuffer)
  await writeFile(outputPath, buffer)

  return `/${options.outputDir}/${filename}`
}

/**
 * Download multiple assets from storage URLs
 *
 * @param urls - Array of Convex storage URLs
 * @param options - Download options
 * @param concurrency - Max concurrent downloads (default: 5)
 * @returns Map of storageUrl to localPath
 */
export async function downloadAssetsFromUrls(
  urls: string[],
  options: Pick<DownloadOptions, 'outputDir' | 'rootDir'>,
  concurrency = 5,
): Promise<Map<string, string>> {
  const results = new Map<string, string>()

  // Process in batches
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency)
    const batchResults = await Promise.all(
      batch.map(async (url) => {
        try {
          const localPath = await downloadAssetFromUrl(url, options)
          return { url, localPath }
        }
        catch (error) {
          console.warn(`[cms-nuxt] Failed to download asset from ${url}:`, error)
          return null
        }
      }),
    )

    for (const result of batchResults) {
      if (result) {
        results.set(result.url, result.localPath)
      }
    }
  }

  return results
}

/**
 * Extract deployment name from Convex site URL
 *
 * @param siteUrl - e.g., 'https://xxx.convex.site'
 * @returns Deployment name (e.g., 'xxx')
 */
export function extractDeploymentName(siteUrl: string): string {
  const match = siteUrl.match(/https?:\/\/([^.]+)\.convex\.site/)
  return match?.[1] || ''
}
