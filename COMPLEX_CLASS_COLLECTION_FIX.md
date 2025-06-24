# ClassCollector 复杂 CSS 类名收集修复

## 问题描述

用户发现 `classCollector` 没有完全收集从 Vue scoped CSS 转换的复杂属性，特别是：

- `background: var(--white, #fff)` 转换成 `bg-[var(--white,#fff)]` 但没有被加入 safelist

## 根本原因分析

经过代码分析，发现问题出现在 `classCollector.ts` 中的 `extractClasses` 方法：

### 原有问题：

1. **正则表达式过于严格**：原正则 `/^[\w-]+(:[\w-]+)*(\[[\w\-%.#]+\])?$/` 不支持：

   - 逗号 `,` （CSS 变量默认值分隔符）
   - 括号 `()` （CSS 函数如 `calc()`, `var()`, `rgba()` 等）
   - 空格 ` ` （某些 CSS 值中的空格）
   - 其他复杂字符（如 `*`, `+`, `/` 等）

2. **简单字符串分割**：使用 `split(/\s+/)` 分割类名，但这会错误地分割方括号内包含空格的任意值

## 解决方案

### 1. 智能类名解析算法

实现了新的 `parseComplexClassString` 方法：

- **括号感知分割**：跟踪方括号的嵌套层级，只在方括号外部分割空格
- **状态机解析**：逐字符解析，正确处理嵌套括号和复杂表达式
- **验证机制**：每个提取的类名都经过严格验证

### 2. 增强的类名验证正则表达式

更新了类名验证正则表达式以支持复杂的 Tailwind 修饰符和任意值：

```typescript
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
```

### 3. 支持的复杂类名类型

#### CSS 变量：

- `bg-[var(--white,#fff)]`
- `text-[var(--primary-color)]`
- `border-[var(--border-width,1px)]`

#### CSS 函数：

- `w-[calc(100%-20px)]`
- `h-[calc(100vh-80px)]`
- `bg-[rgba(255,255,255,0.5)]`
- `shadow-[0_4px_6px_rgba(0,0,0,0.1)]`

#### 多重伪类和修饰符：

- `hover:focus:bg-[var(--white,#fff)]` ✅
- `hover:focus:active:text-[var(--primary)]` ✅
- `hover:disabled:opacity-[0.5]` ✅

#### 响应式 + 伪类 + 任意值：

- `md:hover:bg-[var(--secondary,#ccc)]` ✅
- `lg:focus:border-[var(--border-color,transparent)]` ✅
- `xl:active:shadow-[0_4px_12px_var(--shadow-color)]` ✅

#### 暗色模式组合：

- `dark:hover:bg-[var(--dark-bg,#1a1a1a)]` ✅
- `dark:md:hover:border-[var(--dark-border)]` ✅
- `dark:lg:focus:shadow-[0_0_0_2px_var(--focus-ring)]` ✅

#### Group 和 Peer 修饰符：

- `group-hover:bg-[var(--group-hover-bg)]` ✅
- `peer-checked:bg-[var(--checked-bg)]` ✅
- `peer-invalid:text-[var(--error-color,red)]` ✅

#### 复杂数学表达式：

- `w-[calc(100vw-var(--sidebar-width,250px))]` ✅
- `h-[calc(100vh-var(--header-height,60px)-var(--footer-height,40px))]` ✅
- `bg-[hsl(var(--hue,200),var(--saturation,50%),var(--lightness,50%))]` ✅

#### 动画和过渡：

- `animate-[spin_var(--duration,1s)_linear_infinite]` ✅
- `transition-[all_var(--transition-duration,300ms)_var(--transition-easing,ease)]` ✅
- `transform-[translateX(var(--x,0))_translateY(var(--y,0))_scale(var(--scale,1))]` ✅

#### 超级复杂场景：

- `md:dark:group-hover:focus:bg-[hsla(var(--hue,200),var(--sat,50%),var(--light,50%),var(--alpha,0.8))]` ✅
- `lg:hover:focus:w-[calc(100%-var(--margin,20px)*2-var(--padding,10px)*2)]` ✅
- `xl:peer-checked:bg-[linear-gradient(var(--angle,45deg),var(--start,#ff0000),var(--end,#0000ff))]` ✅

#### 特殊字符和 URL：

- `bg-[url(var(--image-url,"/default.jpg"))]` ✅
- `mask-[url(var(--mask-url,"#mask"))]` ✅
- `content-[var(--content,"Hello, World!")]` ✅

## 代码变更

### 修改的文件：

1. **`src/classCollector.ts`**：

   - 重构 `extractClasses` 方法
   - 添加 `parseComplexClassString` 智能解析器
   - 添加 `isValidTailwindClass` 验证器
   - 增强正则表达式支持复杂修饰符组合

2. **`test/classCollectorComplex.test.ts`**：
   - 添加全面的复杂类名测试用例（16个测试场景)
   - 覆盖 CSS 变量、函数、嵌套表达式、多重修饰符等场景

### 测试覆盖率：

- ✅ CSS 变量类名收集
- ✅ calc() 函数类名收集
- ✅ 复杂任意值类名收集
- ✅ 前缀格式类名收集
- ✅ 混合简单和复杂类名
- ✅ 嵌套括号和复杂表达式
- ✅ 带空格的任意值解析
- ✅ 多重伪类和修饰符组合
- ✅ 暗色模式和状态组合
- ✅ Group 和 Peer 修饰符
- ✅ 复杂数学表达式
- ✅ 动画和过渡值
- ✅ 超级复杂嵌套场景
- ✅ 复杂前缀格式处理
- ✅ 特殊字符和边缘情况
- ✅ 无效类名过滤

## 向后兼容性

✅ **完全向后兼容**：所有现有功能保持不变，只是增强了对复杂类名的支持。

## 性能影响

- **解析性能**：新算法的时间复杂度仍为 O(n)，性能开销最小
- **内存使用**：无显著增加
- **测试验证**：所有现有测试（69个）通过，无回归问题

## 使用示例

修复后，classCollector 现在可以正确收集以下类型的类名：

```css
/* Vue Scoped CSS */
.my-component {
  background: var(--white, #fff); /* → bg-[var(--white,#fff)] ✅ */
  width: calc(100% - 40px); /* → w-[calc(100%-40px)] ✅ */
  color: rgba(255, 0, 0, 0.5); /* → text-[rgba(255,0,0,0.5)] ✅ */
}

.my-component:hover:focus {
  background: var(
    --primary,
    #007bff
  ); /* → hover:focus:bg-[var(--primary,#007bff)] ✅ */
}

@media (min-width: 768px) {
  .my-component:hover {
    background: var(
      --secondary,
      #6c757d
    ); /* → md:hover:bg-[var(--secondary,#6c757d)] ✅ */
  }
}
```

这些生成的类名现在都会被正确收集到 safelist 中，彻底解决了用户报告的问题。

## 测试结果

```bash
✓ test/classCollectorComplex.test.ts (16 tests) 6ms
✓ All existing tests pass (69 tests total)
```

所有测试通过，证明修复有效且无回归问题。
