import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('letter', () => {
  it('px', () => {
    expect(toTailwindcss('letter-spacing: -5px;')).toBe('tracking--5px')
  })
  it('em', () => {
    expect(toTailwindcss('letter-spacing: -5em;')).toBe('tracking--5em')
  })
  it('rem', () => {
    expect(toTailwindcss('width:10rem')).toMatchInlineSnapshot('"w-[10rem]"')
  })
  it('max-content', () => {
    expect(toTailwindcss('width: max-content')).toMatchInlineSnapshot('"w-max"')
  })
  it('min-content', () => {
    expect(toTailwindcss('width: min-content')).toMatchInlineSnapshot('"w-min"')
  })
  it('fit-content', () => {
    expect(toTailwindcss('width:fit-content')).toBe('w-fit')
  })
  it('auto', () => {
    expect(toTailwindcss('width:auto')).toBe('w-auto')
  })
  it('calc', () => {
    expect(toTailwindcss('width:calc(100% - 50px)')).toBe('w-[calc(100%-50px)]')
  })
  it('calc not space', () => {
    expect(toTailwindcss('width:calc(100%-50px)')).toBe('w-[calc(100%-50px)]')
  })

  it('calc space', () => {
    expect(toTailwindcss('width:calc(100%  -  50px)')).toBe(
      'w-[calc(100%-50px)]',
    )
  })

  it('min-width: 0px;', () => {
    expect(toTailwindcss('min-width: 0px;')).toBe('min-w-[0px]')
  })

  it('min-width: 0px;', () => {
    expect(toTailwindcss('min-width: 100%;;')).toBe('min-w-[100%]')
  })
  it('max-width: 0px;', () => {
    expect(toTailwindcss('max-width: 0px;')).toBe('max-w-[0px]')
  })
  it('max-width: 0px;', () => {
    expect(toTailwindcss('max-width: max-content;')).toBe('max-w-max')
  })
})
