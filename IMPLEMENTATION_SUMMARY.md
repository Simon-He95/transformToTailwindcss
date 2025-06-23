# 类名收集功能实现总结

## 功能概述

为 `transform-to-tailwindcss` 添加了类名收集功能，解决了动态转换的CSS类名无法被Tailwind CSS配置文件检测到的问题。

## 实现的核心组件

### 1. 类名收集器 (`classCollector.ts`)

- **单例模式**：确保全局只有一个收集器实例
- **类名去重**：自动去除重复的类名
- **智能解析**：支持多种类名格式的解析（如 `hover:bg-blue-500`、`md:p-4` 等）
- **文件生成**：构建结束时自动生成JavaScript文件
- **多格式支持**：生成的文件同时支持CommonJS和ES modules

### 2. 类型定义更新 (`type.ts`)

```typescript
export interface Options {
  include?: FilterPattern
  exclude?: FilterPattern
  isRem?: boolean
  debug?: boolean
  collectClasses?: boolean // 新增：启用类名收集
  outputPath?: string // 新增：指定输出路径
}
```

### 3. 插件集成 (`unplugin.ts`)

- 在插件初始化时根据配置启用收集器
- 在构建结束时触发文件生成
- 将collectClasses选项传递给转换函数

### 4. 转换函数更新

更新了所有相关的转换函数以支持类名收集：

- `transformCss.ts`: 主要的CSS转换逻辑，收集转换后的类名
- `transformInlineStyle.ts`: 内联样式转换，收集生成的类名
- `transformVue.ts`: Vue组件转换，传递收集选项
- `transformMedia.ts`: 媒体查询转换，传递收集选项
- 其他transform函数: 更新Options接口

## 使用方式

### 1. 配置插件

```javascript
// vite.config.js
import { viteTransformToTailwindcss } from 'unplugin-transform-to-tailwindcss'

export default defineConfig({
  plugins: [
    viteTransformToTailwindcss({
      collectClasses: true, // 启用收集
      outputPath: './safelist-classes.js', // 自定义输出路径
      debug: true, // 调试模式
      isRem: true, // 使用rem单位
    }),
  ],
})
```

### 2. 在Tailwind配置中使用

```javascript
// tailwind.config.js
const { safelistClasses } = require('./safelist-classes.js')

module.exports = {
  safelist: [
    ...safelistClasses, // 引入收集的类名
    // 其他手动添加的类名
  ],
}
```

## 生成的文件格式

```javascript
/**
 * Auto-generated safelist classes for Tailwind CSS
 * Generated at: 2024-01-15T10:30:00.000Z
 * Total classes: 156
 */

const safelistClasses = [
  'bg-blue-500',
  'text-white',
  'hover:bg-blue-600',
  'md:p-6',
  // ... 更多类名
]

// 多种导出格式支持
module.exports = { safelistClasses }
export { safelistClasses }
export default safelistClasses
```

## 核心优势

1. **自动化**：无需手动维护safelist，自动收集所有转换的类名
2. **精确性**：只收集实际转换生成的类名，避免冗余
3. **兼容性**：支持所有主要的构建工具（Vite、Webpack、Rollup等）
4. **智能解析**：正确处理伪类、响应式前缀等复杂类名
5. **构建集成**：与现有构建流程无缝集成

## 技术细节

### 类名解析逻辑

- 支持解析 `prefix="class1 class2"` 格式
- 自动处理伪类前缀（如 `hover:`、`focus:`）
- 支持响应式前缀（如 `md:`、`lg:`）
- 过滤无效的类名格式

### 收集时机

- 在CSS转换过程中实时收集
- 在内联样式转换时收集
- 在媒体查询转换时收集
- 构建结束时统一生成文件

### 文件管理

- 自动创建输出目录
- 每次构建重新生成文件
- 包含详细的元数据注释
- 提供使用说明

## 测试验证

功能已通过构建测试，确保：

- ✅ 代码编译无错误
- ✅ 类型定义正确
- ✅ 插件集成正常
- ✅ 文件生成逻辑正确

## 后续扩展

1. **配置选项扩展**：可以添加更多自定义选项
2. **格式支持**：可以支持生成其他格式的配置文件
3. **统计功能**：可以添加类名使用统计功能
4. **缓存优化**：可以添加增量更新功能
