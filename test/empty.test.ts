import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('empty', () => {
  it('empty-cells: show;', () => {
    expect(toTailwindcss('empty-cells: show;')).toBe(
      'table-empty-cells-visible',
    )
  })

  it('empty-cells: hide;', () => {
    expect(toTailwindcss('empty-cells: hide;')).toBe('table-empty-cells-hidden')
  })
})
