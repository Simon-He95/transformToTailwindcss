import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('flex', () => {
  it('flex: none;', () => {
    expect(toTailwindcss('flex: none;')).toBe('flex-none')
  })

  it('flex-direction: column-reverse;', () => {
    expect(toTailwindcss('flex-direction: column-reverse;')).toBe(
      'flex-col-reverse',
    )
  })

  it('flex-direction: column;', () => {
    expect(toTailwindcss('flex-direction: column;')).toBe('flex-col')
  })

  it('flex-direction: column-reverse;', () => {
    expect(toTailwindcss('flex-direction: column-reverse;')).toBe(
      'flex-col-reverse',
    )
  })

  it('flex-grow: 1;', () => {
    expect(toTailwindcss('flex-grow: 1;')).toBe('grow-1')
  })

  it('flex-grow: 1;', () => {
    expect(toTailwindcss('flex: 1;')).toBe('flex-1')
  })

  it('flex-shrink: 1;', () => {
    expect(toTailwindcss('flex-shrink: 1;')).toBe('shrink')
  })

  it('flex-basis: 0px;', () => {
    expect(toTailwindcss('flex-basis: 0px;')).toBe('basis-0px')
  })

  it('flex-direction: row-reverse;', () => {
    expect(toTailwindcss('flex-direction: row-reverse;')).toBe(
      'flex-row-reverse',
    )
  })

  it('flex-wrap: wrap-reverse;', () => {
    expect(toTailwindcss('flex-wrap: wrap-reverse;')).toBe('flex-wrap-reverse')
  })

  it('flex: 1 1 0%;', () => {
    expect(toTailwindcss('flex: 1 1 0%;')).toBe('flex-[1_1_0%]')
  })

  it('flex: 1 1 auto;', () => {
    expect(toTailwindcss('flex: 1 1 auto;')).toBe('flex-[1_1_auto]')
  })
})
