import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('appearance', () => {
  it('appearance: none;', () => {
    expect(toTailwindcss('appearance: none;')).toBe('appearance-none')
  })
})
