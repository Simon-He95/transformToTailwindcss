import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('user', () => {
  it('user-select: none;', () => {
    expect(toTailwindcss('user-select: none;')).toBe('select-none')
  })

  it('user-select: text;', () => {
    expect(toTailwindcss('user-select: text;')).toBe('select-text')
  })

  it('user-select: all;', () => {
    expect(toTailwindcss('user-select: all;')).toBe('select-all')
  })

  it('user-select: auto;', () => {
    expect(toTailwindcss('user-select: auto;')).toBe('select-auto')
  })
})
