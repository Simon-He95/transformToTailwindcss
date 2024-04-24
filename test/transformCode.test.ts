import fsp from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { transfromCode } from '../src'

describe('transformCode', () => {
  it('transformCode: all', async () => {
    const demos = await fsp.readdir('./test/demo')
    const contents = await Promise.all(
      demos.map(async (demo) => {
        const url = `./test/demo/${demo}`
        const filepath = path.resolve(process.cwd(), url)
        const suffix = demo.endsWith('.vue')
          ? 'vue'
          : demo.endsWith('.tsx')
            ? 'tsx'
            : ''
        if (!suffix) return

        return `\n\n-----    ${demo}     -------\n\n${await transfromCode(
          await fsp.readFile(url, 'utf-8'),
          {
            filepath,
            type: suffix,
          },
        )}`
      }),
    )

    expect(contents.filter(Boolean)).toMatchInlineSnapshot(`
      [
        "

      -----    classAdd.vue     -------

      <script setup lang="ts"></script>
      <template>
        <div class="red bg-red w-[100%] leading-[20px]">
          nihao
        </div>
        <div class="yellow !bg-yellow w-[100%] h-[100%]">
          hi
        </div>
      </template>
      <style scoped></style>
      ",
        "

      -----    classAttribute.vue     -------

      <script setup lang="ts"></script>

      <template>
        <div class="red w-[100%] h-[100%]" name="hi" haha>
          nihao
        </div>
        <div class="yellow h-[100%]">
          hi
        </div>
      </template>

      <style scoped>
      .red[haha] {
        background-color: red;
      }
      </style>
      ",
        "

      -----    classChild.vue     -------

      <script setup lang="ts"></script>
      <template>
        <div class="red bg-red w-[100%] leading-[20px]">
          <div class="yellow bg-red w-[100%]">
            hi
          </div>
        </div>
      </template>
      <style scoped></style>
      ",
        "

      -----    classCombine.vue     -------

      <script setup lang="ts"></script>
      <template>
        <div class="bg-red w-[100%] leading-[20px]">
          <div class="red yellow bg-red w-[100%]">
            hi
          </div>
        </div>
      </template>
      <style scoped></style>
      ",
        "

      -----    classSpace.vue     -------

      <script setup lang="ts"></script>
      <template>
        <div class="red bg-red w-[100%] leading-[20px]">
          <div class="yellow !bg-red w-[100%]">
            hi
          </div>
        </div>
      </template>
      <style scoped></style>
      ",
        "

      -----    classTail.vue     -------

      <script setup lang="ts"></script>
      <template>
        <div class="container focus-within:bg-red focus-within:w-[100%]">
          <div class="red bg-red w-[100%] leading-[20px]">
            nihao
          </div>
          <div class="yellow">
            hi
          </div>
        </div>
      </template>
      <style scoped></style>
      ",
        "

      -----    classWeight.vue     -------

      <script setup lang="ts"></script>
      <template>
        <div class="red bg-yellow w-[100%]">
          nihao
        </div>
        <div>hi</div>
      </template>
      <style scoped></style>
      ",
        "

      -----    hover.vue     -------

      <script setup lang="ts"></script>
      <template>
        <div class="bg-red w-[100%] leading-[20px]">
          <div class="red hover:text-yellow">
            hi
          </div>
        </div>
      </template>
      <style scoped></style>
      ",
        "

      -----    media.vue     -------

      <script setup lang="ts"></script>

      <template>
        <div class="red sm:bg-red max-2xl:bg-red bg-red">
          nihao
        </div>
      </template>

      <style scoped>
      @media (min-width: 120px) {
        .red {
          background-color: red;
        }
      }
      </style>
      ",
        "

      -----    styleWeight.vue     -------

      <script setup lang="ts"></script>
      <template>
        <div class="red bg-pink bg-red" style="hi:123">
          nihao
        </div>
        <div class="yellow bg-yellow">
          hi
        </div>
      </template>
      <style scoped></style>
      ",
        "

      -----    test.vue     -------

      <script setup lang="ts"></script>
      <template>
        <div class="bg-red w-[100%] leading-[20px] flex"
          class="container"
         
        >
          <div class="flex-1 h-[100px] bg-red" />
          <div class="flex-1 h-[100px] bg-red" />
        </div>
      </template>
      <style scoped></style>
      ",
        "

      -----    vue.tsx     -------

      import { defineComponent, ref } from 'vue'
      import './index.css'

      export const component = defineComponent({
        name: 'Component',
        props: {
          title: {
            type: String,
            default: '',
          },
          content: {
            type: String,
            default: '',
          },
        },
        setup(props) {
          const count = ref(0)
          const increment = () => count.value++
          return () => (
            <div>
              <h1 className="red bg-red" style="hi:123">{props.title}</h1>
              <p>{props.content}</p>
              <div onClick={increment}>
                count: {count.value}
              </div>
            </div>
          )
        },
      })
      ",
      ]
    `)
  })
})

describe('single demo classWeight', async () => {
  const demo = await fsp.readFile('./test/demo/classWeight.vue', 'utf-8')
  const filepath = path.resolve(process.cwd(), './test/demo/classWeight.vue')
  it('classWeight.vue', async () => {
    expect(await transfromCode(demo, { filepath, type: 'vue' }))
      .toMatchInlineSnapshot(`
      "<script setup lang="ts"></script>
      <template>
        <div class="red bg-yellow w-[100%]">
          nihao
        </div>
        <div>hi</div>
      </template>
      <style scoped></style>
      "
    `)
  })
})

describe('single demo classCombine', async () => {
  const demo = await fsp.readFile('./test/demo/classCombine.vue', 'utf-8')
  const filepath = path.resolve(process.cwd(), './test/demo/classCombine.vue')
  it('classCombine.vue', async () => {
    expect(await transfromCode(demo, { filepath, type: 'vue' }))
      .toMatchInlineSnapshot(`
      "<script setup lang="ts"></script>
      <template>
        <div class="bg-red w-[100%] leading-[20px]">
          <div class="red yellow bg-red w-[100%]">
            hi
          </div>
        </div>
      </template>
      <style scoped></style>
      "
    `)
  })
})

describe('single demo classTail', async () => {
  const demo = await fsp.readFile('./test/demo/classTail.vue', 'utf-8')
  const filepath = path.resolve(process.cwd(), './test/demo/classTail.vue')
  it('classTail.vue', async () => {
    expect(await transfromCode(demo, { filepath, type: 'vue' }))
      .toMatchInlineSnapshot(`
      "<script setup lang="ts"></script>
      <template>
        <div class="container focus-within:bg-red focus-within:w-[100%]">
          <div class="red bg-red w-[100%] leading-[20px]">
            nihao
          </div>
          <div class="yellow">
            hi
          </div>
        </div>
      </template>
      <style scoped></style>
      "
    `)
  })
})

describe('single demo Media', async () => {
  const demo = await fsp.readFile('./test/demo/media.vue', 'utf-8')
  const filepath = path.resolve(process.cwd(), './test/demo/media.vue')
  it('media.vue', async () => {
    expect(await transfromCode(demo, { filepath, type: 'vue' }))
      .toMatchInlineSnapshot(`
      "<script setup lang="ts"></script>

      <template>
        <div class="red sm:bg-red max-2xl:bg-red bg-red">
          nihao
        </div>
      </template>

      <style scoped>
      @media (min-width: 120px) {
        .red {
          background-color: red;
        }
      }
      </style>
      "
    `)
  })
})

describe('classSpace.vue', async () => {
  const demo = await fsp.readFile('./test/demo/classSpace.vue', 'utf-8')
  const filepath = path.resolve(process.cwd(), './test/demo/classSpace.vue')
  it('classSpace.vue', async () => {
    expect(await transfromCode(demo, { filepath, type: 'vue' }))
      .toMatchInlineSnapshot(`
      "<script setup lang="ts"></script>
      <template>
        <div class="red bg-red w-[100%] leading-[20px]">
          <div class="yellow !bg-red w-[100%]">
            hi
          </div>
        </div>
      </template>
      <style scoped></style>
      "
    `)
  })
})

describe('single demo styleWeight', async () => {
  const demo = await fsp.readFile('./test/demo/styleWeight.vue', 'utf-8')
  const filepath = path.resolve(process.cwd(), './test/demo/styleWeight.vue')
  it('styleWeight.vue', async () => {
    expect(await transfromCode(demo, { filepath, type: 'vue' }))
      .toMatchInlineSnapshot(`
      "<script setup lang="ts"></script>
      <template>
        <div class="red bg-pink bg-red" style="hi:123">
          nihao
        </div>
        <div class="yellow bg-yellow">
          hi
        </div>
      </template>
      <style scoped></style>
      "
    `)
  })
})

describe('single test', async () => {
  const demo = await fsp.readFile('./test/demo/test.vue', 'utf-8')
  const filepath = path.resolve(process.cwd(), './test/demo/test.vue')
  it('single.vue', async () => {
    expect(await transfromCode(demo, { filepath, type: 'vue' }))
      .toMatchInlineSnapshot(`
      "<script setup lang="ts"></script>
      <template>
        <div class="bg-red w-[100%] leading-[20px] flex"
          class="container"
         
        >
          <div class="flex-1 h-[100px] bg-red" />
          <div class="flex-1 h-[100px] bg-red" />
        </div>
      </template>
      <style scoped></style>
      "
    `)
  })
})

describe('single demo vue.tsx', async () => {
  const _path = './test/demo/vue.tsx'
  const demo = await fsp.readFile(_path, 'utf-8')

  it('vue.tsx', async () => {
    const filepath = path.resolve(process.cwd(), _path)
    expect(await transfromCode(demo, { filepath, type: 'tsx' }))
      .toMatchInlineSnapshot(`
        "import { defineComponent, ref } from 'vue'
        import './index.css'

        export const component = defineComponent({
          name: 'Component',
          props: {
            title: {
              type: String,
              default: '',
            },
            content: {
              type: String,
              default: '',
            },
          },
          setup(props) {
            const count = ref(0)
            const increment = () => count.value++
            return () => (
              <div>
                <h1 className="red bg-red" style="hi:123">{props.title}</h1>
                <p>{props.content}</p>
                <div onClick={increment}>
                  count: {count.value}
                </div>
              </div>
            )
          },
        })
        "
      `)
  })
})

describe.only('single demo test-1.vue', async () => {
  const _path = './test/demo/test-1.vue'
  const demo = await fsp.readFile(_path, 'utf-8')

  it('test-1.vue', async () => {
    const filepath = path.resolve(process.cwd(), _path)
    expect(await transfromCode(demo, { filepath, type: 'vue' }))
      .toMatchInlineSnapshot(`
        "<script setup lang="ts"></script>

        <template>
          <div bg="red" w="[100%]" leading20px>
            <div
              flex
              flex-1
              h-100px
              bg-red
              class="container scale-[0.8_0.9]"
             
            >
              <div flex-1 h-100px bg-red />
              <div />
            </div>
          </div>
        </template>

        <style scoped></style>
        "
      `)
  })
})
