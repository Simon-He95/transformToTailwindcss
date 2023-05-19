import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('whitespace', () => {
  it('white-space: normal;', () => {
    expect(toTailwindcss('white-space: normal;')).toBe('whitespace-normal')
  })

  it('white-space: pre-wrap;', () => {
    expect(toTailwindcss('white-space: pre-wrap;')).toBe(
      'whitespace-pre-wrap',
    )
  })
})
