import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'
describe('position', () => {
  it('position:absolute', () => {
    expect(toTailwindcss('position:absolute')).toBe('absolute')
  })

  it('position:fixed', () => {
    expect(toTailwindcss('position:fixed')).toBe('fixed')
  })

  it('position:relative', () => {
    expect(toTailwindcss('position:relative')).toBe('relative')
  })

  it('position:sticky', () => {
    expect(toTailwindcss('position:sticky')).toBe('sticky')
  })

  it('position:static', () => {
    expect(toTailwindcss('position:static')).toBe('static')
  })
})
