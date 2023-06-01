import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('transform', () => {
  it('transform-origin:center', () => {
    expect(toTailwindcss('transform-origin: center;')).toBe('origin-center')
  })

  it('transform-origin: top right;', () => {
    expect(toTailwindcss('transform-origin: top right;')).toBe(
      'origin-top-right',
    )
  })

  it('transform: scale(0);', () => {
    expect(toTailwindcss('transform: scale(.5);')).toBe('scale-50')
  })

  it('transform: scaleX(0);', () => {
    expect(toTailwindcss('transform: scaleX( 0.5 );')).toBe('scale-x-50')
  })

  it('transform: rotate(0deg);', () => {
    expect(toTailwindcss('transform: rotate( 0deg );')).toBe(
      'rotate-x-[0deg] rotate-y-[0deg]',
    )
  })

  it('transform: translateX(1px);', () => {
    expect(toTailwindcss('transform: translateX(1px);')).toBe(
      'translate-x-[1px]',
    )
  })

  it('transform: translateX(1px);', () => {
    expect(toTailwindcss('transform: translateX(1px);')).toBe(
      'translate-x-[1px]',
    )
  })

  it('transform: translateX(10%);', () => {
    expect(toTailwindcss('transform: translateX(10%);')).toBe(
      'translate-x-[10%]',
    )
  })
  it('transform: ranslate(10%, 20%);', () => {
    expect(toTailwindcss('transform: translate(10%, 20%);')).toBe(
      'translate-x-[10%] translate-y-[20%]',
    )
  })

  it('transform: skewX(2deg);', () => {
    expect(toTailwindcss('transform: skewX(2deg);')).toBe('skew-x-[2deg]')
  })

  it('transform: skew(50deg)', () => {
    expect(toTailwindcss('transform: skew(50deg);')).toBe(
      'skew-x-[50deg] skew-y-[50deg]',
    )
  })

  it('transform: scale(0.6)', () => {
    expect(toTailwindcss('transform: scale(0.6);')).toBe('scale-60')
  })

  it('transform: scale(0.8, 0.9)', () => {
    expect(toTailwindcss('transform: scale(0.8, 0.9)')).toBe('scale-[0.8_0.9]')
  })

  it('transform: translate(-26px, 16px) skew(50deg) scaleY(0.6);', () => {
    expect(
      toTailwindcss(
        'transform: translate(-26px, 16px) skew(50deg) scaleY(0.6)',
      ),
    ).toBe(
      'translate-x-[-26px] translate-y-[16px] skew-x-[50deg] skew-y-[50deg] scale-y-60',
    )
  })
})
