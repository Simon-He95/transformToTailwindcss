import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'
describe('text', () => {
  it('text-left', () => {
    expect(toTailwindcss('text-align:left')).toBe('text-left')
  })

  it('text-right', () => {
    expect(toTailwindcss('text-align:right')).toBe('text-right')
  })
  it('text-center', () => {
    expect(toTailwindcss('text-align:center')).toBe('text-center')
  })

  it('text-ellipsis', () => {
    expect(toTailwindcss('text-overflow: ellipsis;')).toBe('text-ellipsis')
  })

  it('text-decoration-line: underline;', () => {
    expect(toTailwindcss('text-decoration-line: underline;')).toBe(
      'underline',
    )
  })

  it('text-decoration-line: none;', () => {
    expect(toTailwindcss('text-decoration-line: none;')).toBe(
      'no-underline',
    )
  })

  it('text-decoration-color: inherit;', () => {
    expect(toTailwindcss('text-decoration-color: inherit;')).toBe(
      'decoration-inherit',
    )
  })

  it('text-decoration-color: #000;', () => {
    expect(toTailwindcss('text-decoration-color: #000;')).toBe(
      'decoration-#000',
    )
  })

  it('text-decoration-style: solid;', () => {
    expect(toTailwindcss('text-decoration-style: solid;')).toBe(
      'decoration-solid',
    )
  })

  it('text-decoration-thickness: 1px;', () => {
    expect(toTailwindcss('text-decoration-thickness: 1px;')).toBe(
      'decoration-1px',
    )
  })

  it('text-underline-offset: auto;', () => {
    expect(toTailwindcss('text-underline-offset: auto;')).toBe(
      'underline-offset-auto',
    )
  })

  it('text-transform: uppercase;', () => {
    expect(toTailwindcss('text-transform: uppercase;')).toBe('uppercase')
  })

  it('text-indent: 0px;', () => {
    expect(toTailwindcss('text-indent: 0px;')).toBe('indent-0px')
  })
})
