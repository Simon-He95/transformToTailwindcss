import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('will', () => {
  it('will-change: auto;', () => {
    expect(toTailwindcss('will-change: auto;')).toBe('will-change-auto')
  })

  it('will-change: scroll-position;', () => {
    expect(toTailwindcss('will-change: scroll-position;')).toBe(
      'will-change-scroll',
    )
  })

  it('will-change: contents;', () => {
    expect(toTailwindcss('will-change: contents;')).toBe(
      'will-change-contents',
    )
  })

  it('will-change: transform;', () => {
    expect(toTailwindcss('will-change: transform;')).toBe(
      'will-change-transform',
    )
  })
})
