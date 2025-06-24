import { describe, it, expect, beforeEach } from 'vitest'
import { ClassCollector } from '../src/classCollector'

describe('ClassCollector Complex CSS Variables', () => {
  let collector: ClassCollector

  beforeEach(() => {
    collector = ClassCollector.getInstance()
    collector.clear()
    collector.enable()
  })

  it('should collect classes with CSS variables', () => {
    // 测试 CSS 变量类名
    collector.addClasses('bg-[var(--white,#fff)]', 'test-css-var')
    collector.addClasses('text-[var(--primary-color)]', 'test-css-var')
    collector.addClasses('border-[var(--border-width,1px)]', 'test-css-var')

    const collected = collector.getCollectedClasses()

    expect(collected).toContain('bg-[var(--white,#fff)]')
    expect(collected).toContain('text-[var(--primary-color)]')
    expect(collected).toContain('border-[var(--border-width,1px)]')
  })

  it('should collect classes with calc() functions', () => {
    collector.addClasses('w-[calc(100%-20px)]', 'test-calc')
    collector.addClasses('h-[calc(100vh-80px)]', 'test-calc')
    collector.addClasses('top-[calc(50%+10px)]', 'test-calc')

    const collected = collector.getCollectedClasses()

    expect(collected).toContain('w-[calc(100%-20px)]')
    expect(collected).toContain('h-[calc(100vh-80px)]')
    expect(collected).toContain('top-[calc(50%+10px)]')
  })

  it('should collect classes with complex arbitrary values', () => {
    collector.addClasses('bg-[rgba(255,255,255,0.5)]', 'test-rgba')
    collector.addClasses('shadow-[0_4px_6px_rgba(0,0,0,0.1)]', 'test-shadow')
    collector.addClasses(
      'grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
      'test-grid',
    )

    const collected = collector.getCollectedClasses()

    expect(collected).toContain('bg-[rgba(255,255,255,0.5)]')
    expect(collected).toContain('shadow-[0_4px_6px_rgba(0,0,0,0.1)]')
    expect(collected).toContain(
      'grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
    )
  })

  it('should collect classes from prefix format', () => {
    collector.addClasses(
      'class="bg-[var(--white,#fff)] text-red-500"',
      'test-prefix',
    )
    collector.addClasses(
      'hover="bg-[var(--hover-color)] opacity-80"',
      'test-prefix',
    )

    const collected = collector.getCollectedClasses()

    expect(collected).toContain('bg-[var(--white,#fff)]')
    expect(collected).toContain('text-red-500')
    expect(collected).toContain('hover:bg-[var(--hover-color)]')
    expect(collected).toContain('hover:opacity-80')
  })

  it('should handle mixed complex and simple classes', () => {
    const mixedClasses =
      'bg-red-500 w-[calc(100%-40px)] hover:bg-[var(--primary)] text-lg'
    collector.addClasses(mixedClasses, 'test-mixed')

    const collected = collector.getCollectedClasses()

    expect(collected).toContain('bg-red-500')
    expect(collected).toContain('w-[calc(100%-40px)]')
    expect(collected).toContain('hover:bg-[var(--primary)]')
    expect(collected).toContain('text-lg')
  })

  it('should handle nested brackets and complex expressions', () => {
    collector.addClasses('bg-[hsl(var(--hue),50%,50%)]', 'test-nested')
    collector.addClasses('w-[clamp(200px,50vw,600px)]', 'test-clamp')
    collector.addClasses(
      'transform-[translateX(calc(100%+10px))]',
      'test-transform',
    )

    const collected = collector.getCollectedClasses()

    expect(collected).toContain('bg-[hsl(var(--hue),50%,50%)]')
    expect(collected).toContain('w-[clamp(200px,50vw,600px)]')
    expect(collected).toContain('transform-[translateX(calc(100%+10px))]')
  })

  it('should correctly parse classes with spaces in arbitrary values', () => {
    const input = 'bg-[var(--white, #fff)] text-[var(--font-size, 1rem)] p-4'
    collector.addClasses(input, 'test-spaces')

    const collected = collector.getCollectedClasses()

    expect(collected).toContain('bg-[var(--white, #fff)]')
    expect(collected).toContain('text-[var(--font-size, 1rem)]')
    expect(collected).toContain('p-4')
  })

  it('should collect classes with multiple pseudo-classes and modifiers', () => {
    // 多个伪类组合
    collector.addClasses(
      'hover:focus:bg-[var(--white,#fff)]',
      'test-multiple-pseudo',
    )
    collector.addClasses(
      'hover:focus:active:text-[var(--primary)]',
      'test-multiple-pseudo',
    )
    collector.addClasses('hover:disabled:opacity-[0.5]', 'test-multiple-pseudo')

    // 响应式 + 伪类 + 任意值
    collector.addClasses(
      'md:hover:bg-[var(--secondary,#ccc)]',
      'test-responsive-pseudo',
    )
    collector.addClasses(
      'lg:focus:border-[var(--border-color,transparent)]',
      'test-responsive-pseudo',
    )
    collector.addClasses(
      'xl:active:shadow-[0_4px_12px_var(--shadow-color)]',
      'test-responsive-pseudo',
    )

    const collected = collector.getCollectedClasses()

    expect(collected).toContain('hover:focus:bg-[var(--white,#fff)]')
    expect(collected).toContain('hover:focus:active:text-[var(--primary)]')
    expect(collected).toContain('hover:disabled:opacity-[0.5]')
    expect(collected).toContain('md:hover:bg-[var(--secondary,#ccc)]')
    expect(collected).toContain(
      'lg:focus:border-[var(--border-color,transparent)]',
    )
    expect(collected).toContain(
      'xl:active:shadow-[0_4px_12px_var(--shadow-color)]',
    )
  })

  it('should collect classes with dark mode and state combinations', () => {
    // 暗色模式 + 伪类 + 任意值
    collector.addClasses(
      'dark:hover:bg-[var(--dark-bg,#1a1a1a)]',
      'test-dark-mode',
    )
    collector.addClasses(
      'dark:focus:text-[var(--dark-text,#fff)]',
      'test-dark-mode',
    )

    // 暗色模式 + 响应式 + 伪类
    collector.addClasses(
      'dark:md:hover:border-[var(--dark-border)]',
      'test-dark-responsive',
    )
    collector.addClasses(
      'dark:lg:focus:shadow-[0_0_0_2px_var(--focus-ring)]',
      'test-dark-responsive',
    )

    const collected = collector.getCollectedClasses()

    expect(collected).toContain('dark:hover:bg-[var(--dark-bg,#1a1a1a)]')
    expect(collected).toContain('dark:focus:text-[var(--dark-text,#fff)]')
    expect(collected).toContain('dark:md:hover:border-[var(--dark-border)]')
    expect(collected).toContain(
      'dark:lg:focus:shadow-[0_0_0_2px_var(--focus-ring)]',
    )
  })

  it('should collect classes with group and peer modifiers', () => {
    // group 修饰符 + 任意值
    collector.addClasses('group-hover:bg-[var(--group-hover-bg)]', 'test-group')
    collector.addClasses(
      'group-focus:text-[var(--group-focus-text,#333)]',
      'test-group',
    )
    collector.addClasses(
      'group-active:border-[var(--group-active-border,2px)]',
      'test-group',
    )

    // peer 修饰符 + 任意值
    collector.addClasses('peer-checked:bg-[var(--checked-bg)]', 'test-peer')
    collector.addClasses(
      'peer-invalid:text-[var(--error-color,red)]',
      'test-peer',
    )
    collector.addClasses(
      'peer-disabled:opacity-[var(--disabled-opacity,0.5)]',
      'test-peer',
    )

    const collected = collector.getCollectedClasses()

    expect(collected).toContain('group-hover:bg-[var(--group-hover-bg)]')
    expect(collected).toContain(
      'group-focus:text-[var(--group-focus-text,#333)]',
    )
    expect(collected).toContain(
      'group-active:border-[var(--group-active-border,2px)]',
    )
    expect(collected).toContain('peer-checked:bg-[var(--checked-bg)]')
    expect(collected).toContain('peer-invalid:text-[var(--error-color,red)]')
    expect(collected).toContain(
      'peer-disabled:opacity-[var(--disabled-opacity,0.5)]',
    )
  })

  it('should collect classes with complex mathematical expressions', () => {
    // 复杂的 calc 表达式
    collector.addClasses(
      'w-[calc(100vw-var(--sidebar-width,250px))]',
      'test-complex-calc',
    )
    collector.addClasses(
      'h-[calc(100vh-var(--header-height,60px)-var(--footer-height,40px))]',
      'test-complex-calc',
    )
    collector.addClasses(
      'top-[calc(50%-var(--offset,0px))]',
      'test-complex-calc',
    )

    // 嵌套函数
    collector.addClasses(
      'bg-[hsl(var(--hue,200),var(--saturation,50%),var(--lightness,50%))]',
      'test-nested-functions',
    )
    collector.addClasses(
      'shadow-[0_0_0_1px_rgba(var(--shadow-rgb,0,0,0),var(--shadow-alpha,0.1))]',
      'test-nested-functions',
    )

    // 复杂的 clamp 表达式
    collector.addClasses(
      'text-[clamp(var(--min-size,12px),var(--preferred-size,4vw),var(--max-size,24px))]',
      'test-clamp',
    )

    const collected = collector.getCollectedClasses()

    expect(collected).toContain('w-[calc(100vw-var(--sidebar-width,250px))]')
    expect(collected).toContain(
      'h-[calc(100vh-var(--header-height,60px)-var(--footer-height,40px))]',
    )
    expect(collected).toContain('top-[calc(50%-var(--offset,0px))]')
    expect(collected).toContain(
      'bg-[hsl(var(--hue,200),var(--saturation,50%),var(--lightness,50%))]',
    )
    expect(collected).toContain(
      'shadow-[0_0_0_1px_rgba(var(--shadow-rgb,0,0,0),var(--shadow-alpha,0.1))]',
    )
    expect(collected).toContain(
      'text-[clamp(var(--min-size,12px),var(--preferred-size,4vw),var(--max-size,24px))]',
    )
  })

  it('should collect classes with animation and transition values', () => {
    // 动画相关的任意值
    collector.addClasses(
      'animate-[spin_var(--duration,1s)_linear_infinite]',
      'test-animation',
    )
    collector.addClasses(
      'transition-[all_var(--transition-duration,300ms)_var(--transition-easing,ease)]',
      'test-transition',
    )
    collector.addClasses(
      'duration-[var(--hover-duration,200ms)]',
      'test-duration',
    )

    // transform 相关
    collector.addClasses(
      'transform-[translateX(var(--x,0))_translateY(var(--y,0))_scale(var(--scale,1))]',
      'test-transform',
    )
    collector.addClasses('rotate-[var(--rotation,0deg)]', 'test-rotate')

    const collected = collector.getCollectedClasses()

    expect(collected).toContain(
      'animate-[spin_var(--duration,1s)_linear_infinite]',
    )
    expect(collected).toContain(
      'transition-[all_var(--transition-duration,300ms)_var(--transition-easing,ease)]',
    )
    expect(collected).toContain('duration-[var(--hover-duration,200ms)]')
    expect(collected).toContain(
      'transform-[translateX(var(--x,0))_translateY(var(--y,0))_scale(var(--scale,1))]',
    )
    expect(collected).toContain('rotate-[var(--rotation,0deg)]')
  })

  it('should handle extremely complex nested scenarios', () => {
    // 超级复杂的场景：响应式 + 暗色模式 + 多伪类 + group + 任意值
    const superComplex =
      'md:dark:group-hover:focus:bg-[hsla(var(--hue,200),var(--sat,50%),var(--light,50%),var(--alpha,0.8))]'
    collector.addClasses(superComplex, 'test-super-complex')

    // 多个修饰符 + 复杂 calc
    const complexCalc =
      'lg:hover:focus:w-[calc(100%-var(--margin,20px)*2-var(--padding,10px)*2)]'
    collector.addClasses(complexCalc, 'test-complex-calc')

    // 混合多种函数和变量
    const mixedFunctions =
      'xl:peer-checked:bg-[linear-gradient(var(--angle,45deg),var(--start,#ff0000),var(--end,#0000ff))]'
    collector.addClasses(mixedFunctions, 'test-mixed-functions')

    const collected = collector.getCollectedClasses()

    expect(collected).toContain(superComplex)
    expect(collected).toContain(complexCalc)
    expect(collected).toContain(mixedFunctions)
  })

  it('should collect classes from complex prefix format with multiple modifiers', () => {
    // 复杂的前缀格式
    collector.addClasses(
      'hover="bg-[var(--hover-bg)] focus:text-[var(--hover-text)]"',
      'test-complex-prefix',
    )
    collector.addClasses(
      'data-state="open:bg-[var(--open-bg)] closed:bg-[var(--closed-bg)]"',
      'test-data-state',
    )

    // 响应式前缀
    collector.addClasses(
      'md="hover:bg-[var(--md-hover)] focus:border-[var(--md-focus)]"',
      'test-responsive-prefix',
    )

    const collected = collector.getCollectedClasses()

    expect(collected).toContain('hover:bg-[var(--hover-bg)]')
    expect(collected).toContain('hover:focus:text-[var(--hover-text)]')
    expect(collected).toContain('data-state:open:bg-[var(--open-bg)]')
    expect(collected).toContain('data-state:closed:bg-[var(--closed-bg)]')
    expect(collected).toContain('md:hover:bg-[var(--md-hover)]')
    expect(collected).toContain('md:focus:border-[var(--md-focus)]')
  })

  it('should handle edge cases with special characters and escaping', () => {
    // 包含特殊字符的 CSS 变量 (反斜杠转义在 Tailwind 中通常不需要)
    collector.addClasses('bg-[var(--my-color-primary,#000)]', 'test-escaped')

    // URL 和路径
    collector.addClasses(
      'bg-[url(var(--image-url,"/default.jpg"))]',
      'test-url',
    )
    collector.addClasses('mask-[url(var(--mask-url,"#mask"))]', 'test-mask')

    // 复杂的字符串值
    collector.addClasses(
      'content-[var(--content,"Hello, World!")]',
      'test-content',
    )

    // 包含引号的复杂值
    collector.addClasses(
      'bg-[var(--gradient,"linear-gradient(45deg, red, blue)")]',
      'test-quotes',
    )

    const collected = collector.getCollectedClasses()

    expect(collected).toContain('bg-[var(--my-color-primary,#000)]')
    expect(collected).toContain('bg-[url(var(--image-url,"/default.jpg"))]')
    expect(collected).toContain('mask-[url(var(--mask-url,"#mask"))]')
    expect(collected).toContain('content-[var(--content,"Hello, World!")]')
    expect(collected).toContain(
      'bg-[var(--gradient,"linear-gradient(45deg, red, blue)")]',
    )
  })

  it('should reject invalid class names', () => {
    collector.addClasses('invalid-class-[', 'test-invalid')
    collector.addClasses('another-invalid]', 'test-invalid')
    collector.addClasses('valid-class bg-red-500', 'test-mixed-invalid')

    const collected = collector.getCollectedClasses()

    // 应该只包含有效的类名
    expect(collected).toContain('valid-class')
    expect(collected).toContain('bg-red-500')
    expect(collected).not.toContain('invalid-class-[')
    expect(collected).not.toContain('another-invalid]')
  })
})
