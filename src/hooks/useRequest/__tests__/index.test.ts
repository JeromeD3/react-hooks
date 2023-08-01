import { act, renderHook, waitFor } from '@testing-library/react'
import useRequest from '../useRequest'
import { request } from '../utils/testingHelpers'

const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {}) //将 error替换成一个空函数

describe('useRequest', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  afterAll(() => {
    errorSpy.mockRestore() //  测试完成后将console.error还原
  })

  const setUp = (service, options) => renderHook((o) => useRequest(service, o || options))

  let hook
  /**
   * @vitest-environment jsdom
   */
  it('useRequest should auto run', async () => {
    let value, success
    const successCallback = (text) => {
      success = text
    }
    const errorCallback = vi.fn()
    const beforeCallback = () => {
      value = 'before'
    }
    const finallyCallback = () => {
      value = 'finally'
    }
    //auto run success
    // 初始化执行
    act(() => {
      hook = setUp(request, {
        onSuccess: successCallback,
        onError: errorCallback,
        onBefore: beforeCallback,
        onFinally: finallyCallback,
      })
    })
    expect(hook.result.current.loading).toBe(true)
    expect(value).toBe('before')
    expect(success).toBeUndefined()

    // 执行成功后
    act(() => {
      vi.runAllTimers() // 让所有的定时器立即执行
    })
    console.log("xxx",hook.result.current.loading)
    await waitFor(() => expect(hook.result.current.loading).toBe(false))
    expect(success).toBe('success')
    expect(hook.result.current.data).toBe('success')
    expect(value).toBe('finally')
    expect(errorCallback).toHaveBeenCalledTimes(0)

    // //manual run fail
    // act(() => {
    //   hook.result.current.run(0)
    // })
    // expect(hook.result.current.loading).toBe(true)

    // act(() => {
    //   vi.runAllTimers()
    // })
    // await waitFor(() => expect(hook.result.current.error).toEqual(new Error('fail')))
    // expect(hook.result.current.loading).toBe(false)
    // expect(errorCallback).toHaveBeenCalledTimes(1)

 
  })
})
