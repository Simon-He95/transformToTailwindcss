import { describe, expect, it } from 'vitest'
import { transformStyleToTailwindcss } from '../src/transformStyleToTailwindcss'

describe.skip('transformStyleToTailwindcss', () => {
  it('transformStyleToTailwindcss', () => {
    expect(
      transformStyleToTailwindcss(
        'transform-origin: center;background:red;width:100%;height:30px',
      )[0],
    ).toBe('origin-center bg-red w-[100%] h-30px')
  })
})
