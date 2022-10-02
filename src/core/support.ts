import type {
  DownloadRequestOptions,
  DownloadResponseOptions,
  Methods,
  RequestData,
  RequestOptions,
  ResponseError,
  ResponseOptions,
  UploadRequestOptions,
  UploadResponseOptions,
} from '../types'

export interface PlatformRequest extends RequestOptions {
  url: string
  data: RequestData
  method: Methods
  success?: (response: ResponseOptions) => void
  fail?: (response: ResponseError) => void
  complete?: (...args: any[]) => void
}

export interface PlatformUpload extends UploadRequestOptions {
  url: string
  success?: (response: UploadResponseOptions) => void
  fail?: (response: ResponseError) => void
  complete?: (...args: any[]) => void
}

export interface PlatformDownload extends DownloadRequestOptions {
  url: string
  success?: (response: DownloadResponseOptions) => void
  fail?: (response: ResponseError) => void
  complete?: (...args: any[]) => void
}

export type TaskListener = (...args: any[]) => void

export interface PlatformRequestTask {
  abort?: () => void
  onChunkReceived?: (listener: TaskListener) => void
  offChunkReceived?: (listener: TaskListener) => void
  onHeadersReceived?: (listener: TaskListener) => void
  offHeadersReceived?: (listener: TaskListener) => void
}

export interface PlatformUploadTask {
  abort?: () => void
  onHeadersReceived?: (listener: TaskListener) => void
  offHeadersReceived?: (listener: TaskListener) => void
  onProgressUpdate?: (
    listener: (res: {
      progress: number
      totalBytesSent: number
      totalBytesExpectedToSend: number
    }) => void
  ) => void
  offProgressUpdate: (listener: TaskListener) => void
}

export interface PlatformDownloadTask {
  abort?: () => void
  onHeadersReceived?: (listener: TaskListener) => void
  offHeadersReceived?: (listener: TaskListener) => void
  onProgressUpdate?: (
    listener: (res: {
      progress: number
      totalBytesWritten: number
      totalBytesExpectedToWrite: number
    }) => void
  ) => void
  offProgressUpdate: (listener: TaskListener) => void
}

export interface SupportPlatform {
  request: (options: PlatformRequest) => PlatformRequestTask
  upload: (options: PlatformUpload) => PlatformUploadTask
  download: (options: PlatformDownload) => PlatformDownloadTask
}

const platformList: (() => any)[] = [
  () => uni,
  () => wx,
  () => my,
  () => swan,
  () => tt,
  () => qq,
  () => qh,
  () => ks,
  () => dd,
  () => Taro,
]
let platform: any

export function getPlatform(): any {
  if (platform) return platform
  let i = 0
  while (i < platformList.length) {
    const tryFn = platformList[i]
    try {
      const p = tryFn()
      if (typeof p !== undefined) {
        platform = p
        return platform
      }
    } catch (e) {}
    i++
  }
}

let _mp!: SupportPlatform

export function supportPlatform(): SupportPlatform {
  if (_mp) return _mp
  const mp = getPlatform()
  _mp = {
    request: mp.request ?? mp.httpRequest,
    upload: mp.upload ?? mp.uploadFile,
    download: mp.download || mp.downloadFile,
  }
  return _mp
}
