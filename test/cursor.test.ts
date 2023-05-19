import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('cursor', () => {
  it('cursor: pointer', () => {
    expect(toTailwindcss('cursor: pointer')).toBe('cursor-pointer')
  })

  it('cursor: default', () => {
    expect(toTailwindcss('cursor: default')).toBe('cursor-default')
  })

  it('cursor: grab', () => {
    expect(toTailwindcss('cursor: grab')).toBe('cursor-grab')
  })

  it('cursor: help', () => {
    expect(toTailwindcss('cursor: help')).toBe('cursor-help')
  })

  it('cursor: none', () => {
    expect(toTailwindcss('cursor: none')).toBe('cursor-none')
  })

  it('cursor: zoom-in', () => {
    expect(toTailwindcss('cursor: zoom-in')).toBe('cursor-zoom-in')
  })

  it('cursor: url("hyper.cur"), auto;', () => {
    expect(toTailwindcss('cursor: url("hyper.cur"), auto;')).toBe(
      'cursor-[url(hyper.cur),auto]',
    )
  })

  it('cursor: url(hyper.cur), auto;', () => {
    expect(toTailwindcss('cursor: url(hyper.cur), auto;')).toBe(
      'cursor-[url(hyper.cur),auto]',
    )
  })

  it('cursor: not-allowed;', () => {
    expect(toTailwindcss('cursor: not-allowed;')).toBe('cursor-not-allowed')
  })
})
