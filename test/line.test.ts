import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'
describe('line-height', () => {
  it('rem;', () => {
    expect(toTailwindcss('line-height: 0.25rem;')).toBe('lh-0.25rem')
  })

  it('px', () => {
    expect(toTailwindcss('line-height: 20px;')).toBe('lh-20px')
  })
  it('em', () => {
    expect(toTailwindcss('line-height: 20em;')).toBe('lh-20em')
  })

  it('calc', () => {
    expect(toTailwindcss('line-height: calc(100% - 20px);')).toBe(
      'lh-[calc(100%-20px)]',
    )
  })
})
