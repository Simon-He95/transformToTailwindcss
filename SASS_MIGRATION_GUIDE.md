# Sass 现代语法迁移指南

## 弃用警告说明

从 Dart Sass 3.0.0 开始，传统的 `@import` 规则将被移除。建议使用现代的 `@use` 和 `@forward` 规则。

## 语法迁移对比

### 1. 基础导入

**❌ 传统语法 (已弃用):**

```scss
@import './variables';
@import './mixins';

.component {
  color: $primary-color;
  @include button-style;
}
```

**✅ 现代语法 (推荐):**

```scss
@use './variables';
@use './mixins';

.component {
  color: variables.$primary-color;
  @include mixins.button-style;
}
```

### 2. 命名空间别名

**✅ 现代语法:**

```scss
@use './variables' as vars;
@use './mixins' as mx;

.component {
  color: vars.$primary-color;
  @include mx.button-style;
}
```

### 3. 配置变量

**✅ 现代语法:**

```scss
@use './theme' with (
  $primary-color: #ff6b6b,
  $secondary-color: #4ecdc4
);

.component {
  background: theme.$primary-color;
}
```

### 4. 模块转发

**✅ 现代语法:**

```scss
// _index.scss
@forward './variables';
@forward './mixins';

// main.scss
@use './index';

.component {
  color: index.$primary-color;
  @include index.button-style;
}
```

## transform-to-tailwindcss 的兼容性

本工具已经支持现代和传统语法：

1. **自动处理 file:// URL**: 在 `compilerCss.ts` 中统一清理
2. **支持所有 Sass 指令**: `@use`, `@forward`, `@include`, `@import`
3. **向后兼容**: 传统语法仍然可以工作，但会显示弃用警告

## 建议

1. **新项目**: 使用现代的 `@use` 和 `@forward` 语法
2. **现有项目**: 逐步迁移，工具会继续支持传统语法
3. **混合使用**: 可以在同一项目中混合使用，但建议保持一致性

## 示例迁移

查看 `test/demo/sass/` 目录中的示例文件，了解现代语法的最佳实践。
