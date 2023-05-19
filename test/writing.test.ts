import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('writing', () => {
  it('writing-mode: unset;', () => {
    expect(toTailwindcss('writing-mode: unset;')).toBe(
      'write-unset',
    )
  })

  it('writing-mode: vertical-rl;', () => {
    expect(toTailwindcss('writing-mode: vertical-rl;')).toBe('write-vertical-right')
  })
})
