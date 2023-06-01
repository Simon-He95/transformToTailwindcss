import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('word-break', () => {
  it('word-break: normal;', () => {
    expect(toTailwindcss('word-break: normal;')).toBe('break-normal')
  })

  it('word-break: break-all;', () => {
    expect(toTailwindcss('word-break: break-all;')).toBe('break-all')
  })

  it('word-break: keep-all;', () => {
    expect(toTailwindcss('word-break: keep-all;')).toBe('break-keep')
  })

  it('word-spacing: 0em;', () => {
    expect(toTailwindcss('word-spacing: 0em;')).toBe('word-spacing-[0em]')
  })
})
