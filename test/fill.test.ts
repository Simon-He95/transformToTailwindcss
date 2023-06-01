import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('fill', () => {
  it('fill: #312e81;', () => {
    expect(toTailwindcss('fill: #312e81;')).toBe('fill-[#312e81]')
  })

  it('fill: transparent;', () => {
    expect(toTailwindcss('fill: transparent;')).toBe('fill-transparent')
  })

  it('fill: none;', () => {
    expect(toTailwindcss('fill: none;')).toBe('fill-none')
  })
})
