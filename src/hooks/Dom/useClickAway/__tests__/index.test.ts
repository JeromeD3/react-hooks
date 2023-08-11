import { renderHook } from '@testing-library/react'
import useClickAway from '..'

describe('useClickAway', () => {
  let container: HTMLDivElement
  let container1: HTMLDivElement

  beforeEach(() => {
    // 创建两个div
    container = document.createElement('div')
    container1 = document.createElement('div')
    // 插入到body中
    document.body.appendChild(container)
    document.body.appendChild(container1)
  })
  afterEach(() => {
    // 移除
    document.body.removeChild(container)
    document.body.removeChild(container1)
  })
  /**
   * @vitest-environment jsdom
   */
  it('dom测试可选', () => {
    let state: number = 0
    const { rerender, unmount } = renderHook((dom: any) =>
      useClickAway(() => {
        state++
      }, dom)
    )
    rerender(container);
    container.click();
    expect(state).toBe(0);
    document.body.click();
    expect(state).toBe(1);

    rerender(container1);
    container1.click();
    expect(state).toBe(1);
    document.body.click();
    expect(state).toBe(2);

    unmount();
    document.body.click();
    expect(state).toBe(2);
  })
})
