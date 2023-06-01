import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('padding', () => {
  it('padding:50px', () => {
    expect(toTailwindcss('padding:50px')).toBe('p-[50px]')
  })
  it('padding:50px 30px', () => {
    expect(toTailwindcss('padding:50px 30px')).toBe('px-[30px] py-[50px]')
  })
  it('padding:50px 30px 20px', () => {
    expect(toTailwindcss('padding:50px 30px 20px')).toBe(
      'px-[30px] pt-[50px] pb-[20px]',
    )
  })
  it('padding:50px 30px 20px 40px', () => {
    expect(toTailwindcss('padding:50px 30px 20px 40px')).toBe(
      'pt-[50px] pb-[20px] pl-[40px] pr-[30px]',
    )
  })
})

describe('padding-left', () => {
  it('padding-left:50px', () => {
    expect(toTailwindcss('padding-left:50px')).toBe('pl-[50px]')
  })
})

describe('padding-right', () => {
  it('padding-right:50px', () => {
    expect(toTailwindcss('padding-right:50px')).toBe('pr-[50px]')
  })
})

describe('padding-top', () => {
  it('padding-top:50px', () => {
    expect(toTailwindcss('padding-top:50px')).toBe('pt-[50px]')
  })
})

describe('padding-bottom', () => {
  it('padding-bottom:50px', () => {
    expect(toTailwindcss('padding-bottom:50px')).toBe('pb-[50px]')
  })
})
