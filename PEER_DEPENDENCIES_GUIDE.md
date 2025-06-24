# CSS 预处理器依赖管理

## 概述

从 v0.0.49 开始，`transform-to-tailwindcss` 使用 `peerDependencies` 来管理 CSS 预处理器依赖。这意味着你需要在项目中安装你使用的预处理器。

## 为什么使用 peerDependencies？

1. **版本兼容性**: 使用你项目中的预处理器版本，避免版本冲突
2. **减少包大小**: 只安装你实际使用的预处理器
3. **灵活性**: 可以选择你喜欢的预处理器版本
4. **避免重复**: 不会与项目中已有的预处理器产生冲突

## 安装依赖

根据你使用的 CSS 预处理器，安装相应的依赖：

### Sass/SCSS

```bash
npm install sass
# 或
yarn add sass
# 或
pnpm add sass
```

### Less

```bash
npm install less less-plugin-module-resolver
# 或
yarn add less less-plugin-module-resolver
# 或
pnpm add less less-plugin-module-resolver
```

### Stylus

```bash
npm install stylus
# 或
yarn add stylus
# 或
pnpm add stylus
```

## 支持的版本

- **Sass**: `^1.0.0` (推荐使用最新版本以获得最佳性能和现代语法支持)
- **Less**: `^3.0.0 || ^4.0.0`
- **Stylus**: `^0.50.0 || ^0.60.0`
- **less-plugin-module-resolver**: `^1.0.0`

## 错误处理

如果你遇到以下错误：

- `Sass compiler not found`
- `Less compiler not found`
- `Stylus compiler not found`

请确保你已经安装了相应的预处理器。

## 示例

### package.json

```json
{
  "dependencies": {
    "transform-to-tailwindcss": "^0.0.49",
    "sass": "^1.89.2"
  }
}
```

### 使用

```javascript
import { transformCode } from 'transform-to-tailwindcss'

// 现在会使用你项目中的 sass 版本
const result = await transformCode(scssCode, 'scss')
```

## 迁移指南

如果你从旧版本升级：

1. 安装你需要的预处理器
2. 更新 `transform-to-tailwindcss` 到最新版本
3. 测试你的构建流程

旧版本会继续工作，但建议升级以获得更好的兼容性和性能。
