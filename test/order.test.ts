import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('order', () => {
  it('align-items: flex-start;', () => {
    expect(toTailwindcss('order: 8;')).toBe('order-8')
  })

  it('align-content: flex-start;', () => {
    expect(toTailwindcss('order: -9999;')).toBe('order--9999')
  })

  it('align-self: center;', () => {
    expect(toTailwindcss('order: 0;')).toBe('order-0')
  })
})
