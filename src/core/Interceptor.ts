export interface InterceptorFulfilled<T = any> {
  (value: T): T | Promise<T>
}

export interface InterceptorRejected {
  (error: any): any | Promise<any>
}

export interface InterceptorItem<T = any> {
  fulfilled: InterceptorFulfilled<T>
  rejected?: InterceptorRejected
}

export interface InterceptorExecutor {
  (interceptor: InterceptorItem): void
}

export class Interceptor {
  handlers: (InterceptorItem | null)[]

  constructor() {
    this.handlers = []
  }

  use(fulfilled: InterceptorFulfilled, rejected?: InterceptorRejected): number {
    this.handlers.push({
      fulfilled,
      rejected,
    })
    return this.handlers.length - 1
  }

  eject(id: number) {
    if (this.handlers[id]) this.handlers[id] = null
  }

  forEach(executor: InterceptorExecutor) {
    this.handlers.forEach((item) => {
      if (item !== null) executor(item)
    })
  }
}
