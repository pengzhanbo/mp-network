type HeaderValue = string | string[] | number | boolean | null

/**
 * 请求方法
 */
export type Methods =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'TRACE'
  | 'CONNECT'

export type DataType = 'json' | string

export type ResponseType = 'text' | 'arraybuffer'

export type RequestData = string | object | any[] | number | ArrayBuffer

/**
 * 请求头
 */
export type RequestHeader = Record<string, HeaderValue>

/**
 * 响应头
 */
export type ResponseHeader = Record<string, HeaderValue>

/**
 * 请求体配置
 */
export interface RequestOptions {
  /**
   * 请求地址前缀
   * @default ''
   */
  baseUrl?: string
  /**
   * 超时时间。 单位： `ms`
   * @default 60000
   */
  timeout?: number
  /**
   * 返回的数据格式
   * @default 'json'
   */
  dataType?: DataType
  /**
   * 响应的数据类型
   * @default 'text'
   */
  responseType?: ResponseType
  /**
   * 设置请求的 header
   * @default {'content-type':'application/json'}
   */
  header?: RequestHeader
  /**
   * 开启 http2
   * @default false
   */
  enableHttp2?: boolean
  /**
   * 开启 quic
   * @default false
   */
  enableQuic?: boolean
  /**
   * 开启 cache
   * @default false
   */
  enableCache?: boolean
  /**
   * 是否开启 HttpDNS 服务。如开启，需要同时填入 httpDNSServiceId 。
   * @see [移动解析HttpDNS](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/HTTPDNS.html)
   * @default false
   */
  enableHttpDNS?: boolean
  /**
   * HttpDNS 服务商 Id。
   * @see [移动解析HttpDNS](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/HTTPDNS.html)
   * @default ''
   */
  httpDNSServiceId?: string
  /**
   * 开启 transfer-encoding
   * @default false
   */
  enableChunked?: boolean
  /**
   * wifi下使用移动网络发送请求
   * @default false
   */
  forceCellularNetwork?: boolean
}

/**
 * 响应体
 */
export interface ResponseOptions {
  /**
   * 服务器返回的数据
   */
  data: string | object | ArrayBuffer
  /**
   * 服务器返回的状态码
   */
  statusCode: number
  /**
   * 服务器返回的响应头
   */
  header: ResponseHeader
  /**
   * 开发者服务器返回的 cookies，
   */
  cookies: string[]
  /**
   * 网络请求过程中一些调试信息
   */
  profile: ResponseProfile
}

/**
 * 失败响应
 */
export interface ResponseError {
  /**
   * 错误信息
   */
  errMsg: string
  /**
   * errno 错误码
   * @see [Error错误码](https://developers.weixin.qq.com/miniprogram/dev/framework/usability/PublicErrno.html)
   */
  errno: number
}

export interface DownloadRequestOptions {
  /**
   * 请求地址前缀
   * @default ''
   */
  baseUrl?: string
  /**
   * HTTP 请求的 Header
   */
  header?: RequestHeader
  /**
   * 超时时间，单位为毫秒
   */
  timeout?: number
  /**
   * 指定文件下载后存储的路径 (本地路径)
   */
  filePath?: string
}

export interface DownloadResponseOptions {
  /**
   * 临时文件路径 (本地路径)。没传入 filePath 指定文件存储路径时会返回，下载后的文件会存储到一个临时文件
   */
  tempFilePath: string
  /**
   * 用户文件路径 (本地路径)。传入 filePath 时会返回，跟传入的 filePath 一致
   */
  filePath: string
  /**
   * 开发者服务器返回的 HTTP 状态码
   */
  statusCode: number
  /**
   * 网络请求过程中一些调试信息
   */
  profile: ResponseProfile
}

export interface UploadRequestOptions {
  /**
   * 请求地址前缀
   * @default ''
   */
  baseUrl?: string
  /**
   * 要上传文件资源的路径 (本地路径)
   */
  filePath: string
  /**
   * 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
   */
  name: string

  /**
   * 上传的文件名
   */
  fileName?: string
  /**
   * HTTP 请求 Header
   */
  header?: RequestHeader
  /**
   * HTTP 请求中其他额外的 form data
   */
  formData?: Record<string, unknown>
  /**
   * 超时时间，单位为毫秒
   */
  timeout?: number
}

export interface UploadResponseOptions {
  /**
   * 开发者服务器返回的数据
   */
  data: any
  /**
   * 开发者服务器返回的 HTTP 状态码
   */
  statusCode: number
  /**
   * 网络请求过程中一些调试信息
   */
  profile: ResponseProfile
}

/**
 * 请求调试信息
 */
export interface ResponseProfile {
  /**
   * 第一个 HTTP 重定向发生时的时间。有跳转且是同域名内的重定向才算，否则值为 0
   */
  redirectStart: number
  /**
   * 最后一个 HTTP 重定向完成时的时间。有跳转且是同域名内部的重定向才算，否则值为 0
   */
  redirectEnd: number
  /**
   * 组件准备好使用 HTTP 请求抓取资源的时间，这发生在检查本地缓存之前
   */
  fetchStart: number
  /**
   * DNS 域名查询开始的时间，如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等
   */
  domainLookupStart: number
  /**
   * DNS 域名查询完成的时间，如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等
   */
  domainLookupEnd: number
  /**
   * HTTP（TCP） 开始建立连接的时间，如果是持久连接，则与 fetchStart 值相等。
   * 注意如果在传输层发生了错误且重新建立连接，则这里显示的是新建立的连接开始的时间
   */
  connectStart: number
  /**
   * HTTP（TCP） 完成建立连接的时间（完成握手），如果是持久连接，则与 fetchStart 值相等。
   * 注意如果在传输层发生了错误且重新建立连接，则这里显示的是新建立的连接完成的时间。
   * 注意这里握手结束，包括安全连接建立完成、SOCKS 授权通过
   */
  connectEnd: number
  /**
   * SSL建立连接的时间,如果不是安全连接,则值为 0
   */
  SSLconnectionStart: number
  /**
   * SSL建立完成的时间,如果不是安全连接,则值为 0
   */
  SSLconnectionEnd: number
  /**
   * HTTP请求读取真实文档开始的时间（完成建立连接），包括从本地读取缓存。
   * 连接错误重连时，这里显示的也是新建立连接的时间
   */
  requestStart: number
  /**
   * HTTP请求读取真实文档结束的时间
   */
  requestEnd: number
  /**
   * HTTP 开始接收响应的时间（获取到第一个字节），包括从本地读取缓存
   */
  responseStart: number
  /**
   * HTTP 响应全部接收完成的时间（获取到最后一个字节），包括从本地读取缓存
   */
  responseEnd: number
  /**
   * 当次请求连接过程中实时 rtt
   */
  rtt: number
  /**
   * 评估的网络状态
   *
   * | unknown | offline | slow 2g | 2g | 3g | 4g | last |
   * |:--:|:--:|:--:|:--:|:--:|:--:|:--:|
   * |0|1|2|3|4|5|6|
   */
  estimate_nettype: number
  /**
   * 协议层根据多个请求评估当前网络的 rtt（仅供参考）
   */
  httpRttEstimate: number
  /**
   * 传输层根据多个请求评估的当前网络的 rtt（仅供参考）
   */
  transportRttEstimate: number
  /**
   * 评估当前网络下载的kbps
   */
  downstreamThroughputKbpsEstimate: number
  /**
   * 当前网络的实际下载kbps
   */
  throughputKbps: number
  /**
   * 当前请求的IP
   */
  peerIP: string
  /**
   * 当前请求的端口
   */
  port: number
  /**
   * 是否复用连接
   */
  socketReused: boolean
  /**
   * 发送的字节数
   */
  sendBytesCount: number
  /**
   * 收到字节数
   */
  receivedBytedCount: number
  /**
   * 使用协议类型，有效值：http1.1, h2, quic, unknown
   */
  protocol: number
}
