import type { FilterPattern } from '@rollup/pluginutils'

export type CssType = 'less' | 'scss' | 'css' | 'stylus'

export type SuffixType = 'vue' | 'tsx' | 'html' | 'astro' | 'svelte'

export interface Options {
  include?: FilterPattern
  exclude?: FilterPattern
  isRem?: boolean
  debug?: boolean
}
