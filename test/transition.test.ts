import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('transition', () => {
  it('transition: background-color 0.5s ease-in;', () => {
    expect(
      toTailwindcss('transition: background-color 0.5s 1.5s ease-in;'),
    ).toBe('transition-colors duration-500 delay-1500 ease-in')
  })

  it('transition: none;', () => {
    expect(toTailwindcss('transition: none;')).toBe('transition-none')
  })

  it('transition-property: all;', () => {
    expect(toTailwindcss('transition-property: all;')).toBe('transition-all')
  })

  it('transition-property: box-shadow;', () => {
    expect(toTailwindcss('transition-property: box-shadow;')).toBe(
      'transition-shadow',
    )
  })

  it('transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;', () => {
    expect(
      toTailwindcss(
        'transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;',
      ),
    ).toBe('transition-color')
  })

  it('transition-duration: 75ms;', () => {
    expect(toTailwindcss('transition-duration: 75ms;')).toBe('duration-75')
  })

  it('transition-delay: 75ms;', () => {
    expect(toTailwindcss('transition-delay: 75ms;')).toBe('delay-75')
  })

  it('transition-timing-function: linear', () => {
    expect(toTailwindcss('transition-timing-function: linear')).toBe(
      'ease-linear',
    )
  })

  it('transition-timing-function: cubic-bezier(0.4, 0, 1, 1);', () => {
    expect(
      toTailwindcss('transition-timing-function: cubic-bezier(0.4, 0, 1, 1);'),
    ).toBe('ease-[cubic-bezier(0.4,0,1,1)]')
  })

  it('transition: margin-left 28s;', () => {
    expect(toTailwindcss('transition: margin-left 2s;')).toBe(
      'transition-margin-left duration-2000',
    )
  })
})
