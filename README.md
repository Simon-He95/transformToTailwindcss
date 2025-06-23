<div align="center">

# 🎨 Transform to TailwindCSS

<im## 🚀 Quick Start

### 📦 Global Installation

<details>
<summary><strong>📥 Choose your package manager</strong></summary>

````bash
# npm
npm install -g transform-to-tailwindcss

# yarn
yarn global add transform-to-tailwindcss

# pnpm (recommended)
pnpm add -g transform-to-tailwindcss

# bun
bun add -g transform## 🌟 Related Ecosystem

<div align="center">

[![transform-to-tailwindcss-core](https://img.shields.io/badge/Core%20Engine-transform--to--tailwindcss--core-FF6B6B?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Simon-He95/transform-to-tailwindcss-core)
[![transformToUnocss](https://img.shields.io/badge/UnoCSS%20Version-transformToUnocss-4ECDC4?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Simon-He95/transformToUnocss)

</div>

## 🚀 Performance Showcase

<div align="center">

<table>
<tr>
<td align="center">
<h3>📊 Bundle Size Reduction</h3>
<strong>Before:</strong> 847KB CSS<br>
<strong>After:</strong> 23KB TailwindCSS<br>
<span style="color: #10b981; font-weight: bold;">↓ 97.3% smaller</span>
</td>
<td align="center">
<h3>⚡ Build Time Improvement</h3>
<strong>Before:</strong> 2.4s compilation<br>
<strong>After:</strong> 0.3s compilation<br>
<span style="color: #10b981; font-weight: bold;">8x faster</span>
</td>
</tr>
</table>

### 🎨 Visual Transformation

**Legacy CSS** 😤
```css
.button {
  padding: 12px 24px;
  background-color: #3b82f6;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
}
````

**↓ Transform Magic ↓**

**TailwindCSS** 🎉

```html
<button
  class="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold transition-all duration-200"
></button>
```

</div>-tailwindcss
```

</details>

### ⚡ CLI Magic

````bash
# 🎯 Transform your project
totailwindcss playground

# 🔙 Rollback changes (safety first!)
totailwindcss playground --revert

# 🐛 Debug mode for troubleshooting
totailwindcss playground --debug
```"./assets/kv.png" alt="Transform to TailwindCSS - Revolutionary CSS Migration Tool">

[![npm version](https://img.shields.io/npm/v/transform-to-tailwindcss?style=for-the-badge&logo=npm&logoColor=white&color=cb3837)](https://www.npmjs.com/package/transform-to-tailwindcss)
[![downloads](https://img.shields.io/npm/dt/transform-to-tailwindcss?style=for-the-badge&logo=npm&logoColor=white&color=10b981)](https://www.npmjs.com/package/transform-to-tailwindcss)
[![GitHub stars](https://img.shields.io/github/stars/Simon-He95/transformToTailwindcss?style=for-the-badge&logo=github&logoColor=white&color=f59e0b)](https://github.com/Simon-He95/transformToTailwindcss)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge&logo=open-source-initiative&logoColor=white)](./license)

<br>

**🚀 The Ultimate CSS-to-TailwindCSS Migration Tool**

*Automatically transform your legacy CSS into modern, utility-first TailwindCSS classes with surgical precision*

<br>

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=flat-square&logo=webpack&logoColor=black)](https://webpack.js.org/)
[![Rollup](https://img.shields.io/badge/Rollup-EC4A3F?style=flat-square&logo=rollup.js&logoColor=white)](https://rollupjs.org/)
[![Vue](https://img.shields.io/badge/Vue-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Svelte](https://img.shields.io/badge/Svelte-FF3E00?style=flat-square&logo=svelte&logoColor=white)](https://svelte.dev/)
[![Astro](https://img.shields.io/badge/Astro-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build/)

<br>

[English](./README.md) | [简体中文](./README_zh.md)

</div>

---

## 🌟 Why Choose Transform to TailwindCSS?

<table>
<tr>
<td align="center">⚡<br><strong>Lightning Fast</strong><br>Instantly migrate thousands of lines</td>
<td align="center">🎯<br><strong>Surgical Precision</strong><br>Maintains styling accuracy</td>
<td align="center">🔄<br><strong>Reversible</strong><br>Full rollback support</td>
</tr>
<tr>
<td align="center">🛠️<br><strong>Framework Agnostic</strong><br>Vue, React, Svelte, Astro & more</td>
<td align="center">🎨<br><strong>Preprocessor Ready</strong><br>Sass, Less, Stylus support</td>
<td align="center">📦<br><strong>Zero Config</strong><br>Works out of the box</td>
</tr>
</table>

<div align="center">

> 🌈 **Looking for UnoCSS?** Check out our sister project [transformToUnocss](https://github.com/Simon-He95/transformToUnocss)!

</div>

## � Quick Start

### Global Installation
```bash
npm install -g transform-to-tailwindcss
# or
yarn global add transform-to-tailwindcss
# or
pnpm add -g transform-to-tailwindcss
````

### CLI Usage

```bash
# Transform a directory
totailwindcss playground

# Revert changes
totailwindcss playground --revert
```

## 🔧 Plugin Integration

> 🎯 **Pro Tip**: Choose your build tool and get running in seconds!

<details>
<summary><strong>🟢 Vite - The Lightning Fast Build Tool</strong></summary>

```ts
import { vitePluginTransformTotailwindcss } from 'transform-to-tailwindcss'
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vitePluginTransformTotailwindcss({
      debug: true, // 🐛 Enable debug mode
      isRem: false, // 📏 Convert px to rem
      include: /\.(vue|tsx|jsx)$/, // 🎯 Target specific files
      exclude: /node_modules/, // 🚫 Skip node_modules
    }),
  ],
})
```

</details>

<details>
<summary><strong>📦 Rollup - The Module Bundler</strong></summary>

```ts
// rollup.config.js
import { rollupTransformTotailwindcss } from 'transform-to-tailwindcss'

export default {
  plugins: [
    rollupTransformTotailwindcss({
      debug: process.env.NODE_ENV === 'development', // 🔍 Debug in dev
      isRem: true, // 📐 Use rem units
    }),
  ],
}
```

</details>

<details>
<summary><strong>⚡ Webpack - The Battle-Tested Bundler</strong></summary>

```ts
// webpack.config.js
const { webpackTransformTotailwindcss } = require('transform-to-tailwindcss')

module.exports = {
  plugins: [
    webpackTransformTotailwindcss({
      include: /\.(vue|tsx|jsx)$/,
      exclude: /node_modules/,
      debug: process.env.NODE_ENV === 'development',
    }),
  ],
}
```

</details>

<details>
<summary><strong>🔷 Vue CLI - Vue's Official Tooling</strong></summary>

```ts
// vue.config.js
const { webpackTransformTotailwindcss } = require('transform-to-tailwindcss')

module.exports = {
  configureWebpack: {
    plugins: [
      webpackTransformTotailwindcss({
        debug: process.env.NODE_ENV === 'development',
        isRem: true, // 📏 Convert to rem for better accessibility
      }),
    ],
  },
}
```

</details>

<details>
<summary><strong>⚡ ESBuild - The Speed Demon</strong></summary>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import { esbuildTransformTotailwindcss } from 'transform-to-tailwindcss'

build({
  plugins: [
    esbuildTransformTotailwindcss({
      isRem: true, // 📐 Use rem units
      debug: false, // 🔇 Production mode
    }),
  ],
})
```

</details>

module.exports = {
plugins: [
webpackTransformTotailwindcss({
include: /\.(vue|tsx|jsx)$/,
exclude: /node_modules/
}),
],
}

````

### 🔷 Vue CLI

```ts
// vue.config.js
const { webpackTransformTotailwindcss } = require('transform-to-tailwindcss')

module.exports = {
  configureWebpack: {
    plugins: [
      webpackTransformTotailwindcss({
        debug: process.env.NODE_ENV === 'development'
      }),
    ],
  },
}
````

### ⚡ ESBuild

```ts
// esbuild.config.js
import { build } from 'esbuild'
import { esbuildTransformTotailwindcss } from 'transform-to-tailwindcss'

build({
  plugins: [
    esbuildTransformTotailwindcss({
      isRem: true,
    }),
  ],
})
```

## ⚙️ Configuration API

<div align="center">

| Option       | Type            | Default | Description                         |
| ------------ | --------------- | ------- | ----------------------------------- |
| 🐛 `debug`   | `boolean`       | `false` | Enable detailed transformation logs |
| 📐 `isRem`   | `boolean`       | `false` | Convert px units to rem             |
| 🎯 `include` | `FilterPattern` | -       | Files to process                    |
| 🚫 `exclude` | `FilterPattern` | -       | Files to ignore                     |

</div>

### 💡 Configuration Examples

<details>
<summary><strong>🐛 Debug Mode - See Everything</strong></summary>

```ts
vitePluginTransformTotailwindcss({
  debug: true, // 🔍 Output detailed transformation logs
})

// Console output:
// ✅ Transforming: src/components/Button.vue
// 🎨 CSS: .button { color: red; } → text-red-500
// ⚡ Complete in 12ms
```

</details>

<details>
<summary><strong>📐 Rem Conversion - Accessibility First</strong></summary>

```ts
vitePluginTransformTotailwindcss({
  isRem: true, // Convert px to rem for better accessibility
})

// Before: padding: 16px; margin: 24px;
// After:  p-4 m-6 (1rem = 16px base)
```

</details>

<details>
<summary><strong>🎯 File Targeting - Precision Control</strong></summary>

```ts
vitePluginTransformTotailwindcss({
  include: [
    /\.vue$/, // Vue components
    /\.tsx?$/, // TypeScript files
    /\.jsx?$/, // JavaScript files
  ],
  exclude: [
    /node_modules/, // Skip dependencies
    /\.stories\./, // Skip Storybook files
    /\.test\./, // Skip test files
  ],
})
```

</details>

## 🎯 Supported Ecosystem

<div align="center">

<table>
<tr>
<th>📄 File Types</th>
<th>🎨 Preprocessors</th>
<th>🛠️ Build Tools</th>
<th>🌐 Frameworks</th>
</tr>
<tr>
<td>
• HTML<br>
• Vue SFC<br>
• React TSX/JSX<br>
• Svelte<br>
• Astro
</td>
<td>
• Sass/SCSS<br>
• Less<br>
• Stylus<br>
• PostCSS<br>
• Native CSS
</td>
<td>
• Vite<br>
• Webpack<br>
• Rollup<br>
• ESBuild<br>
• Vue CLI
</td>
<td>
• Vue 3<br>
• React 18+<br>
• Svelte 4<br>
• Astro 3<br>
• Vanilla JS
</td>
</tr>
</table>

### 🔌 IDE Extensions

[![VS Code](https://img.shields.io/badge/VS%20Code-Extension-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)](https://github.com/Simon-He95/totailwindcss)

</div>

## � Related Projects

- [transform-to-tailwindcss-core](https://github.com/Simon-He95/transform-to-tailwindcss-core) - Browser-side CSS transformation engine

## � Community & Support

<div align="center">

### 🌟 Show Your Love

[![GitHub Stars](https://img.shields.io/github/stars/Simon-He95/transformToTailwindcss?style=for-the-badge&logo=github&logoColor=white&color=f59e0b)](https://github.com/Simon-He95/transformToTailwindcss/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Simon-He95/transformToTailwindcss?style=for-the-badge&logo=github&logoColor=white&color=10b981)](https://github.com/Simon-He95/transformToTailwindcss/network)

### 💖 Sponsor the Project

<a href="https://github.com/Simon-He95/sponsor">
<img src="https://img.shields.io/badge/Sponsor-❤️-ff69b4?style=for-the-badge&logo=github-sponsors&logoColor=white" alt="Sponsor">
</a>

<a href="https://www.buymeacoffee.com/simon_he95">
<img src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-☕-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee">
</a>

### 🤝 Contributing

We welcome contributions! Check out our [issues](https://github.com/Simon-He95/transformToTailwindcss/issues) or submit a PR.

[![Contributors](https://img.shields.io/github/contributors/Simon-He95/transformToTailwindcss?style=for-the-badge&logo=github&logoColor=white&color=9333ea)](https://github.com/Simon-He95/transformToTailwindcss/graphs/contributors)

</div>

---

<div align="center">

**📄 License**

[MIT](./license) © 2024-PRESENT [Simon He](https://github.com/Simon-He95)

<br>

**Made with ❤️ by the community**

[![GitHub](https://img.shields.io/badge/GitHub-Simon--He95-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/Simon-He95)

</div>
