import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('stroke', () => {
  it('stroke: #312e81;', () => {
    expect(toTailwindcss('stroke: #312e81;')).toBe('stroke-[#312e81]')
  })

  it('stroke: transparent;', () => {
    expect(toTailwindcss('stroke: transparent;')).toBe('stroke-transparent')
  })

  it('stroke: none;', () => {
    expect(toTailwindcss('stroke: none;')).toBe('stroke-none')
  })

  it('stroke-width: 0;', () => {
    expect(toTailwindcss('stroke-width: 0;')).toBe('stroke-0')
  })
})
