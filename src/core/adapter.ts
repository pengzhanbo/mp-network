import type {
  DownloadResponseOptions,
  ResponseError,
  ResponseOptions,
  UploadResponseOptions,
} from 'mp-network/types'
import type {
  PlatformDownload,
  PlatformDownloadTask,
  PlatformRequest,
  PlatformRequestTask,
  PlatformUpload,
  PlatformUploadTask,
} from './support'
import { supportPlatform } from './support'

export interface RequestAdapter {
  promise: Promise<any>
  request: PlatformRequestTask
}

export function requestAdapter(options: PlatformRequest): RequestAdapter {
  const platform = supportPlatform()
  const adapter: RequestAdapter = Object.create(null)
  adapter.promise = new Promise((resolve, reject) => {
    adapter.request = platform.request({
      ...options,
      success: (res: ResponseOptions) => {
        resolve(res)
      },
      fail: (res: ResponseError) => {
        reject(res)
      },
    })
  })
  return adapter
}

export interface UploadAdapter {
  promise: Promise<any>
  upload: PlatformUploadTask
}

export function uploadAdapter(options: PlatformUpload): UploadAdapter {
  const platform = supportPlatform()
  const adapter: UploadAdapter = Object.create(null)
  adapter.promise = new Promise((resolve, reject) => {
    adapter.upload = platform.upload({
      ...options,
      success: (res: UploadResponseOptions) => {
        resolve(res)
      },
      fail: (res: ResponseError) => {
        reject(res)
      },
    })
  })
  return adapter
}

export interface DownloadAdapter {
  promise: Promise<any>
  download: PlatformDownloadTask
}

export function downloadAdapter(options: PlatformDownload): DownloadAdapter {
  const platform = supportPlatform()
  const adapter: DownloadAdapter = Object.create(null)
  adapter.promise = new Promise((resolve, reject) => {
    adapter.download = platform.download({
      ...options,
      success: (res: DownloadResponseOptions) => {
        resolve(res)
      },
      fail: (res: ResponseError) => {
        reject(res)
      },
    })
  })
  return adapter
}
