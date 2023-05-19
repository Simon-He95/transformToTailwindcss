import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('resize', () => {
  it('resize: none;', () => {
    expect(toTailwindcss('resize: none;')).toBe('resize-none')
  })

  it('resize: vertical;', () => {
    expect(toTailwindcss('resize: vertical;')).toBe('resize-y')
  })

  it('resize: horizontal;', () => {
    expect(toTailwindcss('resize: horizontal;')).toBe('resize-x')
  })

  it('resize: both;', () => {
    expect(toTailwindcss('resize: both;')).toBe('resize')
  })
})
