# v0.0.49 重大更新：CSS 预处理器依赖管理

## 📋 更新摘要

本次更新将 CSS 预处理器依赖（sass、less、stylus）从直接依赖改为 `peerDependencies`，并修复了 `file://` URL 处理问题。

## 🔧 主要变更

### 1. 依赖管理重构

- **之前**: 插件内置 sass、less、stylus 依赖
- **现在**: 使用 `peerDependencies`，让用户项目管理这些依赖

### 2. 修复 file:// URL 问题

- 在 `compilerCss.ts` 中统一处理 `file://` URL
- 支持所有预处理器（sass、less、stylus）
- 避免 Sass 编译错误

### 3. 现代 Sass 语法支持

- 更新测试用例使用 `@use` 和 `@forward`
- 减少弃用警告
- 提供迁移指南

## 🎯 用户影响

### 需要手动安装的依赖

根据你使用的预处理器，需要安装：

```bash
# Sass/SCSS
npm install sass

# Less
npm install less less-plugin-module-resolver

# Stylus
npm install stylus
```

### 优势

1. **版本兼容性**: 使用项目中的预处理器版本，避免冲突
2. **包大小优化**: 只安装实际使用的预处理器
3. **灵活性**: 可以选择合适的预处理器版本
4. **避免重复依赖**: 不会与项目现有依赖冲突

## 📚 相关文档

- [PEER_DEPENDENCIES_GUIDE.md](./PEER_DEPENDENCIES_GUIDE.md) - 详细的依赖安装指南
- [SASS_MIGRATION_GUIDE.md](./SASS_MIGRATION_GUIDE.md) - Sass 现代语法迁移指南

## 🧪 测试覆盖

- ✅ 15个 Sass 编译器测试用例全部通过
- ✅ 包含 `file://` URL 处理验证
- ✅ 现代和传统 Sass 语法测试
- ✅ 错误处理和边缘情况测试

## 🔄 迁移步骤

1. **更新插件版本**:

   ```bash
   npm update transform-to-tailwindcss
   ```

2. **安装预处理器依赖**（根据需要）:

   ```bash
   npm install sass  # 如果使用 SCSS
   npm install less less-plugin-module-resolver  # 如果使用 Less
   npm install stylus  # 如果使用 Stylus
   ```

3. **测试构建流程**:
   确保所有功能正常工作

## 🚨 注意事项

- 如果遇到 "compiler not found" 错误，请安装相应的预处理器
- 旧版本会继续工作，但建议升级以获得更好的兼容性
- 现代 Sass 语法推荐使用 `@use` 和 `@forward` 替代 `@import`

## 🎁 额外收获

- 修复了 `file://` URL 导致的编译错误
- 改进了错误提示，更容易定位问题
- 统一了所有预处理器的错误处理逻辑
- 提供了完整的 Sass 现代语法示例

这次更新让插件更加灵活和可靠，同时保持了向后兼容性。
