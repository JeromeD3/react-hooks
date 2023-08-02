import { renderHook, act } from '@testing-library/react'
import useRafState from '../index'

describe('useRafState', () => {
  /**
   * @vitest-environment jsdom
   */
  it('should work', () => {
    const mockRaf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      // 传递上一次的时间戳
      cb(0)
      return 0
    })
    const { result } = renderHook(() => useRafState(0))
    const setRafState = result.current[1]
    expect(result.current[0]).toBe(0)

    act(() => {
      setRafState(1)
    })
    expect(result.current[0]).toBe(1)
    mockRaf.mockRestore()
  })
})
