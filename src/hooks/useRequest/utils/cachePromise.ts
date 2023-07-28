/**
 * 
 * 专门存储 promise 的缓存
 */
const cachePromise = new Map()

const getCachePromise = (cacheKey: any) => {
  return cachePromise.get(cacheKey)
}

const setCachePromise = (cacheKey: any, promise: any) => {
  cachePromise.set(cacheKey, promise)
  promise
    .then((res: any) => {
      cachePromise.delete(cacheKey)
      return res
    })
    .catch(() => {
      cachePromise.delete(cacheKey)
    })
}

export { getCachePromise, setCachePromise }
