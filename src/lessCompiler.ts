import path from 'node:path'
import process from 'node:process'
import * as Url from 'node:url'

export async function lessCompiler(
  css: string,
  filepath?: string,
  globalCss?: string,
  debug?: boolean,
) {
  if (typeof window !== 'undefined')
    throw new Error('lessCompiler is not supported in this browser')

  if (debug) {
    console.log(
      `[transform-to-tailwindcss] Compiling LESS file: ${filepath || 'unknown file'}`,
    )
  }

  const { LessPluginModuleResolver } = await import(
    'less-plugin-module-resolver'
  )

  let result = globalCss
    ? `${globalCss.replace(/@(?:include|import)\s+["']([^"']*)['"]/g, (_, v) =>
      _.replace(v, Url.pathToFileURL(path.resolve(process.cwd(), v)) as any))}${css}`
    : css
  try {
    result = (
      await (
        await import('less')
      ).default.render(result, {
        filename: filepath,
        plugins: [
          new LessPluginModuleResolver({
            alias: {},
          }),
        ],
      })
    ).css
    return result
  }
  catch (error: any) {
    console.error(
      `Error:\n transform-to-unocss(lessCompiler) ${error.toString()}`,
    )
  }
}
