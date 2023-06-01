import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'
describe('filter', () => {
  it('blur 0', () => {
    expect(toTailwindcss('filter: blur(0);')).toBe('blur-0')
  })

  it('blur px', () => {
    expect(toTailwindcss('filter: blur(10px);')).toBe('blur-[10px]')
  })

  it('brightness', () => {
    expect(toTailwindcss('filter: brightness(.5);')).toBe('brightness-50')
  })

  it('contrast', () => {
    expect(toTailwindcss('filter: contrast(.5);')).toBe('contrast-50')
  })

  it('drop-shadow', () => {
    expect(
      toTailwindcss('filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.05));'),
    ).toBe('drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]')
  })

  it('grayscale 0.1', () => {
    expect(toTailwindcss('filter: grayscale(0.1);')).toBe('grayscale-10')
  })

  it('grayscale %', () => {
    expect(toTailwindcss('filter: grayscale(10%);')).toBe('grayscale-10')
  })
  it('hue', () => {
    expect(toTailwindcss('filter: hue-rotate(0deg);')).toBe('hue-rotate-0')
  })
  it('invert', () => {
    expect(toTailwindcss('filter: invert(0.1);')).toBe('invert-10')
  })

  it('saturate', () => {
    expect(toTailwindcss('filter: saturate(0);')).toBe('saturate-0')
  })

  it('sepia', () => {
    expect(toTailwindcss('filter: sepia(0);')).toBe('sepia-0')
  })
})
