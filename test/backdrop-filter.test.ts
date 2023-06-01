import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'
describe('backdrop-filter', () => {
  it('blur 0', () => {
    expect(toTailwindcss('backdrop-filter: blur(0);')).toBe('backdrop-blur-0')
  })

  it('blur px', () => {
    expect(toTailwindcss('backdrop-filter: blur(10px);')).toBe(
      'backdrop-blur-[10px]',
    )
  })

  it('brightness', () => {
    expect(toTailwindcss('backdrop-filter: brightness(.5);')).toBe(
      'backdrop-brightness-50',
    )
  })

  it('contrast', () => {
    expect(toTailwindcss('backdrop-filter: contrast(.5);')).toBe(
      'backdrop-contrast-50',
    )
  })

  it('grayscale 0.1', () => {
    expect(toTailwindcss('backdrop-filter: grayscale(0.1);')).toBe(
      'backdrop-grayscale-10',
    )
  })

  it('grayscale %', () => {
    expect(toTailwindcss('backdrop-filter: grayscale(10%);')).toBe(
      'backdrop-grayscale-10',
    )
  })
  it('hue', () => {
    expect(toTailwindcss('backdrop-filter: hue-rotate(0deg);')).toBe(
      'backdrop-hue-rotate-0',
    )
  })
  it('invert', () => {
    expect(toTailwindcss('backdrop-filter: invert(0.1);')).toBe(
      'backdrop-invert-10',
    )
  })

  it('opacity', () => {
    expect(toTailwindcss('backdrop-filter: opacity(0);')).toBe(
      'backdrop-opacity-0',
    )
  })

  it('saturate', () => {
    expect(toTailwindcss('backdrop-filter: saturate(0);')).toBe(
      'backdrop-saturate-0',
    )
  })

  it('sepia', () => {
    expect(toTailwindcss('backdrop-filter: sepia(0);')).toBe('backdrop-sepia-0')
  })
})
