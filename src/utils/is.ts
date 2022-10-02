const toString = Object.prototype.toString

const getType = (val: any): string => toString.call(val).slice(8, -1)

export const isObject = (val: any): val is object => getType(val) === 'Object'
