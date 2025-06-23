// 示例：tailwind.config.js 配置文件
// 展示如何安全地使用生成的 safelist 类名，避免循环依赖

const { safelistClasses } = require('./config/safelist-classes.js')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    // 注意：不要包含生成的 safelist-classes.js 文件
  ],
  theme: {
    extend: {
      // 您的主题扩展
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
      },
    },
  },
  plugins: [
    // 您的插件
  ],
  safelist: [
    // 引入自动收集的类名
    ...safelistClasses,

    // 您手动添加的 safelist 类名
    'bg-red-500',
    'text-blue-600',
    'hover:bg-green-500',

    // 支持正则表达式模式
    {
      pattern: /bg-(red|green|blue)-(100|200|300)/,
    },

    // 支持对象形式的配置
    {
      pattern: /text-(sm|base|lg|xl)/,
      variants: ['responsive', 'hover', 'focus'],
    },
  ],
}
