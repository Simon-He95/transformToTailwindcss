import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('opacity', () => {
  it('opacity: 0.5', () => {
    expect(toTailwindcss('opacity: 0.5')).toBe('op-50')
  })

  it('opacity: 0', () => {
    expect(toTailwindcss('opacity: 0')).toBe('op-0')
  })

  it('opacity: 1', () => {
    expect(toTailwindcss('opacity: 1')).toBe('op-100')
  })

  it('opacity: 50%', () => {
    expect(toTailwindcss('opacity: 50%')).toBe('op-50')
  })

  it('opacity: 100%', () => {
    expect(toTailwindcss('opacity: 100%')).toBe('op-100')
  })

  it('opacity: 0%', () => {
    expect(toTailwindcss('opacity: 0%')).toBe('op-0')
  })
})
