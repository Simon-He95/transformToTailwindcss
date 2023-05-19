import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('visibility', () => {
  it('visibility: visible;', () => {
    expect(toTailwindcss('visibility: visible;')).toBe('visible')
  })

  it('visibility: hidden;', () => {
    expect(toTailwindcss('visibility: hidden;')).toBe('invisible')
  })

  it('visibility: collapse;', () => {
    expect(toTailwindcss('visibility: collapse;')).toBe('collapse')
  })
})
