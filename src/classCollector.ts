import path from 'node:path'
import { isNodeEnvironment } from './utils'

// 动态导入 fs，在浏览器环境中避免导入错误
let fs: typeof import('node:fs').promises | null = null

// 只在 Node.js 环境中导入 fs
if (isNodeEnvironment()) {
  try {
    // eslint-disable-next-line ts/no-require-imports
    fs = require('node:fs').promises
  }
  catch {
    // 静默失败，在某些环境中可能无法导入
  }
}

/**
 * 类名收集器 - 用于收集所有转换生成的 Tailwind CSS 类名
 */
export class ClassCollector {
  private static instance: ClassCollector
  private collectedClasses = new Set<string>()
  private outputPath: string
  private isEnabled = false
  private lastGeneratedClasses: string[] = []
  private isGenerating = false
  private buildEndCallCount = 0
  private skipIfNoChanges = true // 新增：默认跳过无变化的生成

  private constructor() {
    this.outputPath = './safelist-classes.js'
  }

  static getInstance(): ClassCollector {
    if (!ClassCollector.instance) {
      ClassCollector.instance = new ClassCollector()
    }
    return ClassCollector.instance
  }

  /**
   * 启用类名收集功能
   */
  enable(outputPath?: string, skipIfNoChanges?: boolean): void {
    this.isEnabled = true
    if (outputPath) {
      this.outputPath = outputPath
    }
    if (skipIfNoChanges !== undefined) {
      this.skipIfNoChanges = skipIfNoChanges
    }
    // 重置状态
    this.buildEndCallCount = 0
    this.lastGeneratedClasses = []
  }

  /**
   * 禁用类名收集功能
   */
  disable(): void {
    this.isEnabled = false
    this.buildEndCallCount = 0
    this.lastGeneratedClasses = []
  }

  /**
   * 添加转换后的类名
   */
  addClasses(classes: string | string[], source?: string): void {
    if (!this.isEnabled)
      return

    const classArray = Array.isArray(classes) ? classes : [classes]

    classArray.forEach((cls) => {
      // 清理类名并添加到集合中
      const cleanClasses = this.extractClasses(cls)
      cleanClasses.forEach(c => this.collectedClasses.add(c))
    })
  }

  /**
   * 从字符串中提取类名
   */
  private extractClasses(input: string): string[] {
    if (!input)
      return []

    // 处理 prefix="class1 class2" 格式
    const prefixMatch = input.match(/(\w+(?:-\w+)*):?="([^"]+)"/g)
    if (prefixMatch) {
      const classes: string[] = []
      prefixMatch.forEach((match) => {
        const [, prefix, classStr]
          = match.match(/(\w+(?:-\w+)*):?="([^"]+)"/) || []
        if (classStr) {
          const classNames = this.parseComplexClassString(classStr)
          classNames.forEach((cls) => {
            if (prefix && prefix !== 'class') {
              classes.push(`${prefix}:${cls}`)
            }
            else {
              classes.push(cls)
            }
          })
        }
      })
      return classes
    }

    // 处理普通的类名字符串
    return this.parseComplexClassString(input)
  }

  /**
   * 解析复杂的类名字符串，支持方括号内的复杂内容
   */
  private parseComplexClassString(input: string): string[] {
    if (!input)
      return []

    const classes: string[] = []
    let current = ''
    let bracketDepth = 0
    let inBrackets = false

    for (let i = 0; i < input.length; i++) {
      const char = input[i]

      if (char === '[') {
        bracketDepth++
        inBrackets = true
        current += char
      }
      else if (char === ']') {
        bracketDepth--
        current += char
        if (bracketDepth === 0) {
          inBrackets = false
        }
      }
      else if (char === ' ' && !inBrackets) {
        // 只有在不在方括号内时才分割
        if (current.trim()) {
          const trimmed = current.trim()
          if (this.isValidTailwindClass(trimmed)) {
            classes.push(trimmed)
          }
        }
        current = ''
      }
      else {
        current += char
      }
    }

    // 处理最后一个类名
    if (current.trim()) {
      const trimmed = current.trim()
      if (this.isValidTailwindClass(trimmed)) {
        classes.push(trimmed)
      }
    }

    return classes
  }

  /**
   * 验证是否是有效的 Tailwind CSS 类名
   */
  private isValidTailwindClass(cls: string): boolean {
    if (!cls)
      return false

    // 支持复杂的 Tailwind 类名，包括：
    // - 普通类名: bg-red-500, text-lg
    // - 带伪类: hover:bg-red-500, focus:text-blue-600
    // - 多重伪类: hover:focus:bg-red-500, md:hover:focus:bg-blue-600
    // - 响应式: md:bg-red-500, lg:hover:text-blue-600
    // - 暗色模式: dark:bg-gray-800, dark:hover:bg-gray-700
    // - group/peer: group-hover:bg-red-500, peer-checked:text-green-500
    // - data 属性: data-state:open:bg-red-500
    // - 带方括号的任意值: bg-[#ff0000], w-[calc(100%-20px)], bg-[var(--white,#fff)]
    // - 复杂任意值: bg-[hsl(var(--hue),50%,50%)], transform-[translateX(var(--x))]
    // - 特殊字符: bg-[var(--my-color\:primary,#000)], content-[var(--text,"Hello")]

    // 匹配修饰符部分 (可选，可以有多个，用冒号分隔)
    const modifierPattern = '(?:[\\w-]+(?:\\[[^\\]]*\\])?:)*'

    // 匹配基础类名部分
    const baseClassPattern = '[\\w-]+'

    // 匹配任意值部分 (可选，支持各种复杂内容)
    const arbitraryValuePattern = '(?:\\[[^\\]]*\\])?'

    // 完整的类名正则
    const tailwindClassRegex = new RegExp(
      `^${modifierPattern}${baseClassPattern}${arbitraryValuePattern}$`,
    )

    return tailwindClassRegex.test(cls)
  }

  /**
   * 获取所有收集的类名
   */
  getCollectedClasses(): string[] {
    return Array.from(this.collectedClasses).sort()
  }

  /**
   * 清空收集的类名
   */
  clear(): void {
    this.collectedClasses.clear()
    this.lastGeneratedClasses = []
  }

  /**
   * 检查类名是否发生变化
   */
  private hasClassesChanged(): boolean {
    const currentClasses = this.getCollectedClasses()

    // 比较数组长度
    if (currentClasses.length !== this.lastGeneratedClasses.length) {
      return true
    }

    // 比较每个元素
    for (let i = 0; i < currentClasses.length; i++) {
      if (currentClasses[i] !== this.lastGeneratedClasses[i]) {
        return true
      }
    }

    return false
  }

  /**
   * 检查输出文件是否存在
   */
  private async fileExists(): Promise<boolean> {
    if (!fs || !isNodeEnvironment()) {
      console.warn(
        '[transform-to-tailwindcss] File operations not available in browser environment',
      )
      return false
    }

    try {
      await fs.access(this.outputPath)
      return true
    }
    catch {
      return false
    }
  }

  /**
   * 生成safelist文件
   */
  async generateSafelistFile(): Promise<void> {
    if (!this.isEnabled || this.collectedClasses.size === 0) {
      return
    }

    // 检查是否在支持文件操作的环境中
    if (!fs || !isNodeEnvironment()) {
      console.warn(
        '[transform-to-tailwindcss] File operations not available in browser environment. Safelist generation skipped.',
      )
      console.log(
        `[transform-to-tailwindcss] Collected ${this.collectedClasses.size} unique classes:`,
      )
      console.log(this.getCollectedClasses().join(', '))
      return
    }

    // 防止重复生成
    if (this.isGenerating) {
      console.log(
        '[transform-to-tailwindcss] Safelist generation already in progress, skipping...',
      )
      return
    }

    // 检查是否有变化（只有在启用skipIfNoChanges时才检查）
    if (
      this.skipIfNoChanges
      && !this.hasClassesChanged()
      && (await this.fileExists())
    ) {
      console.log(
        '[transform-to-tailwindcss] No changes in collected classes, skipping generation...',
      )
      return
    }

    this.isGenerating = true

    try {
      const classes = this.getCollectedClasses()
      const content = this.generateFileContent(classes)

      // 确保输出目录存在
      const dir = path.dirname(this.outputPath)
      await fs.mkdir(dir, { recursive: true })

      // 写入文件
      await fs.writeFile(this.outputPath, content, 'utf-8')

      // 更新最后生成的类名记录
      this.lastGeneratedClasses = [...classes]

      console.log(
        `[transform-to-tailwindcss] Generated safelist file: ${this.outputPath}`,
      )
      console.log(
        `[transform-to-tailwindcss] Collected ${classes.length} unique classes`,
      )
    }
    catch (error) {
      console.error(
        '[transform-to-tailwindcss] Failed to generate safelist file:',
        error,
      )
    }
    finally {
      this.isGenerating = false
    }
  }

  /**
   * 生成文件内容
   */
  private generateFileContent(classes: string[]): string {
    const timestamp = new Date().toISOString()

    return `/**
 * Auto-generated safelist classes for Tailwind CSS
 * Generated at: ${timestamp}
 * Total classes: ${classes.length}
 * Skip if no changes: ${this.skipIfNoChanges}
 * 
 * ⚠️  WARNING: This file is auto-generated. Do not edit manually!
 * ⚠️  To prevent infinite build loops, avoid importing this file in any source files
 *     that are processed by transform-to-tailwindcss during the build process.
 * 
 * Usage in tailwind.config.js:
 * const { safelistClasses } = require('./safelist-classes.js')
 * 
 * module.exports = {
 *   // ... your other config
 *   safelist: [
 *     ...safelistClasses,
 *     // ... your other safelist items
 *   ]
 * }
 */

// All collected classes from transform-to-tailwindcss
const safelistClasses = ${JSON.stringify(classes, null, 2)}

// Export for CommonJS
module.exports = {
  safelistClasses
}

// Export for ES modules  
module.exports.safelistClasses = safelistClasses

// Named export for ES modules
export { safelistClasses }

// Default export for ES modules
export default safelistClasses
`
  }

  /**
   * 添加构建完成的钩子
   */
  onBuildEnd(): void {
    if (!this.isEnabled) {
      return
    }

    // 防止多次调用（某些构建工具可能会多次触发buildEnd）
    this.buildEndCallCount++
    if (this.buildEndCallCount > 1) {
      console.log(
        `[transform-to-tailwindcss] Build end called ${this.buildEndCallCount} times, skipping duplicate call...`,
      )
      return
    }

    // 延迟生成文件，确保所有转换都完成
    setTimeout(() => {
      this.generateSafelistFile()
    }, 100)
  }

  /**
   * 重置构建状态 - 在新的构建开始时调用
   */
  resetBuildState(): void {
    this.buildEndCallCount = 0
    this.isGenerating = false
  }
}

// 导出单例实例
export const classCollector = ClassCollector.getInstance()
