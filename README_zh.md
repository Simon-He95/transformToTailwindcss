<div align="center">

# 🎨 Transform to TailwindCSS

<img height="200" src="./assets/kv.png" alt="to tailwindcss">

[![npm version](https://badge.fury.io/js/transform-to-tailwindcss.svg)](https://badge.fury.io/js/transform-to-tailwindcss)
[![Downloads](https://img.shields.io/npm/dm/transform-to-tailwindcss.svg)](https://www.npmjs.com/package/transform-to-tailwindcss)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/Simon-He95/transformToTailwindcss.svg?style=social&label=Star)](https://github.com/Simon-He95/transformToTailwindcss)

**🚀 轻松将传统 CSS 迁移到 TailwindCSS**

_自动将现有 CSS 样式转换为实用优先的 TailwindCSS 类_

[English](./README.md) | [简体中文](./README_zh.md)

</div>

---

## ✨ 为什么选择 Transform to TailwindCSS？

🎯 **性能优先** - 通过利用 TailwindCSS 的实用类减少打包体积
🔄 **遗留迁移** - 无缝将老项目升级到现代化的 TailwindCSS
⚡ **开发体验** - 保持设计系统的一致性
🛠️ **框架无关** - 支持 Vue、React、Svelte、Astro 和原生 HTML
📝 **自动 Safelist** - 🆕 自动收集生成的类名，永不丢失
🔐 **循环保护** - 🆕 智能防护，避免无限构建循环
🚀 **构建优化** - 🆕 智能跳过，仅在变化时重新生成

> 想要使用 UnoCSS？试试 [transformToUnocss](https://github.com/Simon-He95/transformToUnocss)！

## � 快速开始

### 全局安装

```bash
npm install -g transform-to-tailwindcss
# 或
yarn global add transform-to-tailwindcss
# 或
pnpm add -g transform-to-tailwindcss
```

### CLI 使用

```bash
# 转换目录
totailwindcss playground

# 撤销更改
totailwindcss playground --revert
```

### 🆕 快速示例：自动 Safelist 生成

仅需 3 步即可转换 CSS 并自动为 TailwindCSS 生成 safelist：

```ts
// 1. 配置构建工具
// vite.config.ts
export default defineConfig({
  plugins: [
    viteTransformToTailwindcss({
      collectClasses: true, // 🆕 启用自动收集
      outputPath: './safelist-classes.js',
    }),
  ],
})
```

```ts
// 2. 在 TailwindCSS 配置中使用
// tailwind.config.js
const { safelistClasses } = require('./safelist-classes.js')

module.exports = {
  safelist: [...safelistClasses], // 🎯 再也不丢失类名！
  // ... 其他配置
}
```

```vue
<!-- 3. 正常编写组件 -->
<template>
  <div class="card">
    <h1 class="title">
      你好世界
    </h1>
  </div>
</template>

<style scoped>
.card {
  padding: 20px;
  background: #f3f4f6;
}
.title {
  font-size: 24px;
  color: #1f2937;
}
</style>

<!-- ✨ 自动生成: ["p-5", "bg-gray-100", "text-2xl", "text-gray-800"] -->
```

## 🌈 Usage

<details>
<summary>Vite</summary>

```ts
// vite.config.ts
import { vitePluginTransformTotailwindcss } from 'transform-to-tailwindcss'

export default defineConfig({
  plugins: [vitePluginTransformTotailwindcss(/* options */)],
})
```

</details>
<br>
<details>
<summary>Rollup</summary>

```ts
// rollup.config.js
import { resolve } from 'node:path'
import { rollupTransformTotailwindcss } from 'transform-to-tailwindcss'

export default {
  plugins: [rollupTransformTotailwindcss(/* options */)],
}
```

</details>
<br>
<details>
<summary>Webpack</summary>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('transform-to-tailwindcss').webpackTransformTotailwindcss({
      /* options */
    }),
  ],
}
```

</details>
<br>
<details>
<summary>Vue CLI</summary>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('transform-to-tailwindcss').webpackTransformTotailwindcss({
        /* options */
      }),
    ],
  },
}
```

</details>
<br>
<details>
<summary>Esbuild</summary>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import { esbuildTransformTotailwindcss } from 'transform-to-tailwindcss'

build({
  plugins: [esbuildTransformTotailwindcss(/* options */)],
})
```

</details>

## 🔧 选项配置

<div align="center">

| 选项                 | 类型            | 默认值                    | 描述                          |
| -------------------- | --------------- | ------------------------- | ----------------------------- |
| 🐛 `debug`           | `boolean`       | `false`                   | 启用详细的转换日志            |
| 📐 `isRem`           | `boolean`       | `false`                   | 将 px 单位转换为 rem          |
| 🎯 `include`         | `FilterPattern` | -                         | 要处理的文件                  |
| 🚫 `exclude`         | `FilterPattern` | -                         | 要忽略的文件                  |
| 📝 `collectClasses`  | `boolean`       | `false`                   | **新功能** 自动收集生成的类名 |
| 📂 `outputPath`      | `string`        | `'./safelist-classes.js'` | **新功能** 收集类名的输出路径 |
| ⚡ `skipIfNoChanges` | `boolean`       | `true`                    | **新功能** 无变化时跳过生成   |

</div>

### 🆕 类名收集功能

> 🎯 **新功能**：自动收集所有生成的 TailwindCSS 类名，用于 `safelist` 配置！

当使用动态 CSS 转换时，TailwindCSS 在清除阶段可能无法检测到生成的类名。类名收集功能通过自动生成包含所有转换类名的 safelist 文件来解决这个问题。

<details>
<summary><strong>📝 自动生成 Safelist - 再也不丢失类名</strong></summary>

```ts
// vite.config.js
import { viteTransformToTailwindcss } from 'transform-to-tailwindcss'

export default defineConfig({
  plugins: [
    viteTransformToTailwindcss({
      collectClasses: true, // ✅ 启用类名收集
      outputPath: './config/safelist-classes.js', // 📂 自定义输出路径
      skipIfNoChanges: true, // ⚡ 性能优化
      exclude: [
        'config/**/*', // 🚫 排除配置目录
        'safelist-classes.js', // 🚫 排除生成的文件
        'tailwind.config.js', // 🚫 排除 Tailwind 配置
      ],
    }),
  ],
})
```

```ts
// tailwind.config.js
const { safelistClasses } = require('./config/safelist-classes.js')

module.exports = {
  content: ['./src/**/*.{html,js,vue,ts,tsx}'],
  safelist: [
    ...safelistClasses, // 🎯 自动生成的类名
    // 您的其他 safelist 项目...
  ],
}
```

**生成的文件 (`safelist-classes.js`)：**

```js
/**
 * Auto-generated safelist classes for Tailwind CSS
 * Generated at: 2024-01-15T10:30:00.000Z
 * Total classes: 156
 * Skip if no changes: true
 */

const safelistClasses = [
  'bg-blue-500',
  'text-white',
  'hover:bg-blue-600',
  'md:p-6',
  // ... 更多类名
]

module.exports = { safelistClasses }
export { safelistClasses }
```

**主要优势：**

- 🔄 **循环依赖保护**：智能检测防止无限构建循环
- ⚡ **性能优化**：只在类名实际变化时重新生成
- 🛡️ **构建安全**：多重保护防止重复生成
- 📊 **全面覆盖**：收集所有转换过程中的类名

</details>

### 其他配置选项

### `debug`

- **类型:** `boolean`
- **默认值:** `false`

启用调试模式，在转换过程中输出详细的调试日志。这对于排查问题和理解样式转换过程非常有用。

```ts
// 启用调试模式的使用示例
viteTransformToTailwindcss({
  debug: true,
  isRem: false,
})
```

### `isRem`

- **类型:** `boolean`
- **默认值:** `false`

在转换过程中将 px 单位转换为 rem 单位。

### `include`/`exclude`

- **类型:** `FilterPattern`

用于在转换过程中包含或排除文件的过滤模式。

## 🎯 支持特性

✅ **文件格式** - `.html` | `.tsx` | `.vue` | `.astro` | `.svelte`
✅ **CSS 预处理器** - Sass、Less、Stylus
✅ **构建工具** - Vite、Rollup、Webpack、Vue CLI、ESBuild
✅ **IDE 支持** - [VS Code 扩展](https://github.com/Simon-He95/totailwindcss)

## 🔗 相关项目

- [transform-to-tailwindcss-core](https://github.com/Simon-He95/transform-to-tailwindcss-core) - 浏览器端 CSS 转换引擎

## 📈 转换前后对比

<div align="center">

### 转换前 😤

![before](/assets/before.png)

### 转换后 🎉

![after](/assets/after.png)

</div>

## 💖 支持项目

<div align="center">

**如果这个项目对你有帮助，请考虑给个 ⭐！**

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://github.com/Simon-He95/sponsor)

</div>

## 📄 开源协议

[MIT](./license) © 2024-PRESENT [Simon He](https://github.com/Simon-He95)
