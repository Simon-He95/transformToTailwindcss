# ClassCollector Browser Compatibility Fix

## 问题描述

`classCollector.ts` 文件直接导入了 `node:fs`，这会导致在浏览器/playground 环境中运行时出现错误：

```
Cannot resolve 'node:fs' in browser environment
```

## 解决方案

### 1. 动态导入和环境检测

修改了 `classCollector.ts` 文件，使其能够在浏览器环境中安全运行：

```typescript
// 动态导入 fs，在浏览器环境中避免导入错误
let fs: typeof import('node:fs').promises | null = null

// 检查是否在 Node.js 环境中
const isNodeEnvironment
  = typeof window === 'undefined'
    && typeof process !== 'undefined'
    && process.versions?.node

// 只在 Node.js 环境中导入 fs
if (isNodeEnvironment) {
  try {
    fs = require('node:fs').promises
  }
  catch {
    // 静默失败，在某些环境中可能无法导入
  }
}
```

### 2. 文件操作保护

为所有文件操作方法添加了环境检查：

```typescript
async function fileExists(): Promise<boolean> {
  if (!fs || !isNodeEnvironment) {
    console.warn(
      '[transform-to-tailwindcss] File operations not available in browser environment',
    )
    return false
  }
  // ... 原有逻辑
}

async function generateSafelistFile(): Promise<void> {
  // 检查是否在支持文件操作的环境中
  if (!fs || !isNodeEnvironment) {
    console.warn(
      '[transform-to-tailwindcss] File operations not available in browser environment. Safelist generation skipped.',
    )
    console.log(
      `[transform-to-tailwindcss] Collected ${this.collectedClasses.size} unique classes:`,
    )
    console.log(this.getCollectedClasses().join(', '))
  }
  // ... 原有逻辑
}
```

### 3. 类名收集功能保持完整

在浏览器环境中：

- ✅ 类名收集功能正常工作
- ✅ 添加、清理、获取类名等核心功能不受影响
- ✅ 只有文件写入功能被禁用，并显示友好的警告信息
- ✅ 在控制台中显示收集到的类名列表

## 测试验证

### 1. 单元测试

创建了完整的测试套件 `test/classCollector.test.ts`，包括：

- 基本功能测试（类名收集、去重、排序等）
- 浏览器环境安全性测试
- 边界情况测试（空输入、复杂类名、特殊格式等）

所有测试通过：

```
✓ test/classCollector.test.ts (11 tests) 5ms
  ✓ classCollector (11)
    ✓ basic functionality (6)
    ✓ browser environment safety (1)
    ✓ edge cases (4)
```

### 2. Playground 验证

- ✅ Playground 成功启动，无模块导入错误
- ✅ 可以在浏览器中正常访问 `http://localhost:3333`
- ✅ 核心转换功能正常工作

## 影响范围

### 保持兼容性

- ✅ Node.js 环境：完整功能，包括文件生成
- ✅ 浏览器环境：核心功能可用，文件操作安全跳过
- ✅ 向后兼容：现有 API 和行为保持不变

### 使用场景

1. **Node.js 构建环境**：

   - 完整功能，包括生成 safelist 文件
   - 适用于 Webpack、Vite、Rollup 等构建工具

2. **浏览器/Playground 环境**：
   - 类名收集和处理功能正常
   - 无文件系统依赖，安全运行
   - 适用于在线演示、CodePen、StackBlitz 等

## 关键改进

1. **环境适应性**：自动检测运行环境，提供合适的功能集
2. **错误处理**：优雅处理浏览器环境中的文件系统限制
3. **用户体验**：提供清晰的日志信息和警告
4. **测试覆盖**：完整的测试确保各种环境下的稳定性

## 文件变更

- ✅ `src/classCollector.ts` - 核心修复
- ✅ `test/classCollector.test.ts` - 新增测试套件
- ✅ `browser-test.js` - 浏览器环境测试示例

这个修复确保了 `transform-to-tailwindcss` 插件可以在任何环境中安全运行，无论是 Node.js 构建环境还是浏览器 playground。
