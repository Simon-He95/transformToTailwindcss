import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('caption', () => {
  it('caption-side: top;', () => {
    expect(toTailwindcss('caption-side: top;')).toBe(
      'caption-top',
    )
  })
})
