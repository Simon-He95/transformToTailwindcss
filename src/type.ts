import type { FilterPattern } from '@rollup/pluginutils'

export type CssType = 'less' | 'scss' | 'css' | 'stylus'

export type SuffixType = 'vue' | 'tsx' | 'html' | 'astro' | 'svelte'

export interface Options {
  include?: FilterPattern
  exclude?: FilterPattern
  isRem?: boolean
  debug?: boolean
  collectClasses?: boolean
  outputPath?: string
  skipIfNoChanges?: boolean // 新增：如果没有变化则跳过生成
}
