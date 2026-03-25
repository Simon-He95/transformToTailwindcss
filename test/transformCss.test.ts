import { describe, expect, it } from 'vitest'
import { splitCssDeclaration } from '../src/transformCss'

describe('splitCssDeclaration', () => {
  it('keeps https urls intact', () => {
    expect(splitCssDeclaration('background:url(https://xxx.png)')).toEqual([
      'background',
      'url(https://xxx.png)',
    ])
  })

  it('returns undefined when no separator exists', () => {
    expect(splitCssDeclaration('display')).toEqual(['display', undefined])
  })
})
