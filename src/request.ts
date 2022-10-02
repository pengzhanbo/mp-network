import { MPRequest } from './core/MPRequest'
import type { RequestOptions } from './types'

export function createRequest(options?: RequestOptions) {
  return new MPRequest(options)
}

export const request = createRequest()
