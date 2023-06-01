import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'
describe('border', () => {
  it('red;', () => {
    expect(toTailwindcss('border-color:red;')).toBe('border-red')
  })

  it('border;', () => {
    expect(toTailwindcss('border: 2px solid rgba(255, 62, 0, 0);')).toBe(
      'border-[2px_solid_rgba(255,62,0,0)]',
    )
  })

  it('radius', () => {
    expect(toTailwindcss('border-radius: 0.25rem;')).toBe('rounded-[0.25rem]')
  })

  it('border-width', () => {
    expect(toTailwindcss('border-width: 2px;')).toBe('border-[2px]')
  })

  it('radius-calc', () => {
    expect(toTailwindcss('border-radius: calc(100% - 20px)')).toBe(
      'rounded-[calc(100%-20px)]',
    )
  })

  it('border-radius: 10px 20px 30px 40px', () => {
    expect(toTailwindcss('border-radius: 10px 20px 30px 40px;')).toBe(
      'rounded-[10px_20px_30px_40px]',
    )
  })

  it('style', () => {
    expect(toTailwindcss('border-style: inset;')).toBe('border-inset')
  })

  it('collapse', () => {
    expect(toTailwindcss('border-collapse: collapse;')).toBe('border-collapse')
  })

  it('spacing', () => {
    expect(toTailwindcss('border-spacing: 0px 0px;')).toBe(
      'border-spacing-[0px_0px]',
    )
  })

  it('border-bottom-width: 1px;', () => {
    expect(toTailwindcss('border-bottom-width: 1px;')).toBe('border-b-[1px]')
  })

  it('border-bottom-style: dashed;', () => {
    expect(toTailwindcss('border-bottom-style: dashed;')).toBe(
      'border-b-dashed',
    )
  })

  it('border-left-color: #333;', () => {
    expect(toTailwindcss('border-left-color: #333;')).toBe('border-l-[#333]')
  })
})
