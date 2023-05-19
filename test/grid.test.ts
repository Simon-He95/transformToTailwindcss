import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('grid', () => {
  it('grid-column: auto;', () => {
    expect(toTailwindcss('grid-column: auto;')).toBe('col-auto')
  })

  it('grid-column: span 1 / span 1;', () => {
    expect(toTailwindcss('grid-column: span 2 / span 2;')).toBe(
      'col-span-2',
    )
  })

  it('grid-column: 1 / -1;', () => {
    expect(toTailwindcss('grid-column: 1 / -1;')).toBe('col-span-full')
  })

  it('grid-column-start: 1;', () => {
    expect(toTailwindcss('grid-column-start: 1;')).toBe('col-start-1')
  })

  it('grid-column-end: auto;', () => {
    expect(toTailwindcss('grid-column-end: auto;')).toBe('col-end-auto')
  })

  it('grid-template-rows: repeat(1, minmax(0, 1fr));', () => {
    expect(
      toTailwindcss('grid-template-rows: repeat(1, minmax(0, 1fr));'),
    ).toBe('grid-rows-1')
  })

  it('grid-template-rows: none;', () => {
    expect(toTailwindcss('grid-template-rows: none;')).toBe(
      'grid-rows-none',
    )
  })

  it('grid-row: auto;', () => {
    expect(toTailwindcss('grid-row: auto;')).toBe('row-auto')
  })

  it('grid-row: span 1 / span 1;', () => {
    expect(toTailwindcss('grid-row: span 1 / span 1;')).toBe('row-span-1')
  })

  it('grid-row: 1 / -1;', () => {
    expect(toTailwindcss('grid-row: 1 / -1;')).toBe('row-span-full')
  })

  it('grid-row-start: 1;', () => {
    expect(toTailwindcss('grid-row-start: 1;')).toBe('row-start-1')
  })

  it('grid-auto-flow: row;', () => {
    expect(toTailwindcss('grid-auto-flow: row;')).toBe('grid-flow-row')
  })

  it('grid-auto-flow: column;', () => {
    expect(toTailwindcss('grid-auto-flow: column;')).toBe('grid-flow-col')
  })

  it('grid-auto-flow: column dense;', () => {
    expect(toTailwindcss('grid-auto-flow: column dense;')).toBe(
      'grid-flow-col-dense',
    )
  })

  it('grid-auto-flow: row dense;', () => {
    expect(toTailwindcss('grid-auto-flow: row dense;')).toBe(
      'grid-flow-row-dense',
    )
  })

  it('grid-auto-columns: auto;', () => {
    expect(toTailwindcss('grid-auto-columns: auto;')).toBe('auto-cols-auto')
  })

  it('grid-auto-columns: min-content;', () => {
    expect(toTailwindcss('grid-auto-columns: min-content;')).toBe(
      'auto-cols-min',
    )
  })

  it('grid-auto-columns: minmax(0, 1fr);', () => {
    expect(toTailwindcss('grid-auto-columns: minmax(0, 1fr);')).toBe(
      'auto-cols-fr',
    )
  })

  it('grid-auto-rows: auto;', () => {
    expect(toTailwindcss('grid-auto-rows: auto;')).toBe('auto-rows-auto')
  })

  it('grid-auto-rows: min-content;', () => {
    expect(toTailwindcss('grid-auto-rows: min-content;')).toBe(
      'auto-rows-min',
    )
  })

  it('grid-auto-rows: minmax(0, 1fr);', () => {
    expect(toTailwindcss('grid-auto-rows: minmax(0, 1fr);')).toBe(
      'auto-rows-fr',
    )
  })
})
