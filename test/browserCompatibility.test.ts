import { describe, expect, it, beforeEach, vi } from 'vitest'

describe('Browser environment compatibility', () => {
  beforeEach(() => {
    // 清理模块缓存以确保每次测试都是独立的
    vi.resetModules()
  })

  describe('transformCss environment handling', () => {
    it('should import transformCss without errors in Node.js environment', async () => {
      // 这个测试验证 transformCss 可以在 Node.js 环境中正常导入和使用
      const { transformCss } = await import('../src/transformCss')
      expect(transformCss).toBeDefined()
      expect(typeof transformCss).toBe('function')
    })

    it('should import transformCss without errors in browser environment', async () => {
      // 模拟浏览器环境
      const originalWindow = (global as any).window
      const originalProcess = (global as any).process

      try {
        // 设置浏览器环境
        ;(global as any).window = {}
        ;(global as any).process = { versions: {} } // 没有node版本信息

        // 重新导入模块以使环境检测生效
        const { transformCss } = await import('../src/transformCss')
        expect(transformCss).toBeDefined()
        expect(typeof transformCss).toBe('function')
      } finally {
        // 恢复环境
        ;(global as any).window = originalWindow
        ;(global as any).process = originalProcess
      }
    })
  })

  describe('compilerCss environment handling', () => {
    it('should import compilerCss without errors in Node.js environment', async () => {
      const { compilerCss } = await import('../src/compilerCss')
      expect(compilerCss).toBeDefined()
      expect(typeof compilerCss).toBe('function')
    })

    it('should import compilerCss without errors in browser environment', async () => {
      // 模拟浏览器环境
      const originalWindow = (global as any).window
      const originalProcess = (global as any).process

      try {
        // 设置浏览器环境
        ;(global as any).window = {}
        ;(global as any).process = { versions: {} } // 没有node版本信息

        // 重新导入模块以使环境检测生效
        const { compilerCss } = await import('../src/compilerCss')
        expect(compilerCss).toBeDefined()
        expect(typeof compilerCss).toBe('function')
      } finally {
        // 恢复环境
        ;(global as any).window = originalWindow
        ;(global as any).process = originalProcess
      }
    })
  })

  describe('isNodeEnvironment utility function', () => {
    it('should correctly detect Node.js environment', async () => {
      const { isNodeEnvironment } = await import('../src/utils')

      // 在测试环境中，应该检测为 Node.js 环境
      expect(typeof window).toBe('undefined')
      expect(typeof process).toBe('object')
      expect(process.versions?.node).toBeDefined()
      expect(isNodeEnvironment()).toBe(true)
    })

    it('should correctly detect browser environment in mocked scenario', async () => {
      const originalWindow = (global as any).window
      const originalProcess = (global as any).process

      try {
        // 模拟浏览器环境
        ;(global as any).window = {}
        ;(global as any).process = { versions: {} }

        // 重新导入模块以使环境检测生效
        const { isNodeEnvironment } = await import('../src/utils')

        // 检查环境检测逻辑
        expect(isNodeEnvironment()).toBe(false)
      } finally {
        // 恢复环境
        ;(global as any).window = originalWindow
        ;(global as any).process = originalProcess
      }
    })
  })

  describe('process.cwd() fallback handling', () => {
    it('should handle process.cwd() fallback in Node.js environment', () => {
      // 在 Node.js 环境中，process.cwd() 应该可以正常调用
      expect(() => process.cwd()).not.toThrow()
    })

    it('should handle process.cwd() fallback in browser environment', async () => {
      const originalWindow = (global as any).window
      const originalProcess = (global as any).process

      try {
        // 模拟浏览器环境
        ;(global as any).window = {}
        ;(global as any).process = { versions: {} }

        // 重新导入模块以使环境检测生效
        const { isNodeEnvironment } = await import('../src/utils')

        // 环境检测应该返回 false，因此不会调用 process.cwd()
        const testFilepath = undefined
        const filepath =
          testFilepath || (isNodeEnvironment() ? process.cwd() : '')

        expect(isNodeEnvironment()).toBe(false)
        expect(filepath).toBe('')
      } finally {
        // 恢复环境
        ;(global as any).window = originalWindow
        ;(global as any).process = originalProcess
      }
    })
  })
})
