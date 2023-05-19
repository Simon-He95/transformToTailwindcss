import { toTailwindcss } from './toTailwindcss'

export function transformStyleToTailwindcss(
  styles: string,
): [string, string[]] {
  // 如果存在未能被转换的style应该返回并保持部分的style
  const noTransfer: string[] = []
  return [
    styles
      .split(';')
      .filter(Boolean)
      .reduce((result, cur) => {
        const val = toTailwindcss(cur) || ''
        if (!val)
          noTransfer.push(cur)
        return (result += `${val} `)
      }, '')
      .trim(),
    noTransfer,
  ]
}
