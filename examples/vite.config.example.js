// 示例：如何在 Vite 项目中使用类名收集功能
// 包含防止循环依赖的最佳实践

import vue from '@vitejs/plugin-vue'
import { viteTransformToTailwindcss } from 'unplugin-transform-to-tailwindcss'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    viteTransformToTailwindcss({
      // 启用类名收集功能
      collectClasses: true,

      // 推荐：将生成的文件放在独立目录中，避免循环依赖
      outputPath: './config/safelist-classes.js',

      // 性能优化：没有变化时跳过生成（默认: true）
      skipIfNoChanges: true,

      // 精确控制处理的文件，避免处理配置文件
      include: ['src/**/*.vue', 'src/**/*.tsx', 'src/**/*.jsx'],
      exclude: [
        'node_modules/**/*',
        'dist/**/*',
        'config/**/*', // 排除配置目录
        'safelist-classes.js', // 排除生成的文件
        'tailwind.config.js', // 排除Tailwind配置
      ],

      // 其他配置选项
      debug: true,
      isRem: true,
    }),
  ],

  // 其他 Vite 配置...
  build: {
    // 构建配置
  },
})
