import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { transformJsx } from '../src/transformJsx'
import { viteTransformToTailwindcss } from '../src/unplugin'

describe('regressions', () => {
  it('keeps css selectors intact when converting JSX class attributes', async () => {
    const dir = await mkdtemp(
      path.join(os.tmpdir(), 'transform-to-tailwindcss-'),
    )
    const cssPath = path.join(dir, 'styles.css')
    const sidecarPath = path.join(dir, 'styles.__unocss_transfer__.css')

    try {
      const filepath = path.join(dir, 'component.tsx')
      const code = `import './styles.css'

export default () => <div className="classification">hello</div>
`

      await writeFile(cssPath, '.classification{text-decoration:none}', 'utf-8')

      const result = await transformJsx(code, { filepath })
      const sidecar = await readFile(sidecarPath, 'utf-8')

      expect(result).toContain('className="classification"')
      expect(sidecar).toContain('.classification{text-decoration:none}')
      expect(sidecar).not.toContain('.classNameification')
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  it('supports html, svelte, and astro files in the vite plugin', async () => {
    const plugin = viteTransformToTailwindcss() as any

    expect(plugin.transformInclude('/tmp/demo.html')).toBe(true)
    expect(plugin.transformInclude('/tmp/demo.svelte')).toBe(true)
    expect(plugin.transformInclude('/tmp/demo.astro')).toBe(true)

    const html = await plugin.transform(
      '<!DOCTYPE html><html><body><div class="red">hello</div></body><style>.red{font-size:10px;}</style></html>',
      '/tmp/demo.html',
    )
    const svelte = await plugin.transform(
      '<div class="red">hello</div><style>.red{font-size:10px;}</style>',
      '/tmp/demo.svelte',
    )
    const astro = await plugin.transform(
      '<div class="red">hello</div><style>.red{font-size:10px;}</style>',
      '/tmp/demo.astro',
    )

    expect(html).toContain('text-[10px]')
    expect(svelte).toContain('text-[10px]')
    expect(astro).toContain('text-[10px]')
  })
})
