<script setup lang="ts">
import gitForkVue from '@simon_he/git-fork-vue'
import { AutoComplete } from 'ant-design-vue'
import { copy, useFocus, useRaf } from 'lazy-js-utils'
import * as monaco from 'monaco-editor'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import { toTailwindcss } from 'transform-to-tailwindcss-core'
import { VividTyping } from 'vivid-typing'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { isDark, toggleDark } from '~/composables'
import { transformVue } from '../../src/transformVue'
import { cssSuggestions } from './utils'

const { t, locale } = useI18n()
const isChecked = ref(false)
const input = ref('')
let pre: any
  = '<template>\n  <button>button</button>\n</template>\n\n<style scoped>\n  button {\n    height: 32px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    font-size: 14px;\n    cursor: pointer;\n    user-select: none;\n    padding: 8px 15px;\n    border-radius: 4px;\n    border: none;\n    box-sizing: border-box;\n    color: #fff;\n    background-color: #409eff;\n    margin: auto;\n  }\n  button:hover{\n    background-color: #67c23a ;\n  }\n</style>\n'

const transform = computed(() => {
  try {
    return toTailwindcss(input.value, isChecked.value)
  }
  catch (error) {
    return ''
  }
})
let editorComponent: any = null
const editor = ref(null)
const editorResult = ref<HTMLElement>()

const display = ref('')
const styleReg = /<style.*>(.*)<\/style>/s
const classReg = /(.*)\{/g

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
monaco.editor.defineTheme('myTheme', {
  base: 'vs',
  inherit: true,
  rules: [{ background: 'EDF9FA', token: '' }],
  colors: {
    'editor.foreground': '#000000',
    'editor.background': '#EDF9FA',
    'editorCursor.foreground': '#8B0000',
    'editor.lineHighlightBackground': '#0000FF20',
    'editorLineNumber.foreground': '#008800',
    'editor.selectionBackground': '#88000030',
    'editor.inactiveSelectionBackground': '#88000015',
  },
})
monaco.editor.setTheme('myTheme')

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
monaco.languages.registerCompletionItemProvider('html', {
  provideCompletionItems(model, position) {
    const textUntilPosition = model.getValueInRange({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column,
    })
    const isInStyleSection
      = /<style\b/.test(textUntilPosition)
        || /style\s*=\s*"/.test(textUntilPosition)
        || /style\s*=\s*'/.test(textUntilPosition)

    if (!isInStyleSection)
      return { suggestions: [] }

    return cssCompletionProvider.provideCompletionItems(model, position)
  },
})

onMounted(() => {
  useFocus('input') // 自动聚焦input

  globalThis.MonacoEnvironment = {
    getWorker() {
      return new HtmlWorker()
    },
  }

  editorComponent = monaco.editor.create(editor.value!, {
    value: editorInput.value,
    fontFamily: 'Arial',
    fontSize: 20,
    language: 'html',
  })
  monaco.editor.create(editorResult.value!, {
    value: `<template>
  <button class="h-32px flex justify-center items-center text-14px cursor-pointer select-none px-15px py-8px border-rd-4px border-none box-border text-#fff bg-#409eff m-auto hover:bg-#67c23a">button</button>
</template>
<style scoped></style>
`,
    language: 'html',
    fontFamily: 'Arial',
    fontSize: 20,
    readOnly: true,
    acceptSuggestionOnEnter: 'smart',
  })
  display.value = codeToHtml(pre)
})

const stop = useRaf(async () => {
  const newInput = editorComponent!.getValue()
  if (!editorResult.value)
    return
  let code
  if ((!pre && newInput) || pre !== newInput) {
    pre = newInput

    try {
      code = await fetch('https://localhost/.netlify/functions/server', {
        method: 'POST',
        body: newInput,
      }).then(res => res.text())
    }
    catch (error) {
      code = await transformVue(newInput, true)
    }

    editorResult.value!.innerHTML = ''
    monaco.editor.create(editorResult.value!, {
      value: code,
      language: 'html',
      fontFamily: 'Arial',
      fontSize: 20,
      readOnly: true,
      acceptSuggestionOnEnter: 'smart',
    })
    display.value = codeToHtml(newInput)
  }
}, 200)

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
  if (copy(transform.value))
    isCopy.value = true

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
})
</script>

<template>
  <div absolute flex="~ gap-2" z-2 left-2 top-2>
    <div
      hover="rotate-y-180deg "
      transition-all-800
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
    content="Css To Tailwindcss"
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
    data-text="Css To Tailwindcss"
  />
  <div h="100%" flex justify-center items-center flex-col p="y10">
    <!-- <input
      v-model="input"
      class="!outline-none"
      w="40%"
      text-4
      :placeholder="t('placeholder')"
      type="text"
      autocomplete="off"
      p="x6 y4"
      hover:border-pink
      border-1
    > -->
    <AutoComplete
      v-model:value="input"
      w="60%"
      :options="options"
      class="!text-6"
      :placeholder="t('placeholder')"
      hover="border-pink!"
      border-1
      allow-clear
      @search="onSearch"
    />
    <div flex items-center my3>
      <input v-model="isChecked" type="checkbox" w4 h4 mr1> isRem
    </div>
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
        <div h-20 v-html="t('issue')" />
      </template>
      <template v-else>
        <div h-20 box-border pt6 v-html="t('find')" />
      </template>
    </template>
  </div>
  <div flex>
    <div w="50%">
      <h1
        pl2
        class="textshadow"
        relative
        z-2
        :data-text="t('inputs')"
        indent-10
      >
        {{ t('inputs') }}
      </h1>
      <div ref="editor" h-100 />
    </div>
    <div w="50%">
      <h1
        pl2
        class="textshadow"
        relative
        z-2
        :data-text="t('outputs')"
        indent-10
      >
        {{ t('outputs') }}
      </h1>
      <div ref="editorResult" h-100 />
    </div>
  </div>
  <h1 pl2 class="textshadow" relative z-2 :data-text="t('render')" indent-10>
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
