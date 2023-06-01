import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('align', () => {
  it('gap: 0px;', () => {
    expect(toTailwindcss('gap: 0px;')).toBe('gap-[0px]')
  })

  it('column-gap: 0px;', () => {
    expect(toTailwindcss('column-gap: 0px;')).toBe('gap-x-[0px]')
  })

  it('gap: 0.125rem;', () => {
    expect(toTailwindcss('gap: 0.125rem;')).toBe('gap-[0.125rem]')
  })

  it('row-gap: 0.125rem;', () => {
    expect(toTailwindcss('row-gap: 0.125rem;')).toBe('gap-y-[0.125rem]')
  })
})
