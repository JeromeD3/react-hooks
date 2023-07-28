import { useRef } from 'react'
import useCreation from '../../Advanced/useCreation'
import * as cache from '../utils/cache'
import * as cachePromise from '../utils/cachePromise'
import * as cacheSubscribe from '../utils/cacheSubscribe'

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
  const unSubscribeRef: any = useRef()
  const currentPromiseRef = useRef()

  const _setCache = (key: any, cachedData: any) => {
    if (customSetCache) {
      customSetCache(cachedData)
    } else {
      cache.setCache(key, cacheTime, cachedData)
    }
    console.log('trigger')
    cacheSubscribe.trigger(key, cachedData.data)
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

    onRequest: (service: any, args: any) => {
      console.log('onRequest')

      // 先根据 cacheKey 获取缓存的 promise
      let servicePromise = cachePromise.getCachePromise(cacheKey)
      console.log(currentPromiseRef)

      if (servicePromise && servicePromise !== currentPromiseRef.current) {
        // 说明这是一个新的请求
        return {
          servicePromise, // 返回请求结果
        }
      }

      servicePromise = service(...args)
      // 然后保存上一个请求
      currentPromiseRef.current = servicePromise
      cachePromise.setCachePromise(cacheKey, servicePromise)

      return {
        servicePromise, // 返回上一个请求
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

        // 为什么其他页面数据也会更新呢？
        // 因为这里将设置数据的函数添加到了订阅列表中
        // 然而订阅列表又是全局的，当请求成功的时候，触发了订阅列表中的所有函数，这样就实现数据共享了
        unSubscribeRef.current = cacheSubscribe.subscribe(cacheKey, (d: any) => {
          fetchInstance.setState({
            data: d,
          })
        })
      }
    },
  }
}

export default useCachePlugin
