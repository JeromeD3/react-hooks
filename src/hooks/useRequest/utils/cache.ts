const cache = new Map()

const setCache = (key: any, cachedData: any) => {
  cache.set(key, {
    ...cachedData,
  })
}

const getCache = (key: any) => {
  return cache.get(key)
}

export { getCache, setCache }
