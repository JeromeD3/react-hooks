import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 50000, // 设置全局的超时时间为10000毫秒
  },
})
