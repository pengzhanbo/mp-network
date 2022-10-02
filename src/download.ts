import { downloadAdapter } from './core/adapter'
import type { PlatformDownload, PlatformDownloadTask } from './core/support'
import type { DownloadRequestOptions, DownloadResponseOptions } from './types'
import { combUrl, deepMerge } from './utils'

type DownloadPromise = Promise<DownloadResponseOptions> & PlatformDownloadTask
interface Download {
  (
    url: string,
    filePath?: string,
    options?: Omit<DownloadRequestOptions, 'filePath'>
  ): DownloadPromise
}

export function createDownload(
  uploadOptions: Partial<DownloadRequestOptions> = {}
): Download {
  return function (url, filePath, options = {}) {
    const _option = deepMerge<PlatformDownload>(
      { url, filePath },
      uploadOptions,
      options
    )

    _option.url = combUrl(_option.baseUrl || '', _option.url)
    delete _option.baseUrl

    const adapter = downloadAdapter(_option)

    const promise = adapter.promise

    Object.assign(promise, {
      abort() {
        adapter.download?.abort?.()
      },
      onProgressUpdate(listener) {
        adapter.download?.onProgressUpdate?.(listener)
      },
      onHeadersReceived(listener) {
        adapter.download?.onHeadersReceived?.(listener)
      },
      offProgressUpdate(listener) {
        adapter.download?.offProgressUpdate(listener)
      },
      offHeadersReceived(listener) {
        adapter.download?.offHeadersReceived?.(listener)
      },
    } as PlatformDownloadTask)

    return promise as unknown as DownloadPromise
  }
}

export const download = createDownload()
