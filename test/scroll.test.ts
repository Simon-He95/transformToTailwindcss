import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('scroll', () => {
  it('scroll-behavior: auto;', () => {
    expect(toTailwindcss('scroll-behavior: auto;')).toBe('scroll-auto')
  })

  it('scroll-behavior: smooth;', () => {
    expect(toTailwindcss('scroll-behavior: smooth;')).toBe('scroll-smooth')
  })

  it('scroll-margin: 0px;', () => {
    expect(toTailwindcss('scroll-margin: 0px;')).toBe('scroll-m-0px')
  })

  it('scroll-margin-top: 0px;', () => {
    expect(toTailwindcss('scroll-margin-top: 0px;')).toBe('scroll-mt-0px')
  })

  it('scroll-padding: 0px;', () => {
    expect(toTailwindcss('scroll-padding: 0px;')).toBe('scroll-p-0px')
  })

  it('scroll-padding-top: 0px;', () => {
    expect(toTailwindcss('scroll-padding-top: 0px;')).toBe('scroll-pt-0px')
  })

  it('scroll-snap-align: start;', () => {
    expect(toTailwindcss('scroll-snap-align: start;')).toBe('snap-start')
  })

  it('scroll-snap-stop: normal;', () => {
    expect(toTailwindcss('scroll-snap-stop: normal;')).toBe('snap-normal')
  })

  it('scroll-snap-type: none;', () => {
    expect(toTailwindcss('scroll-snap-type: none;')).toBe('snap-none')
  })
})
