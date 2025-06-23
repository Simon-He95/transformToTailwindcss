# Safelist Classes Generator

当使用 `transform-to-tailwindcss` 在运行时动态转换CSS到Tailwind CSS类名时，这些类名不会被Tailwind CSS的配置文件检测到。为了解决这个问题，我们新增了类名收集功能，可以自动收集所有转换生成的类名并生成一个JavaScript文件，供您在 `tailwind.config.js` 的 `safelist` 中引用。

## 使用方法

### 1. 启用类名收集

在您的构建配置中启用 `collectClasses` 选项：

#### Vite 配置示例

```javascript
import { viteTransformToTailwindcss } from 'unplugin-transform-to-tailwindcss'
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    viteTransformToTailwindcss({
      collectClasses: true, // 启用类名收集
      outputPath: './safelist-classes.js', // 可选：自定义输出路径
      debug: true, // 可选：启用调试模式
      isRem: true, // 可选：使用rem单位
    }),
  ],
})
```

#### Webpack 配置示例

```javascript
// webpack.config.js
const {
  webpackTransformToTailwindcss,
} = require('unplugin-transform-to-tailwindcss')

module.exports = {
  plugins: [
    webpackTransformToTailwindcss({
      collectClasses: true,
      outputPath: './src/safelist-classes.js',
    }),
  ],
}
```

#### Rollup 配置示例

```javascript
// rollup.config.js
import { rollupTransformToTailwindcss } from 'unplugin-transform-to-tailwindcss'

export default {
  plugins: [
    rollupTransformToTailwindcss({
      collectClasses: true,
      outputPath: './dist/safelist-classes.js',
    }),
  ],
}
```

### 2. 在 Tailwind 配置中使用

构建完成后，会自动生成 `safelist-classes.js` 文件，您可以在 `tailwind.config.js` 中引用：

```javascript
// tailwind.config.js
const { safelistClasses } = require('./safelist-classes.js')

module.exports = {
  content: ['./src/**/*.{html,js,vue,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    ...safelistClasses, // 引入收集的类名
    // 您的其他 safelist 项目
    'bg-red-500',
    'text-blue-600',
  ],
}
```

### 3. 生成的文件格式

生成的 `safelist-classes.js` 文件格式如下：

```javascript
/**
 * Auto-generated safelist classes for Tailwind CSS
 * Generated at: 2024-01-15T10:30:00.000Z
 * Total classes: 156
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
const safelistClasses = [
  'bg-blue-500',
  'text-white',
  'p-4',
  'hover:bg-blue-600',
  'md:p-6',
  // ... 更多类名
]

// Export for CommonJS
module.exports = {
  safelistClasses,
}

// Named export for ES modules
export { safelistClasses }

// Default export for ES modules
export default safelistClasses
```

## 配置选项

| 选项             | 类型      | 默认值                    | 描述             |
| ---------------- | --------- | ------------------------- | ---------------- |
| `collectClasses` | `boolean` | `false`                   | 是否启用类名收集 |
| `outputPath`     | `string`  | `'./safelist-classes.js'` | 输出文件路径     |
| `debug`          | `boolean` | `false`                   | 是否启用调试模式 |
| `isRem`          | `boolean` | `false`                   | 是否使用rem单位  |

## 注意事项

1. **构建时机**：类名收集在构建结束时生成文件，确保所有转换都已完成
2. **文件更新**：每次构建都会重新生成 safelist 文件，包含最新的类名集合
3. **去重处理**：自动去除重复的类名，并按字母顺序排序
4. **兼容性**：生成的文件同时支持 CommonJS 和 ES modules 导入方式

## 示例项目

```
project/
├── src/
│   ├── components/
│   │   └── Button.vue
│   └── main.js
├── safelist-classes.js  # 自动生成
├── tailwind.config.js
├── vite.config.js
└── package.json
```

通过此功能，您可以确保所有动态转换的Tailwind CSS类名都被正确包含在最终的构建中，避免样式丢失的问题。
