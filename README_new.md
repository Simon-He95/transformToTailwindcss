<div align="center">

# 🎨 Transform to TailwindCSS

<img height="200" src="./assets/kv.png" alt="to tailwindcss">

[![npm version](https://badge.fury.io/js/transform-to-tailwindcss.svg)](https://badge.fury.io/js/transform-to-tailwindcss)
[![Downloads](https://img.shields.io/npm/dm/transform-to-tailwindcss.svg)](https://www.npmjs.com/package/transform-to-tailwindcss)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/Simon-He95/transformToTailwindcss.svg?style=social&label=Star)](https://github.com/Simon-He95/transformToTailwindcss)

**🚀 Effortlessly migrate legacy CSS to TailwindCSS**

_Automatically transform existing CSS styles into utility-first TailwindCSS classes_

[English](./README.md) | [简体中文](./README_zh.md)

</div>

---

## ✨ Why Choose Transform to TailwindCSS?

🎯 **Performance First** - Reduce bundle size with TailwindCSS utility classes
🔄 **Legacy Migration** - Seamlessly upgrade old projects to modern TailwindCSS
⚡ **Developer Experience** - Maintain design system consistency
🛠️ **Framework Agnostic** - Support for Vue, React, Svelte, Astro and vanilla HTML
📝 **Auto Safelist** - 🆕 Automatically collect generated class names, never lose any
🔐 **Circular Protection** - 🆕 Smart protection to prevent infinite build loops
🚀 **Build Optimized** - 🆕 Smart skip, only regenerate when changes occur

> Want to use UnoCSS? Try [transformToUnocss](https://github.com/Simon-He95/transformToUnocss)!

## 🚀 Quick Start

### Global Installation

```bash
npm install -g transform-to-tailwindcss
# or
yarn global add transform-to-tailwindcss
# or
pnpm add -g transform-to-tailwindcss
```

### CLI Usage

```bash
# Transform a directory
totailwindcss playground

# Revert changes
totailwindcss playground --revert
```

### 🆕 Quick Example: Auto Safelist Generation

Transform your CSS and automatically generate a safelist for TailwindCSS in just 3 steps:

```ts
// 1. Configure your build tool
// vite.config.ts
export default defineConfig({
  plugins: [
    viteTransformToTailwindcss({
      collectClasses: true, // 🆕 Enable auto-collection
      outputPath: './safelist-classes.js',
    }),
  ],
})
```

```ts
// 2. Use in your TailwindCSS config
// tailwind.config.js
const { safelistClasses } = require('./safelist-classes.js')

module.exports = {
  safelist: [...safelistClasses], // 🎯 Never lose classes again!
  // ... rest of your config
}
```

```vue
<!-- 3. Write your components normally -->
<template>
  <div class="card">
    <h1 class="title">
      Hello World
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

<!-- ✨ Auto-generated: ["p-5", "bg-gray-100", "text-2xl", "text-gray-800"] -->
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

## 🔧 Configuration Options

<div align="center">

| Option               | Type            | Default                   | Description                               |
| -------------------- | --------------- | ------------------------- | ----------------------------------------- |
| 🐛 `debug`           | `boolean`       | `false`                   | Enable detailed transformation logs       |
| 📐 `isRem`           | `boolean`       | `false`                   | Convert px units to rem                   |
| 🎯 `include`         | `FilterPattern` | -                         | Files to process                          |
| 🚫 `exclude`         | `FilterPattern` | -                         | Files to ignore                           |
| 📝 `collectClasses`  | `boolean`       | `false`                   | **New** Auto-collect generated classes    |
| 📂 `outputPath`      | `string`        | `'./safelist-classes.js'` | **New** Output path for collected classes |
| ⚡ `skipIfNoChanges` | `boolean`       | `true`                    | **New** Skip generation if no changes     |

</div>

### 🆕 Class Collection Feature

> 🎯 **New Feature**: Automatically collect all generated TailwindCSS class names for `safelist` configuration!

When using dynamic CSS transformations, TailwindCSS might not detect the generated classes during purging. The class collection feature solves this by automatically generating a safelist file containing all transformed classes.

<details>
<summary><strong>📝 Auto-Generate Safelist - Never Lose Classes Again</strong></summary>

```ts
// vite.config.js
import { viteTransformToTailwindcss } from 'transform-to-tailwindcss'

export default defineConfig({
  plugins: [
    viteTransformToTailwindcss({
      collectClasses: true, // ✅ Enable class collection
      outputPath: './config/safelist-classes.js', // 📂 Custom output path
      skipIfNoChanges: true, // ⚡ Performance optimization
      exclude: [
        'config/**/*', // 🚫 Exclude config directory
        'safelist-classes.js', // 🚫 Exclude generated file
        'tailwind.config.js', // 🚫 Exclude Tailwind config
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
    ...safelistClasses, // 🎯 Auto-generated classes
    // Your other safelist items...
  ],
}
```

**Generated file (`safelist-classes.js`):**

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
  // ... more classes
]

module.exports = { safelistClasses }
export { safelistClasses }
```

**Key Benefits:**

- 🔄 **Circular Dependency Protection**: Smart detection prevents infinite build loops
- ⚡ **Performance Optimized**: Only regenerates when classes actually change
- 🛡️ **Build-Safe**: Multiple safeguards prevent duplicate generations
- 📊 **Comprehensive**: Collects classes from all transformation processes

</details>

### Other Configuration Options

### `debug`

- **Type:** `boolean`
- **Default:** `false`

Enable debug mode to output detailed debugging logs during the transformation process. This is useful for troubleshooting and understanding the style transformation process.

```ts
// Example usage with debug mode enabled
viteTransformToTailwindcss({
  debug: true,
  isRem: false,
})
```

### `isRem`

- **Type:** `boolean`
- **Default:** `false`

Convert px units to rem units during the transformation process.

### `include`/`exclude`

- **Type:** `FilterPattern`

Filter patterns for including or excluding files during the transformation process.

## 🎯 Supported Features

✅ **File Formats** - `.html` | `.tsx` | `.vue` | `.astro` | `.svelte`
✅ **CSS Preprocessors** - Sass, Less, Stylus
✅ **Build Tools** - Vite, Rollup, Webpack, Vue CLI, ESBuild
✅ **IDE Support** - [VS Code Extension](https://github.com/Simon-He95/totailwindcss)

## 🔗 Related Projects

- [transform-to-tailwindcss-core](https://github.com/Simon-He95/transform-to-tailwindcss-core) - Browser-side CSS transformation engine

## 📈 Before & After Comparison

<div align="center">

### Before 😤

![before](/assets/before.png)

### After 🎉

![after](/assets/after.png)

</div>

## 💖 Support the Project

<div align="center">

**If this project helps you, please consider giving it a ⭐!**

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://github.com/Simon-He95/sponsor)

</div>

## 📄 License

[MIT](./license) © 2024-PRESENT [Simon He](https://github.com/Simon-He95)
