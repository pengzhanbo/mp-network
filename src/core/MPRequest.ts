import type {
  Methods,
  RequestData,
  RequestOptions,
  ResponseOptions,
} from 'mp-network/types'
import { combUrl, deepMerge } from 'mp-network/utils'
import type { RequestAdapter } from './adapter'
import { requestAdapter } from './adapter'
import { Interceptor } from './Interceptor'
import type { PlatformRequest, PlatformRequestTask } from './support'

export type RequestPromise<T = any> = Promise<T> & Required<PlatformRequestTask>

export class MPRequest {
  options: RequestOptions
  adapter: (options: PlatformRequest) => RequestAdapter
  interceptors: {
    request: Interceptor
    response: Interceptor
  }

  constructor(options: RequestOptions = {}) {
    this.options = options
    this.interceptors = {
      request: new Interceptor(),
      response: new Interceptor(),
    }
    this.adapter = requestAdapter
  }

  private request(
    method: Methods,
    url: string,
    data?: RequestData,
    options?: RequestOptions
  ): RequestPromise<ResponseOptions> {
    const requestOptions = this.transformOptions({
      method,
      url,
      data: data || {},
      ...options,
    })
    let request!: RequestAdapter['request']
    const dispatchRequest = (options: PlatformRequest) => {
      const adapter = this.adapter(options)
      request = adapter.request
      return adapter.promise
    }
    const chain = [dispatchRequest, undefined]
    let promise = Promise.resolve(requestOptions)
    this.interceptors.request.forEach((interceptor) => {
      chain.unshift(interceptor.fulfilled, interceptor.rejected)
    })
    this.interceptors.response.forEach((interceptor) => {
      chain.push(interceptor.fulfilled, interceptor.rejected)
    })
    while (chain.length) promise = promise.then(chain.shift(), chain.shift())

    Object.assign(promise, {
      abort() {
        request?.abort?.()
      },
      onChunkReceived(listener) {
        request?.onChunkReceived?.(listener)
      },
      onHeadersReceived(listener) {
        request?.onHeadersReceived?.(listener)
      },
      offChunkReceived(listener) {
        request?.offChunkReceived?.(listener)
      },
      offHeadersReceived(listener) {
        request?.offChunkReceived?.(listener)
      },
    } as PlatformRequestTask)

    return promise as unknown as RequestPromise<ResponseOptions>
  }

  private transformOptions(
    options: Omit<PlatformRequest, 'baseUrl'>
  ): PlatformRequest {
    const _options = deepMerge<PlatformRequest>({}, this.options, options)
    _options.url = combUrl(this.options.baseUrl || '', options.url)
    delete _options.baseUrl
    return _options
  }

  public get(
    url: string,
    data?: RequestData,
    options?: RequestOptions
  ): RequestPromise<ResponseOptions> {
    return this.request('GET', url, data, options)
  }

  public post(
    url: string,
    data?: RequestData,
    options?: RequestOptions
  ): RequestPromise<ResponseOptions> {
    return this.request('POST', url, data, options)
  }

  public put(
    url: string,
    data?: RequestData,
    options?: RequestOptions
  ): RequestPromise<ResponseOptions> {
    return this.request('PUT', url, data, options)
  }

  public delete(
    url: string,
    data?: RequestData,
    options?: RequestOptions
  ): RequestPromise<ResponseOptions> {
    return this.request('DELETE', url, data, options)
  }

  public trace(
    url: string,
    data?: RequestData,
    options?: RequestOptions
  ): RequestPromise<ResponseOptions> {
    return this.request('TRACE', url, data, options)
  }

  public connect(
    url: string,
    data?: RequestData,
    options?: RequestOptions
  ): RequestPromise<ResponseOptions> {
    return this.request('CONNECT', url, data, options)
  }
}
