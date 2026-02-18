export interface ProxyErrorCandidate {
  status?: number
  statusCode?: number
  data?: unknown
  message?: string
}

export function buildProxyTargetUrl(apiUrl: string, teamSlug: string, fullPath: string, queryString: string): string {
  return `${apiUrl}/api/v1/cms/${teamSlug}/${fullPath}${queryString}`
}

export function getProxyErrorStatus(error: unknown): number {
  if (!error || typeof error !== 'object') {
    return 500
  }
  const err = error as ProxyErrorCandidate
  return err.status || err.statusCode || 500
}

export function getProxyErrorMessage(statusCode: number): string {
  return statusCode === 404 ? 'Not found' : 'CMS API error'
}
