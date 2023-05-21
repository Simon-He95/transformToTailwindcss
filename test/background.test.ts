import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'
describe('background', () => {
  it('background:red !important', () => {
    expect(toTailwindcss('background:red !important')).toBe('!bg-red')
  })

  it('background:red !important', () => {
    expect(toTailwindcss('background:red center url("./a.jpg")')).toBe(
      'bg-red bg-center bg-[url(./a.jpg)]',
    )
  })

  it('background:rgb(125, 188, 234)', () => {
    expect(toTailwindcss('background:rgb(125, 188, 234) center')).toBe(
      'bg-[rgb(125,188,234)] bg-center',
    )
  })

  it('background:red center no-repeat url("./xxx.jpg")', () => {
    expect(
      toTailwindcss('background:red center no-repeat url("./xxx.jpg")'),
    ).toBe('bg-red bg-center bg-no-repeat bg-[url(./xxx.jpg)]')
  })

  it('background-color:red', () => {
    expect(toTailwindcss('background-color:red')).toBe('bg-red')
  })

  it('background:#67c23a ', () => {
    expect(toTailwindcss('background-color:#67c23a ')).toBe('bg-[#67c23a]')
  })

  it('background:auto', () => {
    expect(toTailwindcss('background:auto')).toBe('bg-auto')
  })
  // size
  it('background-size:auto', () => {
    expect(toTailwindcss('background-size:auto')).toBe('bg-auto')
  })

  it('background-size:cover', () => {
    expect(toTailwindcss('background-size:cover')).toBe('bg-cover')
  })

  it('background-size:contain', () => {
    expect(toTailwindcss('background-size:contain')).toBe('bg-contain')
  })

  // attachments
  it('background-attachments:fixed', () => {
    expect(toTailwindcss('background-attachment:fixed')).toBe('bg-fixed')
  })

  // clip
  it('background-clip:border-box', () => {
    expect(toTailwindcss('background-clip:border-box')).toBe('bg-clip-border')
  })

  it('background-clip:border-box', () => {
    expect(toTailwindcss('background-clip:padding-box')).toBe('bg-clip-padding')
  })

  it('background-clip:test', () => {
    expect(toTailwindcss('background-clip:test')).toBe('bg-clip-test')
  })

  // position
  it('background-position:center', () => {
    expect(toTailwindcss('background-position:center')).toBe('bg-center')
  })

  it('background-position:center center', () => {
    expect(toTailwindcss('background-position:center center')).toBe(
      'bg-center-center',
    )
  })

  // repeats
  it('background-repeat:repeat', () => {
    expect(toTailwindcss('background-repeat:repeat')).toBe('bg-repeat')
  })

  it('background-repeat:no-repeat', () => {
    expect(toTailwindcss('background-repeat:no-repeat')).toBe('bg-no-repeat')
  })

  it('background-repeat:repeat-x', () => {
    expect(toTailwindcss('background-repeat:repeat-x')).toBe('bg-repeat-x')
  })

  it('background-repeat:inherit', () => {
    expect(toTailwindcss('background-repeat:inherit')).toBe('bg-repeat-inherit')
  })

  // origins
  it('background-origin:border-box', () => {
    expect(toTailwindcss('background-origin:border-box')).toBe(
      'bg-origin-border',
    )
  })

  it('background-origin:inherit', () => {
    expect(toTailwindcss('background-origin:inherit')).toBe('bg-origin-inherit')
  })

  // image
  it('background-image:none', () => {
    expect(toTailwindcss('background-image:none')).toBe('bg-none')
  })

  it('background-image:url(\'picture.png\')', () => {
    expect(toTailwindcss('background-image:url(\'picture.png\')')).toBe(
      'bg-[url(picture.png)]',
    )
  })

  it('background: red', () => {
    expect(toTailwindcss('background: red')).toBe('bg-red')
  })

  it('background: url("../aa.jpg")', () => {
    expect(toTailwindcss('background: url("../aa.jpg")')).toBe(
      'bg-[url(../aa.jpg)]',
    )
  })

  it('background-blend-mode: normal;', () => {
    expect(toTailwindcss('background-blend-mode: normal;')).toBe(
      'bg-blend-normal',
    )
  })

  it('background: linear-gradient to top', () => {
    expect(
      toTailwindcss(
        'background: linear-gradient(to top, rgba(255, 255, 255), cyan);',
      ),
    ).toBe('bg-gradient-to-t from-[rgba(255,255,255)] to-cyan')
  })

  it('background: linear-gradient(to left top, black, cyan);', () => {
    expect(
      toTailwindcss('background: linear-gradient(to left top, black, cyan);'),
    ).toBe('bg-gradient-to-lt from-black to-cyan')
  })

  // unocss 支持 to-10% from-10%
  it('background: linear-gradient(to bottom, #00ffff 0%, #0066ff 100%);', () => {
    expect(
      toTailwindcss(
        'background: linear-gradient(to bottom, #00ffff 0%, #0066ff 100%);',
      ),
    ).toBe('bg-gradient-to-b from-#00ffff from-0% to-#0066ff to-100%')
  })

  it('background: linear-gradient(to bottom, #00ffff 0, #0ea5e9 ,#0066ff 100%);', () => {
    expect(
      toTailwindcss(
        'background: linear-gradient(to bottom, #00ffff 0, #0ea5e9 ,#0066ff 100%);',
      ),
    ).toBe(
      'bg-gradient-to-b from-#00ffff from-0 via-#0ea5e9 to-#0066ff to-100%',
    )
  })

  it('background: linear-gradient(to bottom right, #00ffff 0, #0ea5e9 ,#0066ff 100%);', () => {
    expect(
      toTailwindcss(
        'background: linear-gradient(to bottom right, #00ffff 10% , #0ea5e9 20%,#0066ff 50%);',
      ),
    ).toBe(
      'bg-gradient-to-br from-#00ffff from-10% via-#0ea5e9 via-20% to-#0066ff to-50%',
    )
  })

  it('background: linear-gradient(to bottom, #00ffff 0, #0ea5e9 ,#0066ff 100%);', () => {
    expect(
      toTailwindcss(
        'background: linear-gradient(to bottom, #00ffff 0, #0ea5e9 30% ,#0066ff 100%);',
      ),
    ).toBe(
      'bg-gradient-to-b from-#00ffff from-0 via-#0ea5e9 via-30% to-#0066ff to-100%',
    )
  })

  it('background: conic-gradient(#fff 0.25turn, #000 0.25turn 0.5turn, #fff 0.5turn 0.75turn);', () => {
    expect(
      toTailwindcss(
        'background: conic-gradient(#fff 0.25turn, #000 0.25turn 0.5turn, #fff 0.5turn 0.75turn);',
      ),
    ).toBe(
      'bg-gradient-conic from-#fff from-0.25turn via-#000 via-0.25turn to-#fff to-0.5turn',
    )
  })
})
