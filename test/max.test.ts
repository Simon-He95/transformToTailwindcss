import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('position', () => {
  it('max-width:50px', () => {
    expect(toTailwindcss('max-width:50px')).toBe('max-w-[50px]')
  })

  it('max-width:max-content', () => {
    expect(toTailwindcss('max-width:max-content')).toBe('max-w-max')
  })

  it('max-height:50px', () => {
    expect(toTailwindcss('max-height:50px')).toBe('max-h-[50px]')
  })

  it('max-height:max-content', () => {
    expect(toTailwindcss('max-height:max-content')).toBe('max-h-max')
  })
})
