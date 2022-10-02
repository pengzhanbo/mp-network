# mp-network

小程序 网络请求 API（request/upload/download） 的二次封装，适配多个小程序平台。

- 支持  微信小程序、支付宝小程序、百度小程序、字节跳动小程序、QQ 小程序、uniapp、Taro
- 支持 Typescript 类型
- 支持 Promise
- 支持 拦截器
- 支持 取消请求
- 支持 上传/下载， 进度监听

## 安装

```sh
# npm
npm i mp-network
# yarn
yarn add mp-network
# pnpm
pnpm add mp-network
```

## 使用

### 原生小程序

由于 原生小程序不支持通过 包管理工具安装的方式，从 `node_modules` 中引入包，
需要手动从 `dist/index.cjs` 中复制代码，到你的本地项目文件中后，再进行引入。

> 注： `dist/index.cjs` 是 commonjs 格式的代码文件

### 其他小程序框架

**引入**
``` js
import { download, request, upload } from 'mp-network'
```
**示例1：promise**
``` js
// 发起 get 请求
request.get('https://example.com/a', { a: 1 })
  .then((response) => {
    console.log(response)
  })

// 发起 post 请求
request.post('https://example.com/b', { b: 1 })
  .then((response) => {
    console.log(response)
  })

// 上传文件
upload('https://example.com/upload', { filePath: '/local/1.txt', name: '1.txt' })
  .then((response) => {
    console.log(response)
  })

// 下载文件
download('https://example.com/download', 'local/1.txt')
  .then((response) => {
    console.log(response)
  })
```

**示例2：async/await**
```js
async function fetchData() {
  const response = await request.get('https://example.com')
  console.log(response)
}
```
**示例3：取消请求**
```js
const promise1 = request.get('https://example.com')

promise1.then((response) => console.log(response))
// 取消请求
promise1.abort()
// ----
// async / await
const promise2 = request.get('https://example.com')

// 取消请求
promise2.abort()

const response = await promise2

```

**示例4：上传进度**

```js
const uploadPromise = upload('https://example.com/upload', { filePath: '/local/1.txt', name: '1.txt' })
uploadPromise.onProgressUpdate((res) => {
  // res.progress  上传进度百分比
  // res.totalBytesSent  已经上传的数据长度，单位 Bytes
  // res.totalBytesExpectedToSend  预期需要上传的数据总长度，单位 Bytes
})
```

**示例5： 下载进度**
``` js
const downloadPromise = download('https://example.com/download')
downloadPromise.onProgressUpdate((res) => {
  // res.progress   下载进度百分比
  // res.totalBytesWritten   已经下载的数据长度，单位 Bytes
  // res.totalBytesExpectedToWrite  预期需要下载的数据总长度，单位 Bytes
})
```

**示例6： 请求拦截器**
```js
// 请求体拦截器
request.interceptor.request.use((config) => {
  // do something
  // 必须返回 config
  return config
})
request.interceptor.response.use((config) => {
  // do something
  
  // 返回处理后的数据
  return config.data
})
```

## Methods

### request

`MPRequest` 实例

- `request.get(url[, data, options]): RequestPromise`
- `request.post(url[, data, options]): RequestPromise`
- `request.put(url[, data, options]): RequestPromise`
- `request.head(url[, data, options]): RequestPromise`
- `request.connect(url[, data, options]): RequestPromise`
- `request.trace(url[, data, options]): RequestPromise`

**参数说明**

- `url` 必填。请求地址。 `string`
- `data` 选填。请求数据。 `string/object/ArrayBuffer`
- `options` 选填。请求设置 `RequestOptions`
  - [RequestOptions](#RequestOptions)

**返回值说明**

`RequestPromise` 是一个 promise， 支持以下方法：

- `promise.then(fulfilled)`  fulfilled(response) 说明
  | 字段 | 描述 |
  | -- | -- |
  | data | 服务器返回的数据 |
  | statusCode | 服务器返回的http状态码 |
  | header | 服务器返回的 header 响应头 | 
  | cookies | 服务器返回的 cookies |
  | profile | 请求调试信息 |
- `promise.catch(rejected)` rejected(error) 说明
  | 字段 | 描述 |
  | -- | -- |
  | errno | 错误码 |
  | errMsg | 错误信息 |
- `promise.abort()` 中止请求
- `promise.onChunkReceived(listener)` 监听 Transfer-Encoding Chunk Received 事件。
- `promise.offChunkReceived(listener)` 取消监听
- `promise.onHeadersReceived(listener)`  监听 HTTP Response Header 事件
- `promise.offHeadersReceived(listener)` 取消监听

#### 拦截器

- `request.interceptor` 拦截器
  - `request.interceptor.request.use(fulfilled, rejected)` 请求体拦截器
  - `request.interceptor.response.use(fulfilled, rejected)` 响应体拦截器


### upload

文件上传请求

`upload(url, data[, options]): UploadPromise`

**参数说明**

- `url` 必填。上传请求地址. `string`
- `data` 必填。上传文件时发送的数据， `object`
  | 字段 | 必填 | 描述 |
  | -- | -- | -- |
  | filePath | 是 | 要上传文件资源的路径 (本地路径) |
  | name | 是 | 文件对应的 key |
  | [string] | 否 | 附加其他的数据 |
- `options` 选填。 请求设置。`UploadRequestOptions`
  - [UploadRequestOptions](#UploadRequestOptions)

**返回参数说明**

`UploadPromise` 是一个 promise，支持以下方法：

- `promise.then(fulfilled)` fulfilled(response)
  | 字段 | 描述 |
  | -- | -- |
  | data | 服务器返回的数据 |
  | statusCode | 服务器返回的http状态码 |
  | profile | 请求调试信息 |
- `promise.catch(rejected)` rejected(error) 说明
  | 字段 | 描述 |
  | -- | -- |
  | errno | 错误码 |
  | errMsg | 错误信息 |
- `promise.abort()` 中止请求
- `promise.onHeadersReceived(listener)`  监听 HTTP Response Header 事件
- `promise.offHeadersReceived(listener)` 取消监听
- `promise.onProgressUpdate(listener)` 监听上传进度
  listener(res)   res 说明：
  | 字段 | 描述 |
  | -- | -- |
  | progress | 上传进度百分比 |
  | totalBytesSent | 已经上传的数据长度，单位 Bytes |
  | totalBytesExpectedToSend | 预期需要上传的数据总长度，单位 Bytes |
- `promise.offProgressUpdate(listener)` 取消监听

### download

文件上传请求

`download(url[, filePath, options]): DownloadPromise`

**参数说明**

- `url` 必填。下载请求地址. `string`
- `filePath` 选填。指定文件下载后存储的路径 (本地路径)， `string`
- `options` 选填。 请求设置。`DownloadRequestOptions`
  - [DownloadRequestOptions](#DownloadRequestOptions)

**返回参数说明**

`DownloadPromise` 是一个 promise，支持以下方法：

- `promise.then(fulfilled)` fulfilled(response)
  | 字段 | 描述 |
  | -- | -- |
  | tempFilePath | 临时文件路径 (本地路径) |
  | filePath | 用户文件路径 (本地路径)。|
  | statusCode | 服务器返回的http状态码 |
  | profile | 请求调试信息 |
- `promise.catch(rejected)` rejected(error) 说明
  | 字段 | 描述 |
  | -- | -- |
  | errno | 错误码 |
  | errMsg | 错误信息 |
- `promise.abort()` 中止请求
- `promise.onHeadersReceived(listener)`  监听 HTTP Response Header 事件
- `promise.offHeadersReceived(listener)` 取消监听
- `promise.onProgressUpdate(listener)` 监听下载进度
  listener(res)   res 说明：
  | 字段 | 描述 |
  | -- | -- |
  | progress | 下载进度百分比 |
  | totalBytesWritten | 已经下载的数据长度，单位 Bytes |
  | totalBytesExpectedToWrite | 预期需要下载的数据总长度，单位 Bytes |
- `promise.offProgressUpdate(listener)` 取消监听

### createRequest

`createRequest(presetOptions: RequestOptions): MPRequest`

- [RequestOptions](#RequestOptions)
- [MPRequest](#MPRequest)

创建一个 请求实例, `presetOptions` 作为预设请求设置，会与请求接口的`options` 进行合并。

``` js
const customRequest = createRequest({
  baseUrl: 'http://example.com/',
  timeout: 60000,
  dataType: 'json',
  header: {
    'content-type': 'application/json'
  }
})

// 发起 post 请求
customRequest.post('/b', { b: 1 })
  .then((response) => {
    console.log(response)
  })
```

## createUpload

`createUpload(presetOptions: UploadRequestOptions): Upload`

返回一个 新的 `upload` 函数，`presetOptions` 作为预设请求设置，会与 upload 函数中的 `options` 进行合并。

```js
const customUpload = createUpload({
  baseUrl: 'http://example.com/',
  timeout: 60000
})

// 上传文件
customUpload('/upload', { filePath: '/local/1.txt', name: '1.txt' })
  .then((response) => {
    console.log(response)
  })
```

## createDownload

`createDownload(presetOptions: DownloadRequestOptions): Download`

返回一个新的 `download` 函数，`presetOptions` 作为预设请求设置，会与 download 函数中的 `options` 进行合并。

```js
const customDownload = createDownload({
  baseUrl: 'http://example.com/',
  timeout: 60000
})
// 下载文件
customDownload('/download', 'local/1.txt')
  .then((response) => {
    console.log(response)
  })
```

## Type

### RequestOptions

| 字段 | 类型 | 描述 |
| --  | --  | -- |
| baseUrl | string | 请求路径公共前缀 | 
| timeout |number | 超时时间，单位为毫秒。默认值为 60000 |
| header | object | 设置请求的 header |
| dataType | string | 返回的数据格式 |
| responseType | string | 响应的数据类型 |
| header | object | 设置请求的 header |
| enableHttp2 | boolean | 开启 http2 |
| enableQuic | boolean | 开启 quic |
| enableCache | boolean | 开启 cache |
| enableHttpDNS | boolean | 是否开启 HttpDNS 服务。|
| httpDNSServiceId | string | HttpDNS 服务商 Id。 |
| enableChunked | boolean | 开启 transfer-encoding |
| forceCellularNetwork | boolean | wifi下使用移动网络发送请求 |

### DownloadRequestOptions

| 字段 | 类型 | 描述 |
| --  | --  | -- |
| baseUrl | string | 请求路径公共前缀 | 
| timeout |number | 超时时间，单位为毫秒。|
| header | object | 设置请求的 header |

### UploadRequestOptions

| 字段 | 类型 | 描述 |
| --  | --  | -- |
| baseUrl | string | 请求路径公共前缀 | 
| timeout |number | 超时时间，单位为毫秒。|
| header | object | 设置请求的 header |
| filePath | string | 要上传文件资源的路径 (本地路径) |
| name | string | 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容 |

### MPRequest

see [request](#request)
