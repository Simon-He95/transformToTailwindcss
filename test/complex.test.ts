import fsp from 'node:fs/promises'
import { glob } from 'fast-glob'
import { expect } from 'vitest'
import { it } from 'vitest'
import { describe } from 'vitest'
import { transformCode } from '../src/transformCode'
import path from 'node:path'

describe('single demo complex.vue', async () => {
  const files = await glob('./test/complex/*.vue')
  const filesContent = await Promise.all(
    files.map(async (file) => {
      const demo = await fsp.readFile(file, 'utf-8')
      const filepath = path.resolve(process.cwd(), file)
      return { demo, filepath }
    }),
  )
  filesContent.forEach(({ demo, filepath }, index) => {
    it(`transform ${files[index]}`, async () => {
      await expect(
        await transformCode(demo, { filepath, type: 'vue' }),
      ).toMatchFileSnapshot(
        `./__snapshots__/${path.basename(files[index])}.test.ts.snap`,
      )
    })
  })
})
