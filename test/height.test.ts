import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('height', () => {
  it('px', () => {
    expect(toTailwindcss('height:10px')).toMatchInlineSnapshot('"h-[10px]"')
  })
  it('em', () => {
    expect(toTailwindcss('height:10em')).toMatchInlineSnapshot('"h-[10em]"')
  })
  it('rem', () => {
    expect(toTailwindcss('height:10rem')).toMatchInlineSnapshot('"h-[10rem]"')
  })
  it('max-content', () => {
    expect(toTailwindcss('height: max-content')).toMatchInlineSnapshot(
      '"h-max"',
    )
  })
  it('min-content', () => {
    expect(toTailwindcss('height: min-content')).toMatchInlineSnapshot(
      '"h-min"',
    )
  })
  it('fit-content', () => {
    expect(toTailwindcss(' height:fit-content')).toBe('h-fit')
  })
  it('auto', () => {
    expect(toTailwindcss(' height:auto')).toBe('h-auto')
  })
  it('calc', () => {
    expect(toTailwindcss(' height:calc(100% - 50px)')).toBe(
      'h-[calc(100%-50px)]',
    )
  })
  it('calc not space', () => {
    expect(toTailwindcss(' height:calc(100%-50px)')).toBe('h-[calc(100%-50px)]')
  })

  it('calc space', () => {
    expect(toTailwindcss(' height:calc(100%  -  50px)')).toBe(
      'h-[calc(100%-50px)]',
    )
  })

  it('min-height: 0px;', () => {
    expect(toTailwindcss('min-height: 0px;')).toBe('min-h-[0px]')
  })

  it('min-height: 0px;', () => {
    expect(toTailwindcss('min-height: 100%;;')).toBe('min-h-[100%]')
  })
  it('max-height: 0px;', () => {
    expect(toTailwindcss('max-height: 0px;')).toBe('max-h-[0px]')
  })
  it('max-height: 0px;', () => {
    expect(toTailwindcss('max-height: max-content;')).toBe('max-h-max')
  })
})
