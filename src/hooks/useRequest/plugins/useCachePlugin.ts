import * as cache from '../utils/cache'

const useCachePlugin = (fetchInstance: any, { cacheKey, staleTime = 0 }: any) => {
  const _setCache = (key: any, cachedData: any) => {
    cache.setCache(key, cachedData)
  }

  const _getCache = (key: any) => {
    return cache.getCache(key)
  }

  if (!cacheKey) {
    return {}
  }

  return {
    onBefore: (params: any) => {
      // 从缓存中获取数据
      const cacheData = _getCache(cacheKey, params)
      if (!cacheData || !Object.hasOwnProperty.call(cacheData, 'data')) {
        return {}
      }
   
      if (staleTime === -1 || new Date().getTime() - cacheData.time <= staleTime) {
        // 如果在过期时间内
        return {
          loading: false,
          data: cacheData?.data,
          returnNow: true,
        }
      } else {
        // 返回缓存数据
        return {
          data: cacheData?.data,
        }
      }
    },
    onSuccess: (data: any, params: any) => {
      // 成功的时候就进行缓存
      if (cacheKey) {
        _setCache(cacheKey, {
          data,
          params,
          time: new Date().getTime(),
        })
      }
    },
  }
}

export default useCachePlugin
