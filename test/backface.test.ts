import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('backface', () => {
  it('backface-visibility: hidden;', () => {
    expect(toTailwindcss('backface-visibility: hidden;')).toBe('backface-hidden')
  })

  it('backface-visibility: revert-layer;', () => {
    expect(toTailwindcss('backface-visibility: revert-layer;')).toBe('backface-revert-layer')
  })
})
