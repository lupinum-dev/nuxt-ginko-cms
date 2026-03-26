// ─── Dataset block types ──────────────────────────────────────────────────────

export interface HoursDay {
  open: string
  close: string
}

export interface HoursData {
  mon?: HoursDay | null
  tue?: HoursDay | null
  wed?: HoursDay | null
  thu?: HoursDay | null
  fri?: HoursDay | null
  sat?: HoursDay | null
  sun?: HoursDay | null
}

export interface BannerData {
  text: string
  active: boolean
  activeFrom?: number
  activeTo?: number
  cta?: { label: string; url: string }
}

export interface DatasetPublicFileData {
  url: string
  filename: string
  mimeType: string
  size: number
}

export interface HoursBlock {
  type: 'hours'
  key: string
  label: string
  data: HoursData
}

export interface BannerBlock {
  type: 'banner'
  key: string
  label: string
  data: BannerData
}

export interface FileBlock {
  type: 'file'
  key: string
  label: string
  data: DatasetPublicFileData
}

export interface JsonBlock {
  type: 'json'
  key: string
  label: string
  data: unknown
}

/** Union of all public block shapes (file blocks expose `url` instead of `storageId`). */
export type DatasetPublicBlock = HoursBlock | BannerBlock | FileBlock | JsonBlock

/** Public shape returned from `GET /api/v1/datasets/{datasetId}` — safe to use at build time. */
export interface DatasetPublic {
  _id: string
  name: string
  blocks: DatasetPublicBlock[]
  updatedAt: number
}
