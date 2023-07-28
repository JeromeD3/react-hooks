const cache = new Map()

const setCache = (key: any, cachedData: any) => {
  cache.set(key, {
    ...cachedData,
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
