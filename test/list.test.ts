import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('list', () => {
  it('list-style-type: unset;', () => {
    expect(toTailwindcss('list-style-type: unset;')).toMatchInlineSnapshot(
      '"list-unset"',
    )
  })
  it('list-style-position: outside;', () => {
    expect(
      toTailwindcss('list-style-position: outside;'),
    ).toMatchInlineSnapshot('"list-outside"')
  })
})
