import { isObject } from './is'

export function deepMerge<T = object>(...sources: Partial<T>[]): T {
  if (sources.length === 0) return Object.create(null)
  if (sources.length === 1) return sources[0] as T

  const [target, ...ret] = sources
  ret.forEach((source) => {
    for (const key in source) {
      const sourceValue = source[key]
      const targetValue = target[key]
      if (isObject(sourceValue) && isObject(targetValue))
        target[key] = deepMerge(targetValue, sourceValue)
      else target[key] = sourceValue
    }
  })
  return target as T
}
