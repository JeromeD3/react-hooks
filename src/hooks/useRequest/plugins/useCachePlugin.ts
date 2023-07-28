import useCreation from '../../Advanced/useCreation'
import * as cache from '../utils/cache'

const useCachePlugin = (
  fetchInstance: any,
  {
    cacheKey,
    staleTime = 0,
    cacheTime = 5 * 60 * 1000, // 默认五分钟
    setCache: customSetCache,
    getCache: customGetCache,
  }: any
) => {
  const _setCache = (key: any, cachedData: any) => {
    if (customSetCache) {
      customSetCache(cachedData)
    } else {
      cache.setCache(key, cacheTime, cachedData)
    }
  }

  const _getCache = (key: any, params?: any) => {
    if (customGetCache) {
      return customGetCache(params)
    }
    return cache.getCache(key)
  }

  // 设置空依赖，只会首次执行
  useCreation(() => {
    if (!cacheKey) {
      return
    }
    const cacheData = _getCache(cacheKey)
    if (cacheData && Object.hasOwnProperty.call(cacheData, 'data')) {
      fetchInstance.state.data = cacheData.data
      fetchInstance.state.params = cacheData.params
      if (staleTime === -1 || new Date().getTime() - cacheData.time <= staleTime) {
        fetchInstance.state.loading = false
      }
    }
  }, [])

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
