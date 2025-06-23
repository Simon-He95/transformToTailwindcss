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

### `debug`

- **类型:** `boolean`
- **默认值:** `false`

启用调试模式，在转换过程中输出详细的调试日志。这对于排查问题和理解样式转换过程非常有用。

```ts
// 启用调试模式的使用示例
vitePluginTransformTotailwindcss({
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
