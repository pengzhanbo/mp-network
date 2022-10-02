// src/utils/is.ts
var toString = Object.prototype.toString;
var getType = (val) => toString.call(val).slice(8, -1);
var isObject = (val) => getType(val) === "Object";

// src/utils/deepMerge.ts
function deepMerge(...sources) {
  if (sources.length === 0)
    return /* @__PURE__ */ Object.create(null);
  if (sources.length === 1)
    return sources[0];
  const [target, ...ret] = sources;
  ret.forEach((source) => {
    for (const key in source) {
      const sourceValue = source[key];
      const targetValue = target[key];
      if (isObject(sourceValue) && isObject(targetValue))
        target[key] = deepMerge(targetValue, sourceValue);
      else
        target[key] = sourceValue;
    }
  });
  return target;
}

// src/core/support.ts
var platformList = [
  () => uni,
  () => wx,
  () => my,
  () => swan,
  () => tt,
  () => qq,
  () => qh,
  () => ks,
  () => dd,
  () => Taro
];
var platform;
function getPlatform() {
  if (platform)
    return platform;
  let i = 0;
  while (i < platformList.length) {
    const tryFn = platformList[i];
    try {
      const p = tryFn();
      if (typeof p !== void 0) {
        platform = p;
        return platform;
      }
    } catch (e) {
    }
    i++;
  }
}
var _mp;
function supportPlatform() {
  if (_mp)
    return _mp;
  const mp = getPlatform();
  _mp = {
    request: mp.request ?? mp.httpRequest,
    upload: mp.upload ?? mp.uploadFile,
    download: mp.download || mp.downloadFile
  };
  return _mp;
}

// src/core/adapter.ts
function requestAdapter(options) {
  const platform2 = supportPlatform();
  const adapter = /* @__PURE__ */ Object.create(null);
  adapter.promise = new Promise((resolve, reject) => {
    adapter.request = platform2.request({
      ...options,
      success: (res) => {
        resolve(res);
      },
      fail: (res) => {
        reject(res);
      }
    });
  });
  return adapter;
}
function uploadAdapter(options) {
  const platform2 = supportPlatform();
  const adapter = /* @__PURE__ */ Object.create(null);
  adapter.promise = new Promise((resolve, reject) => {
    adapter.upload = platform2.upload({
      ...options,
      success: (res) => {
        resolve(res);
      },
      fail: (res) => {
        reject(res);
      }
    });
  });
  return adapter;
}
function downloadAdapter(options) {
  const platform2 = supportPlatform();
  const adapter = /* @__PURE__ */ Object.create(null);
  adapter.promise = new Promise((resolve, reject) => {
    adapter.download = platform2.download({
      ...options,
      success: (res) => {
        resolve(res);
      },
      fail: (res) => {
        reject(res);
      }
    });
  });
  return adapter;
}

// src/core/Interceptor.ts
var Interceptor = class {
  constructor() {
    this.handlers = [];
  }
  use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled,
      rejected
    });
    return this.handlers.length - 1;
  }
  eject(id) {
    if (this.handlers[id])
      this.handlers[id] = null;
  }
  forEach(executor) {
    this.handlers.forEach((item) => {
      if (item !== null)
        executor(item);
    });
  }
};

// src/core/MPRequest.ts
var MPRequest = class {
  constructor(options = {}) {
    this.options = options;
    this.interceptors = {
      request: new Interceptor(),
      response: new Interceptor()
    };
    this.adapter = requestAdapter;
  }
  request(method, url, data, options) {
    const requestOptions = this.transformOptions({
      method,
      url,
      data: data || {},
      ...options
    });
    let request2;
    const dispatchRequest = (options2) => {
      const adapter = this.adapter(options2);
      request2 = adapter.request;
      return adapter.promise;
    };
    const chain = [dispatchRequest, void 0];
    let promise = Promise.resolve(requestOptions);
    this.interceptors.request.forEach((interceptor) => {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    this.interceptors.response.forEach((interceptor) => {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });
    while (chain.length)
      promise = promise.then(chain.shift(), chain.shift());
    Object.assign(promise, {
      abort() {
        var _a;
        (_a = request2 == null ? void 0 : request2.abort) == null ? void 0 : _a.call(request2);
      },
      onChunkReceived(listener) {
        var _a;
        (_a = request2 == null ? void 0 : request2.onChunkReceived) == null ? void 0 : _a.call(request2, listener);
      },
      onHeadersReceived(listener) {
        var _a;
        (_a = request2 == null ? void 0 : request2.onHeadersReceived) == null ? void 0 : _a.call(request2, listener);
      },
      offChunkReceived(listener) {
        var _a;
        (_a = request2 == null ? void 0 : request2.offChunkReceived) == null ? void 0 : _a.call(request2, listener);
      },
      offHeadersReceived(listener) {
        var _a;
        (_a = request2 == null ? void 0 : request2.offChunkReceived) == null ? void 0 : _a.call(request2, listener);
      }
    });
    return promise;
  }
  transformOptions(options) {
    return deepMerge({}, this.options, options);
  }
  get(url, data, options) {
    return this.request("GET", url, data, options);
  }
  post(url, data, options) {
    return this.request("POST", url, data, options);
  }
  put(url, data, options) {
    return this.request("PUT", url, data, options);
  }
  delete(url, data, options) {
    return this.request("DELETE", url, data, options);
  }
  trace(url, data, options) {
    return this.request("TRACE", url, data, options);
  }
  connect(url, data, options) {
    return this.request("CONNECT", url, data, options);
  }
};

// src/request.ts
function createRequest(options) {
  return new MPRequest(options);
}
var request = createRequest();

// src/upload.ts
function createUpload(uploadOptions = {}) {
  return function(url, data, options) {
    const _option = deepMerge({ url }, uploadOptions, options);
    _option.name = data.name;
    _option.filePath = data.filePath;
    delete data.filePath;
    delete data.name;
    _option.formData = deepMerge(
      _option.formData,
      data
    );
    const adapter = uploadAdapter(_option);
    const promise = adapter.promise;
    Object.assign(promise, {
      abort() {
        var _a, _b;
        (_b = (_a = adapter.upload) == null ? void 0 : _a.abort) == null ? void 0 : _b.call(_a);
      },
      onProgressUpdate(listener) {
        var _a, _b;
        (_b = (_a = adapter.upload) == null ? void 0 : _a.onProgressUpdate) == null ? void 0 : _b.call(_a, listener);
      },
      onHeadersReceived(listener) {
        var _a, _b;
        (_b = (_a = adapter.upload) == null ? void 0 : _a.onHeadersReceived) == null ? void 0 : _b.call(_a, listener);
      },
      offProgressUpdate(listener) {
        var _a;
        (_a = adapter.upload) == null ? void 0 : _a.offProgressUpdate(listener);
      },
      offHeadersReceived(listener) {
        var _a, _b;
        (_b = (_a = adapter.upload) == null ? void 0 : _a.offHeadersReceived) == null ? void 0 : _b.call(_a, listener);
      }
    });
    return promise;
  };
}
var upload = createUpload();

// src/download.ts
function createDownload(uploadOptions = {}) {
  return function(url, filePath, options = {}) {
    const _option = deepMerge(
      { url, filePath },
      uploadOptions,
      options
    );
    const adapter = downloadAdapter(_option);
    const promise = adapter.promise;
    Object.assign(promise, {
      abort() {
        var _a, _b;
        (_b = (_a = adapter.download) == null ? void 0 : _a.abort) == null ? void 0 : _b.call(_a);
      },
      onProgressUpdate(listener) {
        var _a, _b;
        (_b = (_a = adapter.download) == null ? void 0 : _a.onProgressUpdate) == null ? void 0 : _b.call(_a, listener);
      },
      onHeadersReceived(listener) {
        var _a, _b;
        (_b = (_a = adapter.download) == null ? void 0 : _a.onHeadersReceived) == null ? void 0 : _b.call(_a, listener);
      },
      offProgressUpdate(listener) {
        var _a;
        (_a = adapter.download) == null ? void 0 : _a.offProgressUpdate(listener);
      },
      offHeadersReceived(listener) {
        var _a, _b;
        (_b = (_a = adapter.download) == null ? void 0 : _a.offHeadersReceived) == null ? void 0 : _b.call(_a, listener);
      }
    });
    return promise;
  };
}
var download = createDownload();
export {
  createDownload,
  createRequest,
  createUpload,
  download,
  request,
  upload
};
