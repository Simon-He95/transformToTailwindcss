import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest'
import { classCollector } from '../src/classCollector'

describe('classCollector', () => {
  beforeEach(() => {
    classCollector.clear()
    classCollector.disable()
  })

  afterEach(() => {
    classCollector.disable()
    classCollector.clear()
  })

  describe('basic functionality', () => {
    it('should collect simple classes', () => {
      classCollector.enable()

      classCollector.addClasses('p-4 bg-red-500')
      classCollector.addClasses(['text-white', 'font-bold'])

      const collected = classCollector.getCollectedClasses()
      expect(collected).toContain('p-4')
      expect(collected).toContain('bg-red-500')
      expect(collected).toContain('text-white')
      expect(collected).toContain('font-bold')
    })

    it('should extract classes from prefix format', () => {
      classCollector.enable()

      classCollector.addClasses('hover="bg-blue-500 text-white"')
      classCollector.addClasses('focus:="p-2 m-4"')

      const collected = classCollector.getCollectedClasses()
      expect(collected).toContain('hover:bg-blue-500')
      expect(collected).toContain('hover:text-white')
      expect(collected).toContain('focus:p-2')
      expect(collected).toContain('focus:m-4')
    })

    it('should handle class attribute format', () => {
      classCollector.enable()

      classCollector.addClasses('class="p-4 bg-red-500"')

      const collected = classCollector.getCollectedClasses()
      expect(collected).toContain('p-4')
      expect(collected).toContain('bg-red-500')
    })

    it('should filter invalid class names', () => {
      classCollector.enable()

      classCollector.addClasses('valid-class invalid@class another-valid')

      const collected = classCollector.getCollectedClasses()
      expect(collected).toContain('valid-class')
      expect(collected).toContain('another-valid')
      expect(collected).not.toContain('invalid@class')
    })

    it('should not collect when disabled', () => {
      classCollector.addClasses('p-4 bg-red-500')

      const collected = classCollector.getCollectedClasses()
      expect(collected).toHaveLength(0)
    })

    it('should clear collected classes', () => {
      classCollector.enable()
      classCollector.addClasses('p-4 bg-red-500')

      expect(classCollector.getCollectedClasses().length).toBeGreaterThan(0)

      classCollector.clear()
      expect(classCollector.getCollectedClasses()).toHaveLength(0)
    })
  })

  describe('browser environment safety', () => {
    it('should not crash when file operations are unavailable', () => {
      classCollector.enable()
      classCollector.addClasses('p-4 bg-red-500')

      // 基本功能应该正常工作
      const collected = classCollector.getCollectedClasses()
      expect(collected).toContain('p-4')
      expect(collected).toContain('bg-red-500')

      // generateSafelistFile 不应该抛出错误（即使在浏览器环境中）
      expect(() => classCollector.generateSafelistFile()).not.toThrow()
    })
  })

  describe('edge cases', () => {
    it('should handle empty input', () => {
      classCollector.enable()

      classCollector.addClasses('')
      classCollector.addClasses([])

      const collected = classCollector.getCollectedClasses()
      expect(collected).toHaveLength(0)
    })

    it('should handle complex class names with brackets', () => {
      classCollector.enable()

      classCollector.addClasses('bg-[#ff0000] w-[100px] text-[14px]')

      const collected = classCollector.getCollectedClasses()
      expect(collected).toContain('bg-[#ff0000]')
      expect(collected).toContain('w-[100px]')
      expect(collected).toContain('text-[14px]')
    })

    it('should deduplicate classes', () => {
      classCollector.enable()

      classCollector.addClasses('p-4 bg-red-500')
      classCollector.addClasses('p-4 text-white') // p-4 duplicated

      const collected = classCollector.getCollectedClasses()
      const p4Count = collected.filter((cls) => cls === 'p-4').length
      expect(p4Count).toBe(1)
    })

    it('should sort classes alphabetically', () => {
      classCollector.enable()

      classCollector.addClasses('z-10 a-class bg-red-500 p-4')

      const collected = classCollector.getCollectedClasses()
      expect(collected).toEqual([...collected].sort())
    })
  })
})
