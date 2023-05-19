import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('animation', () => {
  it('animation-delay: 2s;', () => {
    expect(toTailwindcss('animation-delay:2s;')).toBe('animate-2s')
  })

  it('animation: revert;', () => {
    expect(toTailwindcss('animation: revert;')).toBe('animate-revert')
  })

  it('animation-play-state: paused;', () => {
    expect(toTailwindcss('animation-play-state: paused;')).toBe('animate-paused')
  })

  it('animation-direction: reverse;', () => {
    expect(toTailwindcss(' animation-direction: reverse;')).toBe('animate-reverse')
  })

  it('animation-fill-mode: forwards;', () => {
    expect(toTailwindcss('animation-fill-mode: forwards;')).toBe('animate-forwards')
  })

  it('animation: back-in-down 1s linear 1;', () => {
    expect(toTailwindcss('animation: back-in-down 1s linear 1;')).toBe('animate-back-in-down')
  })
})
