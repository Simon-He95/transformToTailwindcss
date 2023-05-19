import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'
describe('vertical', () => {
  it('v-text-bottom', () => {
    expect(toTailwindcss('vertical-align: text-bottom;')).toBe(
      'v-text-bottom',
    )
  })
})
