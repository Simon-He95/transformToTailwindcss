import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('column', () => {
  it('columns: 1;', () => {
    expect(toTailwindcss('columns: 1;')).toBe('columns-1')
  })

  it('columns: auto;', () => {
    expect(toTailwindcss('columns: auto;')).toBe('columns-auto')
  })

  it('columns: 20rem;', () => {
    expect(toTailwindcss('columns: 20rem;')).toBe('columns-[20rem]')
  })

  it('column-gap: 0px;', () => {
    expect(toTailwindcss('column-gap: 0px;')).toBe('gap-x-[0px]')
  })
})
