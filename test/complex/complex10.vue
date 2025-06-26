<template>
  <div class="dialog-app">
    <div class="content" draggable="false">
      <div class="title">
        <!-- <ShieldExclamationIcon
          v-if="iconType"
          class="title-icon"
          :class="[iconType]"
        /> -->
        <div class="txt">{{ title }}</div>
      </div>
      <div class="detail">
        {{ detail }}
      </div>
      <div class="actions" :class="[buttonGrid]">
        <div
          v-for="(action, idx) in actions"
          :key="idx"
          :class="['button', action.type]"
          @click="onButtonClick(action)"
        >
          {{ action.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import ShieldExclamationIcon from '@heroicons/vue/24/outline/ShieldExclamationIcon.svg?component'

import { xpcRenderer } from '@src/preload'
import { usePresenter } from '@renderer/common/usePresenter'
const dialogPresenter = usePresenter('dialogPresenter')

const route = useRoute()

const title = ref('')
const detail = ref('')
const actions = ref([])
const dialogId = ref('')
const iconType = ref('')
const buttonGrid = ref('')

onMounted(() => {
  // xpcRenderer.handle('dialog/options', async function (payload: any) {
  //   console.log('dialog/options', payload.params)
  //   getOption(payload.params)
  // })
  console.log('dialog  route.query--', route.query)
  dialogId.value = (route.query as any).id
  dialogPresenter.setDialogDefaultBoundsById(dialogId.value)
  const params = (route.query as any).params
  getOption(params)
})

function getOption(params: any) {
  if (params) {
    const options = JSON.parse(params)
    actions.value = options.actions
    title.value = options.title
    detail.value = options.content
    iconType.value = options.iconType
    buttonGrid.value = options.buttonGrid
  }
}

function onButtonClick(action: any) {
  xpcRenderer.send({
    handleName: `dialog/action`,
    params: JSON.stringify({ action, dialogId: dialogId.value }),
  })
}
</script>

<style lang="scss" scoped>
.dialog-app {
  user-select: none;
  // -webkit-app-region: drag;
  padding: 24px;
  padding-bottom: 32px;
  overflow: hidden;

  div {
    overflow: hidden;
  }
  .content {
    padding: 24px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    background: #fff;
    box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.1);
    border-radius: 6px;

    .title {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      margin-bottom: 24px;
      font-weight: 500;
      font-size: 16px;
      color: #25262a;

      .txt {
        line-height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        height: auto;
      }
      .title-icon {
        color: rgb(244, 173, 85);
        padding: 0px;
        margin: 0px 12px 0px 0px;
        display: block;
        width: 24px;
        height: 24px;
        &.error {
          color: #f75a5a;
        }
        &.warning {
          color: rgb(244, 173, 85);
        }
      }
    }
    .detail {
      font-weight: normal;
      font-size: 14px;
      line-height: 22px;
      color: #4a4e59;
      margin-bottom: 24px;
      flex-grow: 1;
      height: 100%;
      overflow: hidden;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      flex-direction: row;
      gap: 16px;

      &.between {
        justify-content: space-between;
      }
    }
  }
  .button {
    -webkit-app-region: none;
    min-width: 128px;
    width: fit-content;
    height: 38px;
    padding: 0 22px;
    display: flex;
    justify-content: center;
    justify-items: center;
    align-items: center;
    align-content: center;
    box-sizing: border-box;
    border-radius: 4px;
    font-weight: 500;
    background: rgba(245, 246, 248, 0.8);
    color: #25262a;
    font-size: 14px;
    cursor: default;
    user-select: none;
    cursor: pointer;

    &:hover {
      background:
        linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
        rgba(245, 246, 248, 0.8);
      &.primary {
        background:
          linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), #4b7bff;
      }
      &.warning {
        background:
          linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), #f75a5a;
      }
      &.tip {
        color: #4a4e59;
      }
    }
    &.primary {
      color: #fff;
      background: #4b7bff;
    }
    &.warning {
      color: #fff;
      background: #f75a5a;
    }
    &.tip {
      color: #8b91a0;

      background: transparent;
      padding: 0;
      width: fit-content;
      min-width: 56px;
      min-width: 56px;
    }
  }
}
</style>
