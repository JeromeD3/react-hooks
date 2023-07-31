export interface CachedData<TData = any, TParams = any> {
  data: TData
  params: TParams
  time: number
}


const cache = new Map()

const setCache = (key: any, cacheTime: number, cachedData: CachedData) => {
  const currentCache = cache.get(key)
  if (currentCache?.timer) {
    clearTimeout(currentCache.timer)
  }

  let timer: any = undefined

  if (cacheTime > -1) {
    // if cache out, clear it
    timer = setTimeout(() => {
      cache.delete(key)
    }, cacheTime)
  }

  cache.set(key, {
    ...cachedData,
    timer,
  })
}
const getCache = (key: any) => {
  return cache.get(key)
}
const clearCache = (key: any) => {
  console.log('clearCache', key)
  if (key) {
    const cacheKeys = Array.isArray(key) ? key : [key]
    cacheKeys.forEach((cacheKey) => cache.delete(cacheKey))
  } else {
    cache.clear()
  }
}
export { getCache, setCache, clearCache }
