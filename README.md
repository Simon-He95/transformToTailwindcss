<p align="center">
<img height="200" src="./assets/kv.png" alt="to tailwindcss">
</p>
<p align="center"> English | <a href="./README_zh.md">简体中文</a></p>

> WIP

This library is to convert css in vue to tailwindcss. [tailwindcss](https://tailwindcss.com/) can reuse styles better to reduce the packaging volume, which can be converted as a performance optimization method, and it can also make it easier for old projects to upgrade to tailwindcss

## 📦 Install

```
  npm i -g transform-to-tailwindcss
```

## 🦄 cli

```
  ## command: totailwindcss + directory
  totailwindcss playground

  ## revoke: totailwindcss + directory + --revert
  totailwindcss payground --revert
```

## 🌈 Usage

<details>
<summary>Vite</summary>

```ts
// vite.config.ts
import { vitePluginTransformTotailwindcss } from 'transform-to-tailwindcss'
export default defineConfig({
  plugins: [vitePluginTransformTotailwindcss(/* options */)],
})
```

</details>
<br>
<details>
<summary>Rollup</summary>

```ts
// rollup.config.js
import { resolve } from 'path'
import { rollupTransformTotailwindcss } from 'transform-to-tailwindcss'
export default {
  plugins: [rollupTransformTotailwindcss(/* options */)],
}
```

</details>
<br>
<details>
<summary>Webpack</summary>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('transform-to-tailwindcss').webpackTransformTotailwindcss({
      /* options */
    }),
  ],
}
```

</details>
<br>
<details>
<summary>Vue CLI</summary>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('transform-to-tailwindcss').webpackTransformTotailwindcss({
        /* options */
      }),
    ],
  },
}
```

</details>
<br>
<details>
<summary>Esbuild</summary>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import { esbuildTransformTotailwindcss } from 'transform-to-tailwindcss'

build({
  plugins: [esbuildTransformTotailwindcss(/* options */)],
})
```

</details>

# ⭐ Feature

- support css in '.html' | '.tsx' | '.vue' | '.astro' | '.svelte' to tailwindcss
- support sass less stylus convert
- support vite | rollup | webpack | vue-cli | esbuild
- vscode extension [To tailwindcss](https://github.com/Simon-He95/totailwindcss)

## Before

![before](/assets/before.png)

## After

![after](/assets/after.png)

## :coffee:

[buy me a cup of coffee](https://github.com/Simon-He95/sponsor)

## License

[MIT](./license)
