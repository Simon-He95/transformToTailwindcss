# skipIfNoChanges 选项修复总结

## 问题

用户发现在类型定义中添加了 `skipIfNoChanges` 属性，但在实际代码中没有被使用。

```typescript
// 类型定义中存在但未使用
export interface Options {
  skipIfNoChanges?: boolean
}
```

## 解决方案

### 1. 更新 ClassCollector 类

添加了 `skipIfNoChanges` 私有属性和相关逻辑：

```typescript
export class ClassCollector {
  private skipIfNoChanges = true // 默认启用跳过功能

  enable(outputPath?: string, skipIfNoChanges?: boolean): void {
    // 支持通过参数设置选项
    if (skipIfNoChanges !== undefined) {
      this.skipIfNoChanges = skipIfNoChanges
    }
  }
}
```

### 2. 修改生成逻辑

在 `generateSafelistFile` 方法中正确使用该选项：

```typescript
// 只有在启用skipIfNoChanges时才检查变化
if (
  this.skipIfNoChanges
  && !this.hasClassesChanged()
  && (await this.fileExists())
) {
  console.log('No changes in collected classes, skipping generation...')
}
```

### 3. 更新插件配置

在 `unplugin.ts` 中将选项传递给收集器：

```typescript
if (options?.collectClasses) {
  classCollector.enable(options?.outputPath, options?.skipIfNoChanges)
}
```

### 4. 增强文件注释

生成的文件现在包含配置状态信息：

```javascript
/**
 * Skip if no changes: true/false
 */
```

## 选项行为

### skipIfNoChanges = true (默认)

- ✅ 检查类名是否发生变化
- ✅ 如果无变化且文件存在，跳过生成
- ✅ 提升构建性能，减少不必要的文件写入

### skipIfNoChanges = false

- ✅ 强制重新生成文件
- ✅ 适用于需要确保文件时间戳更新的场景
- ✅ 适用于调试或特殊构建需求

## 使用示例

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    viteTransformToTailwindcss({
      collectClasses: true,
      outputPath: './config/safelist-classes.js',
      skipIfNoChanges: true, // 性能优化：跳过无变化生成
      // skipIfNoChanges: false,  // 强制模式：总是重新生成
    }),
  ],
})
```

## 测试验证

创建并运行了完整的测试用例，验证：

✅ **跳过逻辑**：`skipIfNoChanges = true` 时正确跳过重复生成
✅ **强制生成**：`skipIfNoChanges = false` 时强制重新生成
✅ **配置记录**：生成文件中正确显示配置状态
✅ **日志输出**：提供清晰的操作日志

## 性能影响

- **默认行为** (`skipIfNoChanges = true`)：优化构建性能
- **强制模式** (`skipIfNoChanges = false`)：确保文件一致性
- **智能检测**：只在内容实际变化时进行文件操作

现在 `skipIfNoChanges` 选项已完全实现并正常工作！
