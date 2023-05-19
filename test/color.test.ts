import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'
describe('color', () => {
  it('color:red', () => {
    expect(toTailwindcss('color: red')).toBe('text-red')
  })

  it('color:hex', () => {
    expect(toTailwindcss('color: #ffffff')).toBe('text-[#ffffff]')
  })
  // size
  it('color:rgb', () => {
    expect(toTailwindcss('color:rgb(255, 255, 255)')).toBe(
      'text-[rgb(255,255,255)]',
    )
  })

  it('color:rgba', () => {
    expect(toTailwindcss('color:rgba(255, 255, 255,0.1)')).toBe(
      'text-[rgba(255,255,255,0.1)]',
    )
  })
})
