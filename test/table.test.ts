import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('table', () => {
  it('table-layout: auto;', () => {
    expect(toTailwindcss('table-layout: auto;')).toBe('table-auto')
  })

  it('table-layout: fixed;', () => {
    expect(toTailwindcss('table-layout: fixed;')).toBe('table-fixed')
  })
})
