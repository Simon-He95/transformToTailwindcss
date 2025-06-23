# 避免循环依赖 - 使用指南

## 问题说明

当使用 `collectClasses` 功能时，可能会出现以下循环依赖问题：

1. **构建过程**：插件收集类名并生成 `safelist-classes.js`
2. **配置引用**：`tailwind.config.js` 引入 `safelist-classes.js`
3. **循环触发**：文件变化可能触发重新构建，导致无限循环

## 解决方案

### 1. 内置防护机制

我们已经实现了多层防护：

```typescript
// 自动检测：
// ✅ 检查类名是否实际发生变化
// ✅ 防止重复生成
// ✅ 限制构建触发次数
// ✅ 文件存在性检查
```

### 2. 推荐的项目结构

```
project/
├── src/
│   ├── components/        # 源代码文件
│   └── styles/
├── config/
│   ├── tailwind.config.js # Tailwind 配置
│   └── safelist-classes.js # 生成的类名文件（放在config目录）
├── dist/                  # 构建输出
└── package.json
```

### 3. 安全的配置方式

#### 方案 A：独立配置目录（推荐）

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    viteTransformToTailwindcss({
      collectClasses: true,
      outputPath: './config/safelist-classes.js', // 独立目录
      skipIfNoChanges: true, // 跳过无变化的生成
    }),
  ],
})
```

```javascript
// config/tailwind.config.js
const { safelistClasses } = require('./safelist-classes.js')

module.exports = {
  content: [
    '../src/**/*.{vue,js,ts,jsx,tsx}', // 注意路径调整
  ],
  safelist: [...safelistClasses],
}
```

#### 方案 B：使用 .gitignore 排除

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    viteTransformToTailwindcss({
      collectClasses: true,
      outputPath: './generated/safelist-classes.js',
      include: ['src/**/*.{vue,tsx}'], // 明确指定源文件
      exclude: ['generated/**/*'], // 排除生成的文件
    }),
  ],
})
```

```gitignore
# .gitignore
generated/
safelist-classes.js
```

### 4. 构建脚本优化

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:clean": "rm -rf generated/ && vite build",
    "preview": "vite preview"
  }
}
```

### 5. 高级配置选项

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    viteTransformToTailwindcss({
      collectClasses: true,
      outputPath: './safelist-classes.js',
      skipIfNoChanges: true, // 没有变化时跳过
      debug: true, // 启用调试日志

      // 精确控制处理的文件
      include: ['src/**/*.vue', 'src/**/*.tsx', 'src/**/*.jsx'],
      exclude: [
        'node_modules/**/*',
        'dist/**/*',
        'safelist-classes.js', // 排除生成的文件
        'tailwind.config.js', // 排除配置文件
      ],
    }),
  ],
})
```

## 调试和监控

### 1. 启用调试模式

```javascript
viteTransformToTailwindcss({
  collectClasses: true,
  debug: true, // 会输出详细的日志信息
})
```

### 2. 监控日志输出

```bash
# 正常情况下的日志
[transform-to-tailwindcss] Generated safelist file: ./safelist-classes.js
[transform-to-tailwindcss] Collected 156 unique classes

# 跳过重复生成的日志
[transform-to-tailwindcss] No changes in collected classes, skipping generation...
[transform-to-tailwindcss] Build end called 2 times, skipping duplicate call...
```

## 最佳实践

### 1. 开发阶段

```javascript
// 开发环境：更激进的缓存策略
const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  plugins: [
    viteTransformToTailwindcss({
      collectClasses: !isDev, // 开发时关闭，提升性能
      outputPath: './safelist-classes.js',
    }),
  ],
})
```

### 2. 生产构建

```javascript
// 生产环境：确保类名完整收集
const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [
    viteTransformToTailwindcss({
      collectClasses: isProd, // 只在生产构建时收集
      outputPath: './dist/safelist-classes.js',
      skipIfNoChanges: false, // 生产环境强制重新生成
    }),
  ],
})
```

### 3. 持续集成

```yaml
# .github/workflows/build.yml
- name: Clean generated files
  run: rm -f safelist-classes.js

- name: Build
  run: npm run build

- name: Verify safelist
  run: test -f safelist-classes.js
```

## 故障排除

### 1. 无限循环检测

如果遇到无限构建循环：

```bash
# 检查是否有循环依赖
[transform-to-tailwindcss] Build end called 3 times, skipping duplicate call...
```

**解决方法**：

- 检查 `exclude` 配置是否正确
- 确保生成的文件不在源文件目录中
- 使用独立的配置目录

### 2. 类名丢失

如果发现类名没有被收集：

```bash
# 启用调试模式查看详细信息
[transform-to-tailwindcss] Processing file: src/components/Button.vue
[transform-to-tailwindcss] Collected 0 unique classes
```

**解决方法**：

- 检查 `include` 配置是否包含相关文件
- 确认 `collectClasses: true` 已启用
- 查看转换是否正常执行

### 3. 文件权限问题

```bash
[transform-to-tailwindcss] Failed to generate safelist file: EACCES
```

**解决方法**：

- 检查输出目录的写入权限
- 确保目录存在或可以创建
- 使用相对路径而非绝对路径

通过以上措施，可以有效避免循环依赖问题，确保类名收集功能稳定运行。
