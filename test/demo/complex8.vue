<template>
  <div class="mermaid-artifact">
    <div
      v-show="activeTab == 'preview'"
      class="preview-container relative overflow-auto select-none"
      ref="containerRef"
      @wheel="onWheel"
    >
      <!-- 缩放控制按钮 -->
      <div
        class="zoom-controls fixed bottom-4 right-4 flex flex-col gap-2 z-50"
      >
        <Button
          variant="outline"
          size="sm"
          class="zoom-button p-2 rounded-md bg-background/80 hover:bg-muted backdrop-blur-sm shadow-lg"
          @click="handleZoomIn"
          :disabled="isMaxScale"
          title="放大"
        >
          <Icon icon="lucide:zoom-in" class="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          class="zoom-button p-2 rounded-md bg-background/80 hover:bg-muted backdrop-blur-sm shadow-lg"
          @click="handleZoomOut"
          :disabled="isMinScale"
          title="缩小"
        >
          <Icon icon="lucide:zoom-out" class="w-4 h-4" />
        </Button>
      </div>

      <div
        ref="mermaidWrapperRef"
        class="mermaid-wrapper w-full h-full"
        :style="mermaidRectStyle"
      >
        <div
          ref="mermaidRef"
          class="mermaid h-full flex items-center justify-center"
        ></div>
      </div>
    </div>
    <CodePreview
      v-show="activeTab == 'code'"
      :content="block.content"
      :language="block.artifact.language"
      :type="block.artifact.type"
      :title="block.artifact.title"
    ></CodePreview>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  watch,
  nextTick,
  inject,
  computed,
  type Ref,
  onUnmounted,
  watchEffect,
} from 'vue'
import mermaid from 'mermaid'
import { useI18n } from 'vue-i18n'

import { debounce } from 'lodash-es'
import { useElementBounding, useDebounceFn } from '@vueuse/core'
import { zUnsafePreload } from '@src/preload'
import { Icon } from '@iconify/vue'
import CodePreview from './CodePreview.vue'
import { Button } from '@src/renderer/common/shadcn/components/ui/button'

const artifactStatus = inject('artifactStatus') as Ref<
  'generating' | 'completed'
>

const { t } = useI18n()

const props = defineProps<{
  block: {
    artifact: {
      type: string
      title: string
      language: string
    }
    content: string
  }
  id: string
}>()
const activeTab = inject('activeTab') as Ref<'preview' | 'code'>

const containerRef = ref<HTMLElement | null>(null)
const mermaidWrapperRef = ref<HTMLElement | null>(null)
const mermaidRef = ref<HTMLElement | null>(null)
const mermaidRectStyle = ref('')

const isMaxScale = ref(false)
const isMinScale = ref(false)

// 初始化基础尺寸
const initBaseSize = () => {
  if (!containerRef.value || !mermaidWrapperRef.value) return
  mermaidRectStyle.value = `width:${containerRef.value.offsetWidth}px;height:${containerRef.value.offsetHeight}px;`

  // 添加最大和最小缩放判断逻辑
  isMaxScale.value =
    artifactStatus.value == 'generating'
      ? true
      : mermaidWrapperRef.value && containerRef.value
        ? mermaidWrapperRef.value.offsetWidth >=
          containerRef.value.offsetWidth * 4
        : false

  isMinScale.value =
    artifactStatus.value == 'generating'
      ? true
      : mermaidWrapperRef.value && containerRef.value
        ? mermaidWrapperRef.value.offsetWidth <=
          containerRef.value.offsetWidth * 0.5
        : true
}

// 处理滚轮事件
const onWheel = (event: WheelEvent) => {
  if (!event.ctrlKey || !containerRef.value) return
  event.preventDefault()
  if (artifactStatus.value == 'generating') return

  if (event.deltaY < 0) {
    scaleUp(-event.deltaY)
  } else {
    scaleDown(event.deltaY)
  }
}

// 放大
const scaleUp = (deltaY: number) => {
  if (!mermaidWrapperRef.value || !containerRef.value) return
  if (artifactStatus.value == 'generating') return

  const wd = mermaidWrapperRef.value.offsetWidth
  const ht = mermaidWrapperRef.value.offsetHeight

  // 检查最大尺寸限制
  if (wd >= containerRef.value.offsetWidth * 4) return

  // 计算目标尺寸
  const newWidth = wd + deltaY * 20
  const newHeight = ht + deltaY * 20

  // 计算当前视口中心点
  const viewportCenterX =
    containerRef.value.scrollLeft + containerRef.value.offsetWidth / 2
  const viewportCenterY =
    containerRef.value.scrollTop + containerRef.value.offsetHeight / 2

  // 计算中心点相对于当前尺寸的比例
  const ratioX = viewportCenterX / wd
  const ratioY = viewportCenterY / ht

  // 更新尺寸（移除transition以避免动画）
  mermaidWrapperRef.value.style.transition = 'none'
  mermaidRectStyle.value = `width:${newWidth}px;height:${newHeight}px;`

  // 立即计算并设置新的滚动位置
  const newScrollLeft = newWidth * ratioX - containerRef.value.offsetWidth / 2
  const newScrollTop = newHeight * ratioY - containerRef.value.offsetHeight / 2

  // 同步更新滚动位置
  containerRef.value.scrollLeft = newScrollLeft
  containerRef.value.scrollTop = newScrollTop

  // 恢复transition（使用 requestAnimationFrame 确保在下一帧恢复）
  requestAnimationFrame(() => {
    if (mermaidWrapperRef.value) {
      mermaidWrapperRef.value.style.transition = 'transform 0.2s ease'
    }
  })
}

// 缩小
const scaleDown = (deltaY: number) => {
  if (!mermaidWrapperRef.value || !containerRef.value) return
  if (artifactStatus.value == 'generating') return

  const wd = mermaidWrapperRef.value.offsetWidth
  const ht = mermaidWrapperRef.value.offsetHeight

  if (
    wd <= containerRef.value.offsetWidth &&
    ht <= containerRef.value.offsetHeight
  ) {
    return
  }

  // 计算目标尺寸
  const newWidth = Math.max(containerRef.value.offsetWidth, wd - deltaY * 20)
  const newHeight = Math.max(containerRef.value.offsetHeight, ht - deltaY * 20)

  // 计算当前视口中心点
  const viewportCenterX =
    containerRef.value.scrollLeft + containerRef.value.offsetWidth / 2
  const viewportCenterY =
    containerRef.value.scrollTop + containerRef.value.offsetHeight / 2

  // 计算中心点相对于当前尺寸的比例
  const ratioX = viewportCenterX / wd
  const ratioY = viewportCenterY / ht

  // 更新尺寸（移除transition以避免动画）
  mermaidWrapperRef.value.style.transition = 'none'
  mermaidRectStyle.value = `width:${newWidth}px;height:${newHeight}px;`

  // 立即计算并设置新的滚动位置
  const newScrollLeft = newWidth * ratioX - containerRef.value.offsetWidth / 2
  const newScrollTop = newHeight * ratioY - containerRef.value.offsetHeight / 2

  // 同步更新滚动位置
  containerRef.value.scrollLeft = newScrollLeft
  containerRef.value.scrollTop = newScrollTop

  // 恢复transition
  requestAnimationFrame(() => {
    if (mermaidWrapperRef.value) {
      mermaidWrapperRef.value.style.transition = 'transform 0.2s ease'
    }
  })
}

// 按钮点击处理
const handleZoomIn = () => scaleUp(10)
const handleZoomOut = () => scaleDown(10)

const isLoaded = ref(false)
const renderDiagram = debounce(async () => {
  if (isLoaded.value) return

  if (!mermaidRef.value || !props.block.content) return

  // console.log('开始渲染 Mermaid 图表');
  await nextTick()
  initBaseSize() // 初始化尺寸
  try {
    // 清空之前的内容
    mermaidRef.value.innerHTML = ''
    mermaidRef.value.innerHTML = props.block.content
    isLoaded.value = true

    // 使用 mermaid API 重新渲染
    await mermaid.run({
      nodes: [mermaidRef.value],
    })
  } catch (error) {
    isLoaded.value = false
    console.error('Failed to render mermaid diagram:', error)
    if (mermaidRef.value) {
      mermaidRef.value.innerHTML = `<div class="text-destructive p-4">渲染失败: ${error instanceof Error ? error.message : '未知错误'}</div>`
    }
  }
}, 300)

watchEffect(() => {
  if (artifactStatus.value == 'completed' && activeTab.value == 'preview') {
    nextTick(() => {
      renderDiagram()
    })
  }
})
watch(
  () => props.id,
  () => {
    isLoaded.value = false

    nextTick(() => {
      renderDiagram()
      if (artifactStatus.value == 'completed' && activeTab.value == 'preview') {
        window.location.reload()
      }
    })
  },
)

onMounted(() => {
  mermaid.initialize({
    startOnLoad: true,
    theme: document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'default',
    securityLevel: 'loose',
    fontFamily: 'inherit',
  })

  if (artifactStatus.value == 'completed') {
    nextTick(() => {
      renderDiagram()
    })
  }

  // window.addEventListener('wheel', onWheel, { passive: false });
})

onUnmounted(() => {
  // window.removeEventListener('wheel', onWheel);
})
</script>

<style scoped>
.mermaid :deep(svg) {
  width: 100% !important;
  height: 100% !important;
  max-height: calc(100vh - 120px);
  object-fit: contain;
  will-change: transform;
}
</style>
