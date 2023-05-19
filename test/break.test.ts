import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('break', () => {
  it('break-inside: auto;', () => {
    expect(toTailwindcss('break-inside: auto;')).toBe('break-inside-auto')
  })

  it('break-inside: avoid-page;', () => {
    expect(toTailwindcss('break-inside: avoid-page;')).toBe(
      'break-inside-avoid-page',
    )
  })

  it('break-before: avoid-page;', () => {
    expect(toTailwindcss('break-before: avoid-page;')).toBe(
      'break-before-avoid-page',
    )
  })

  it('break-inside: avoid-column;', () => {
    expect(toTailwindcss('break-inside: avoid-column;')).toBe(
      'break-inside-avoid-column',
    )
  })
})
