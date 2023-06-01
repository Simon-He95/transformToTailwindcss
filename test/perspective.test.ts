import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('perspective', () => {
  it('px;', () => {
    expect(toTailwindcss('perspective: 300px')).toBe('perspective-[300px]')
  })

  it('rem', () => {
    expect(toTailwindcss('perspective: 10rem')).toBe('perspective-[10rem]')
  })

  it('important', () => {
    expect(toTailwindcss('perspective: 2em !important')).toBe(
      '!perspective-[2em]',
    )
  })
})
