<!-- 示例 Vue 组件：展示动态 CSS 转换为 Tailwind 类名 -->
<script setup>
import { ref } from 'vue'

const dynamicColor = ref('#f3f4f6')
</script>

<template>
  <div class="container">
    <h1 class="title">
      Hello World
    </h1>
    <button class="btn primary">
      点击我
    </button>
    <div class="card" :style="{ backgroundColor: dynamicColor }">
      <p class="text">
        这是一个动态样式的卡片
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 这些 CSS 样式将被转换为 Tailwind 类名 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn.primary {
  background-color: #3b82f6;
  color: white;
}

.btn.primary:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 16px;
}

.text {
  color: #4b5563;
  line-height: 1.6;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .title {
    font-size: 1.5rem;
  }
}
</style>

<!--
转换后，这些样式将生成如下 Tailwind 类名（示例）：
- .container -> max-w-7xl mx-auto p-5
- .title -> text-2xl font-bold text-gray-800 mb-4
- .btn -> px-4 py-2 rounded border-0 cursor-pointer font-medium transition-all
- .btn.primary -> bg-blue-500 text-white
- .btn.primary:hover -> hover:bg-blue-600 hover:-translate-y-px
- .card -> bg-white rounded-lg p-4 shadow-sm mt-4
- .text -> text-gray-600 leading-relaxed
- @media (max-width: 768px) -> md:p-2.5 md:text-xl

这些类名将自动收集到 safelist-classes.js 文件中
-->
