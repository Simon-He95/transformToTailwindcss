import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'
describe('top', () => {
  it('rem;', () => {
    expect(toTailwindcss('top: 0.25rem;')).toBe('top-[0.25rem]')
  })

  it('px', () => {
    expect(toTailwindcss('top: 20px;')).toBe('top-[20px]')
  })
  it('em', () => {
    expect(toTailwindcss('top: 20em;')).toBe('top-[20em]')
  })

  it('calc', () => {
    expect(toTailwindcss('top: calc(100% - 20px);')).toBe(
      'top-[calc(100%-20px)]',
    )
  })
})
