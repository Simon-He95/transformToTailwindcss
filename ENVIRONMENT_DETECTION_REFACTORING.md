# Environment Detection Utility Refactoring

## 概述

将环境检测逻辑从各个文件中提取到 `utils.ts` 中的统一函数，以提高代码复用性和可维护性。

## 问题背景

在之前的修复中，我们在多个文件中都有相同的环境检测逻辑：

```typescript
const isNodeEnvironment
  = typeof window === 'undefined'
    && typeof process !== 'undefined'
    && process.versions?.node
```

这种重复代码存在以下问题：

1. **代码重复**：相同的逻辑在多个文件中重复
2. **维护困难**：如果需要修改环境检测逻辑，需要修改多个文件
3. **不一致风险**：可能会出现不同文件中的检测逻辑不一致的情况

## 解决方案

### 1. 创建统一的环境检测函数

在 `src/utils.ts` 中添加了 `isNodeEnvironment()` 函数：

```typescript
/**
 * 检查是否在 Node.js 环境中运行
 * @returns {boolean} 如果在 Node.js 环境中返回 true，在浏览器环境中返回 false
 */
export function isNodeEnvironment(): boolean {
  return (
    typeof window === 'undefined'
    && typeof process !== 'undefined'
    && Boolean(process.versions?.node)
  )
}
```

### 2. 更新所有使用环境检测的文件

#### `src/transformCss.ts`

- ✅ 移除本地环境检测逻辑
- ✅ 从 utils 导入 `isNodeEnvironment`
- ✅ 更新 `filepath` 默认值逻辑

#### `src/compilerCss.ts`

- ✅ 移除本地环境检测逻辑
- ✅ 从 utils 导入 `isNodeEnvironment`
- ✅ 更新默认参数逻辑

#### `src/classCollector.ts`

- ✅ 移除本地环境检测逻辑
- ✅ 从 utils 导入 `isNodeEnvironment`
- ✅ 更新所有环境检查调用

#### `src/transformMedia.ts`

- ✅ 移除未使用的 `process` 导入

## 代码变更详情

### utils.ts

```md
- /\*\*
- - 检查是否在 Node.js 环境中运行
- - @returns {boolean} 如果在 Node.js 环境中返回 true，在浏览器环境中返回 false
- \*/
- export function isNodeEnvironment(): boolean {
- return typeof window === 'undefined' && typeof process !== 'undefined' && Boolean(process.versions?.node)
- }
```

### transformCss.ts

```md
- // 检查是否在 Node.js 环境中
- const isNodeEnvironment = typeof window === 'undefined' && typeof process !== 'undefined' && process.versions?.node

* import {
* // ...existing imports...
* isNodeEnvironment,
* // ...existing imports...
* } from './utils'

- const filepath = \_filepath || (isNodeEnvironment ? process.cwd() : '')

* const filepath = \_filepath || (isNodeEnvironment() ? process.cwd() : '')
```

### compilerCss.ts

```md
- // 检查是否在 Node.js 环境中
- const isNodeEnvironment = typeof window === 'undefined' && typeof process !== 'undefined' && process.versions?.node

* import { isNodeEnvironment } from './utils'

- filepath: string = isNodeEnvironment ? process.cwd() : '',

* filepath: string = isNodeEnvironment() ? process.cwd() : '',
```

### classCollector.ts

```md
- // 检查是否在 Node.js 环境中
- const isNodeEnvironment = typeof window === 'undefined' && typeof process !== 'undefined' && process.versions?.node

* import { isNodeEnvironment } from './utils'

- if (isNodeEnvironment) {

* if (isNodeEnvironment()) {

- if (!fs || !isNodeEnvironment) {

* if (!fs || !isNodeEnvironment()) {
```

## 测试验证

### 1. 更新测试套件

更新了 `test/browserCompatibility.test.ts`：

- 添加了 `isNodeEnvironment` 函数的专门测试
- 更新了所有使用环境检测的测试用例
- 确保在模拟环境中正确调用函数

### 2. 测试结果

所有测试通过：

```
✓ test/browserCompatibility.test.ts (8 tests) 152ms
✓ test/classCollector.test.ts (11 tests) 6ms
```

## 优势

### 1. **代码复用**

- 统一的环境检测逻辑，避免重复代码
- 一处修改，所有地方生效

### 2. **可维护性**

- 如需修改环境检测逻辑，只需更新一个函数
- 所有使用环境检测的地方都会自动使用新逻辑

### 3. **一致性**

- 保证所有文件中的环境检测行为完全一致
- 避免因为复制粘贴导致的不一致问题

### 4. **可测试性**

- 环境检测逻辑可以独立测试
- 更容易模拟不同环境进行测试

### 5. **类型安全**

- 函数有明确的返回类型注解
- TypeScript 可以提供更好的类型检查

## 影响范围

### ✅ 保持向后兼容

- API 没有变化
- 行为完全一致
- 现有代码无需修改

### ✅ 性能影响

- 函数调用开销极小
- 检测逻辑仍然是简单的条件判断

### ✅ 部署安全

- 不影响生产环境
- Node.js 和浏览器环境都正常工作

## 未来扩展

这个重构为未来的扩展奠定了基础：

1. **环境特定功能**：可以轻松添加其他环境检测函数
2. **性能优化**：可以在 utils 中缓存检测结果
3. **调试支持**：可以在开发模式下添加环境检测日志
4. **多环境支持**：可以扩展支持更多运行环境检测

## 总结

这次重构成功地将分散的环境检测逻辑统一到了一个可复用的工具函数中，提高了代码质量和可维护性，同时保持了完全的向后兼容性。所有测试通过，确保了重构的安全性和正确性。
