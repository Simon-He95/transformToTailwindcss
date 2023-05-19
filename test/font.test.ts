import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'
describe('font-size', () => {
  it('rem', () => {
    expect(toTailwindcss('font-size: 1.5rem')).toBe('text-1.5rem')
  })
  it('em', () => {
    expect(toTailwindcss('font-size: 1.25em')).toBe('text-1.25em')
  })
  it('px', () => {
    expect(toTailwindcss('font-size: 10px')).toBe('text-10px')
  })
})

describe('font', () => {
  it('rem', () => {
    expect(toTailwindcss('font: bold 16px/20px;')).toBe(
      'font-bold text-[16px/20px]',
    )
  })
})

describe('font-weight', () => {
  it('100', () => {
    expect(toTailwindcss('font-weight: 100')).toBe('font-100')
  })
  it('bold', () => {
    expect(toTailwindcss('font-weight: bold')).toBe('font-bold')
  })
})

describe('font-style', () => {
  it('italic', () => {
    expect(toTailwindcss('font-style: italic;')).toBe('font-italic')
  })
  it('normal', () => {
    expect(toTailwindcss('font-style: normal;')).toBe('font-not-italic')
  })
})

describe('font-family', () => {
  it('sans', () => {
    expect(
      toTailwindcss(
        'font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";',
      ),
    ).toBe('font-sans')
  })

  it('mono', () => {
    expect(
      toTailwindcss(
        '  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;',
      ),
    ).toBe('font-mono')
  })
})

describe('font-variant-numeric', () => {
  it('normal', () => {
    expect(toTailwindcss('font-variant-numeric: normal;')).toBe('normal-nums')
  })

  it('ordinal', () => {
    expect(toTailwindcss('font-variant-numeric: ordinal;')).toBe('ordinal')
  })
})
