import { uploadAdapter } from './core/adapter'
import type { PlatformUpload, PlatformUploadTask } from './core/support'
import type { UploadRequestOptions, UploadResponseOptions } from './types'
import { deepMerge } from './utils'

type UploadPromise = Promise<UploadResponseOptions> & PlatformUploadTask
interface Upload {
  (
    url: string,
    data: {
      filePath: string
      name: string
      [x: string]: unknown
    },
    options: Omit<UploadRequestOptions, 'filePath' | 'name' | 'formData'>
  ): UploadPromise
}

export function createUpload(
  uploadOptions: Partial<UploadRequestOptions> = {}
): Upload {
  return function (url, data, options) {
    const _option = deepMerge<PlatformUpload>({ url }, uploadOptions, options)

    _option.name = data.name
    _option.filePath = data.filePath
    delete (data as any).filePath
    delete (data as any).name

    _option.formData = deepMerge<PlatformUpload['formData']>(
      _option.formData,
      data
    )

    const adapter = uploadAdapter(_option)

    const promise = adapter.promise

    Object.assign(promise, {
      abort() {
        adapter.upload?.abort?.()
      },
      onProgressUpdate(listener) {
        adapter.upload?.onProgressUpdate?.(listener)
      },
      onHeadersReceived(listener) {
        adapter.upload?.onHeadersReceived?.(listener)
      },
      offProgressUpdate(listener) {
        adapter.upload?.offProgressUpdate(listener)
      },
      offHeadersReceived(listener) {
        adapter.upload?.offHeadersReceived?.(listener)
      },
    } as PlatformUploadTask)

    return promise as unknown as UploadPromise
  }
}

export const upload = createUpload()
