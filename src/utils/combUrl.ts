const httpPattern = /^([a-z][a-z\d+\-.]*:)?\/\//i

export const isHttp = (url: string): boolean => httpPattern.test(url)
export const combUrl = (baseUrl: string, url: string): string => {
  if (isHttp(url)) return url
  return url
    ? `${baseUrl.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`
    : baseUrl
}
