import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('align', () => {
  it('align-items: flex-start;', () => {
    expect(toTailwindcss('align-items: flex-start;')).toBe('items-start')
  })

  it('align-content: flex-start;', () => {
    expect(toTailwindcss('align-content: flex-start;')).toBe(
      'content-start',
    )
  })

  it('align-self: center;', () => {
    expect(toTailwindcss('align-self: center;')).toBe('self-center')
  })

  it('align-self: flex-start;', () => {
    expect(toTailwindcss('align-self: flex-start;')).toBe('self-start')
  })
})
