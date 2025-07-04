<script setup lang="ts">
import gitForkVue from '@simon_he/git-fork-vue'
import { AutoComplete } from 'ant-design-vue'
import { copy, useFocus, useRaf } from 'lazy-js-utils'
import { toTailwindcss } from 'transform-to-tailwindcss-core'
import { VividTyping } from 'vivid-typing'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMonaco } from 'vue-use-monaco'
import { isDark, toggleDark } from '~/composables'
import { transformVue } from '../../src/transformVue'

import { cssSuggestions } from './utils'
import 'vivid-typing/dist/index.css'

const { t, locale } = useI18n()

const input = ref('')
let pre: any
  = '<template>\n  <button>button</button>\n</template>\n\n<style scoped>\n  button {\n    height: 32px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    font-size: 14px;\n    cursor: pointer;\n    user-select: none;\n    padding: 8px 15px;\n    border-radius: 4px;\n    border: none;\n    box-sizing: border-box;\n    color: #fff;\n    background-color: #409eff;\n    margin: auto;\n  }\n  button:hover{\n    background-color: #67c23a ;\n  }\n</style>\n'

const editor = ref(null)
const editorResult = ref<HTMLElement>()
const display = ref('')
const styleReg = /<style.*>(.*)<\/style>/s
const classReg = /(.*)\{/g
const isChecked = ref(false)
const transform = computed(() => {
  try {
    return toTailwindcss(input.value, isChecked.value)
  }
  catch (err) {
    return ''
  }
})

const editorInput = ref(`<template>
  <button>button</button>
</template>

<style scoped>
  button {
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    cursor: pointer;
    user-select: none;
    padding: 8px 15px;
    border-radius: 4px;
    border: none;
    box-sizing: border-box;
    color: #fff;
    background-color: #409eff;
    margin: auto;
  }
  button:hover{
    background-color: #67c23a ;
  }
</style>
`)

const cssCompletionProvider = {
  triggerCharacters: ['.', ':', '-'],
  provideCompletionItems: (model, position) => {
    const word = model.getWordUntilPosition(position)
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    }

    return {
      suggestions: cssSuggestions.map(prop => ({
        label: prop,
        kind: monaco.languages.CompletionItemKind.Property,
        insertText: prop,
        range,
      })),
    }
  },
}

const { createEditor, getEditorView } = useMonaco({
  onBeforeCreate(monaco) {
    return [
      monaco.languages.registerCompletionItemProvider('html', {
        triggerCharacters: ['<', ' ', ':', '"', '\'', '.'],
        provideCompletionItems(model, position) {
          const textUntilPosition = model.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          })

          // Check if we're in a style section
          const isInStyleSection
            = /<style\b/.test(textUntilPosition)
              && !/<\/style>/.test(textUntilPosition.split(/<style\b/)[1] || '')

          // Check if we're in a style attribute
          const isInStyleAttribute = /style\s*=\s*["'][^"']*$/.test(
            textUntilPosition,
          )

          // For CSS in style tags or style attributes
          if (isInStyleSection || isInStyleAttribute) {
            return cssCompletionProvider.provideCompletionItems(model, position)
          }

          // For HTML elements
          const word = model.getWordUntilPosition(position)
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          }

          // Check if we're starting a new tag
          const isStartingTag = /<\w*$/.test(textUntilPosition)

          // Check if we're in an attribute position
          const isInTag = /<\w+[^>]*$/.test(textUntilPosition)
          const isInAttributePosition = isInTag && !isStartingTag

          if (isStartingTag) {
            // HTML tag suggestions
            const htmlTags = [
              'div',
              'span',
              'p',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'button',
              'a',
              'img',
              'input',
              'form',
              'label',
              'select',
              'option',
              'textarea',
              'ul',
              'ol',
              'li',
              'table',
              'tr',
              'td',
              'th',
              'thead',
              'tbody',
              'tfoot',
              'header',
              'footer',
              'nav',
              'main',
              'section',
              'article',
              'aside',
              'template',
            ]

            return {
              suggestions: htmlTags.map(tag => ({
                label: tag,
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: `${tag}$0></${tag}>`,
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range,
              })),
            }
          }

          if (isInAttributePosition) {
            // HTML attribute suggestions
            const htmlAttributes = [
              'id',
              'class',
              'style',
              'href',
              'src',
              'alt',
              'title',
              'width',
              'height',
              'type',
              'value',
              'placeholder',
              'name',
              'disabled',
              'checked',
              'selected',
              'readonly',
              'required',
              'autofocus',
              'autocomplete',
              'maxlength',
              'pattern',
              'target',
              'rel',
              'download',
              'v-if',
              'v-else',
              'v-show',
              'v-for',
              'v-model',
              'v-on',
              'v-bind',
              'v-text',
              'v-html',
              '@click',
              '@change',
              '@input',
              ':class',
              ':style',
              'ref',
            ]

            return {
              suggestions: htmlAttributes.map((attr) => {
                const requiresValue = ![
                  'disabled',
                  'checked',
                  'selected',
                  'readonly',
                  'required',
                  'autofocus',
                ].includes(attr)

                const insertText = requiresValue ? `${attr}="$1"$0` : attr

                return {
                  label: attr,
                  kind: monaco.languages.CompletionItemKind.Property,
                  insertText,
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  range,
                }
              }),
            }
          }

          return { suggestions: [] }
        },
      }),
    ]
  },
  readOnly: false,
})

const { createEditor: createEditor1, updateCode: updateCode1 } = useMonaco({
  onBeforeCreate(monaco) {
    return [
      monaco.languages.registerCompletionItemProvider('html', {
        triggerCharacters: ['<', ' ', ':', '"', '\'', '.'],
        provideCompletionItems(model, position) {
          const textUntilPosition = model.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          })

          // Check if we're in a style section
          const isInStyleSection
            = /<style\b/.test(textUntilPosition)
              && !/<\/style>/.test(textUntilPosition.split(/<style\b/)[1] || '')

          // Check if we're in a style attribute
          const isInStyleAttribute = /style\s*=\s*["'][^"']*$/.test(
            textUntilPosition,
          )

          // For CSS in style tags or style attributes
          if (isInStyleSection || isInStyleAttribute) {
            return cssCompletionProvider.provideCompletionItems(model, position)
          }

          // For HTML elements
          const word = model.getWordUntilPosition(position)
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          }

          // Check if we're starting a new tag
          const isStartingTag = /<\w*$/.test(textUntilPosition)

          // Check if we're in an attribute position
          const isInTag = /<\w+[^>]*$/.test(textUntilPosition)
          const isInAttributePosition = isInTag && !isStartingTag

          if (isStartingTag) {
            // HTML tag suggestions
            const htmlTags = [
              'div',
              'span',
              'p',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'button',
              'a',
              'img',
              'input',
              'form',
              'label',
              'select',
              'option',
              'textarea',
              'ul',
              'ol',
              'li',
              'table',
              'tr',
              'td',
              'th',
              'thead',
              'tbody',
              'tfoot',
              'header',
              'footer',
              'nav',
              'main',
              'section',
              'article',
              'aside',
              'template',
            ]

            return {
              suggestions: htmlTags.map(tag => ({
                label: tag,
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: `${tag}$0></${tag}>`,
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range,
              })),
            }
          }

          if (isInAttributePosition) {
            // HTML attribute suggestions
            const htmlAttributes = [
              'id',
              'class',
              'style',
              'href',
              'src',
              'alt',
              'title',
              'width',
              'height',
              'type',
              'value',
              'placeholder',
              'name',
              'disabled',
              'checked',
              'selected',
              'readonly',
              'required',
              'autofocus',
              'autocomplete',
              'maxlength',
              'pattern',
              'target',
              'rel',
              'download',
              'v-if',
              'v-else',
              'v-show',
              'v-for',
              'v-model',
              'v-on',
              'v-bind',
              'v-text',
              'v-html',
              '@click',
              '@change',
              '@input',
              ':class',
              ':style',
              'ref',
            ]

            return {
              suggestions: htmlAttributes.map((attr) => {
                const requiresValue = ![
                  'disabled',
                  'checked',
                  'selected',
                  'readonly',
                  'required',
                  'autofocus',
                ].includes(attr)

                const insertText = requiresValue ? `${attr}="$1"$0` : attr

                return {
                  label: attr,
                  kind: monaco.languages.CompletionItemKind.Property,
                  insertText,
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  range,
                }
              }),
            }
          }

          return { suggestions: [] }
        },
      }),
    ]
  },
})

onMounted(() => {
  if (editor.value)
    createEditor(editor.value, editorInput.value, 'vue')
  if (editorResult.value) {
    createEditor1(
      editorResult.value,
      `<template>
  <button class="h-32px flex justify-center items-center text-14px cursor-pointer select-none px-15px py-8px border-rd-4px border-none box-border text-[#fff] bg-[#409eff] m-auto hover-bg-[#67c23a]">button</button>
</template>
<style scoped></style>
`,
      'vue',
    )
  }
})
const autoComplete = ref<any>(null)
onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
      const selection = document.getSelection()
      if (!selection || !selection.toString())
        return
      const text = selection.toString()
      window.parent.postMessage({ eventType: 'copy', text }, '*')
    }
  })
  useFocus('input') // 自动聚焦input

  display.value = codeToHtml(pre)
})

const stop = useRaf(
  async () => {
    const newInput = getEditorView().getValue()
    if (!newInput)
      return
    if (!editorResult.value)
      return
    let code
    if ((!pre && newInput) || pre !== newInput) {
      pre = newInput

      try {
        code = await transformVue(newInput, {
          isRem: isChecked.value,
        })
      }
      catch (e) {
        // eslint-disable-next-line no-alert
        alert(`Error: ${e}`)
        return
      }

      updateCode1(code, 'vue') // Update the editor with the new code

      display.value = codeToHtml(newInput)
    }
  },
  {
    delta: 200,
  },
)

function codeToHtml(code: string) {
  return code
    .replace(styleReg, (all, v) =>
      all.replace(
        v,
        v.replace(
          classReg,
          (_: any, match: any) => `[data-v-display]${match} {`,
        ),
      ))
    .replace('<template>', '')
    .replace('<\/template>', '')
}
const options = ref(cssSuggestions.map(i => ({ value: i })))
function onSearch(searchText: string) {
  options.value = !searchText
    ? cssSuggestions.map(i => ({ value: i }))
    : cssSuggestions
        .map(i => ({ value: i }))
        .filter(i => i.value.includes(searchText))
        .sort(
          (a, b) => a.value.indexOf(searchText) - b.value.indexOf(searchText),
        )
}

const isCopy = ref(false)
function copyStyle() {
  if (copy(transform.value)) {
    isCopy.value = true
    window.parent.postMessage({ eventType: 'copy', text: transform.value }, '*')
  }

  setTimeout(() => {
    isCopy.value = false
  }, 1000)
}

function changelanguage() {
  if (locale.value === 'en')
    locale.value = 'zh'
  else locale.value = 'en'
}

onUnmounted(() => {
  stop?.()
  // Remove event listeners
  document.removeEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
      const selection = document.getSelection()
      if (!selection || !selection.toString())
        return
      const text = selection.toString()
      window.parent.postMessage({ eventType: 'copy', text }, '*')
    }
  })
})

function onSelect(value: any) {
  input.value = `${value}: `
  nextTick(() => {
    autoComplete.value.focus()
  })
}
</script>

<template>
  <div absolute flex="~ gap-2" z-2 left-2 top-5>
    <div
      hover="rotate-y-180deg "
      transition-transform-800
      cursor-pointer
      @click="changelanguage"
    >
      <div i-fa:language />
    </div>
    <button
      class="icon-btn !outline-none border-none bg-transparent"
      @click="toggleDark()"
    >
      <div v-if="isDark" i-carbon-moon text-white />
      <div v-else i-carbon-sun />
    </button>
  </div>
  <gitForkVue
    link="https://github.com/Simon-He95"
    type="trapeziumType"
    position="right"
    content="Follow Me"
    color="pink"
  />
  <VividTyping
    content="Css To TailwindCss"
    animate-bounce-alt
    animate-delay-1500
    animate-count-infinite
    animate-duration-1s
    text-3xl
    color-pink
    py6
    text-center
    spilt-class="textshadow"
    class="typing"
    data-text="Css To TailwindCss"
  />
  <div h="100%" flex justify-center items-center flex-col p="y10" w-full>
    <!-- <input v-model="input" class="!outline-none" w="40%" text-4 :placeholder="t('placeholder')" type="text"
      autocomplete="off" p="x6 y4" hover:border-pink border-1> -->
    <AutoComplete
      ref="autoComplete"
      v-model:value="input"
      w="60%"
      :options="options"
      class="!text-6"
      :placeholder="t('placeholder')"
      hover="border-pink!"
      border-1
      allow-clear
      @search="onSearch"
      @select="onSelect"
    />
    <div flex items-center my3>
      <input v-model="isChecked" type="checkbox" w4 h4 mr1> isRem
    </div>
    <div min-h-20 flex items-center justify-center>
      <div v-if="transform" flex="~ gap-4" items-center>
        <div font-bold text="18px">
          {{ t('result') }}
        </div>
        <div flex gap-2 items-center>
          {{ transform }}
          <div
            :class="[
              isCopy
                ? 'i-carbon:checkmark-outline text-green!'
                : ' i-carbon:copy',
            ]"
            cursor-pointer
            hover="color-orange"
            @click="copyStyle"
          />
        </div>
      </div>
      <template v-else>
        <template v-if="input">
          <div v-html="t('issue')" />
        </template>
        <template v-else>
          <div box-border pt6 v-html="t('find')" />
        </template>
      </template>
    </div>
  </div>
  <div flex>
    <div w="50%">
      <h1
        pl2
        class="textshadow"
        relative
        z-2
        text-pink:80
        :data-text="t('inputs')"
        indent-10
      >
        {{ t('inputs') }}
      </h1>
      <div ref="editor" class="min-h-[500px]" />
    </div>
    <div w="50%">
      <h1
        pl2
        class="textshadow"
        relative
        text-pink:80
        z-2
        :data-text="t('outputs')"
        indent-10
      >
        {{ t('outputs') }}
      </h1>
      <div ref="editorResult" class="min-h-[500px]" />
    </div>
  </div>
  <h1
    pl2
    class="textshadow"
    text-pink:80
    relative
    z-2
    indent-10
    :data-text="t('render')"
  >
    {{ t('render') }}
  </h1>
  <div pb20 data-v-display v-html="display" />
</template>

<style scoped>
.textshadow::after {
  bottom: 0;
  content: attr(data-text);
  -webkit-filter: blur(2px);
  filter: blur(2px);
  left: 0;
  -webkit-mask-image: linear-gradient(transparent, #000);
  mask-image: linear-gradient(transparent, #000);
  position: absolute;
  -webkit-transform: translate(-26px, 16px) skew(50deg) scaleY(0.6);
  transform: translate(-26px, 16px) skew(50deg) scaleY(0.6);
  z-index: 1;
}
</style>

<style>
.ant-select-selector {
  height: 50px !important;
}

.ant-select-selector input {
  height: 100% !important;
  font-size: 16px;
}

.ant-select-selector .ant-select-selection-placeholder {
  line-height: 50px !important;
}
</style>
