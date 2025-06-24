<template>
  <div
    class="control-bar drag-disable"
    :class="[viewType === 'gallery' ? 'black' : '']"
    :style="style"
    @mouseover="onOver"
    @mouseout="onOut"
  >
    <div class="control-left">
      <div v-if="!isLocalLoading" class="audio click-enable">
        <ControlBarButton
          id="audio"
          :viewType="viewType"
          :title="BUTTON_TITLE['audio']"
          :mute="!localUser.isMicrophoneEnabled"
          :disabled="localPermission?.openSelfVoice == 0"
          :loading="localUser.audioLoading"
          :expand="true"
          @expand="onExpand"
          @click.stop="onButtonClick('audio', !localUser.isMicrophoneEnabled)"
        ></ControlBarButton>
      </div>
      <div v-if="!isLocalLoading" class="video click-enable">
        <ControlBarButton
          id="video"
          :title="BUTTON_TITLE['video']"
          :mute="!localUser.isCameraEnabled"
          :loading="localUser.videoLoading"
          :disabled="localPermission?.openSelfCamera == 0"
          :expand="true"
          :viewType="viewType"
          @expand="onExpand"
          @click.stop="onButtonClick('video', !localUser.isCameraEnabled)"
        ></ControlBarButton>
      </div>
    </div>
    <div class="control-center">
      <ControlBarButton
        v-if="!isLocalLoading"
        id="meetingDevices"
        :disabled="localUser.roleType === 'VIEWER'"
        :title="BUTTON_TITLE['meetingDevices']"
        :viewType="viewType"
        @click.stop="onButtonClick('meetingDevices')"
      ></ControlBarButton>
      <div
        v-if="!isLocalLoading"
        class="user click-enable"
        @click.stop="onButtonClick('users')"
      >
        <div
          v-if="enableOuterCount"
          class="apply-tips"
          @click.stop="onButtonClick('outer')"
        >
          {{ t('MeetingCommon.externalAccess') }}
          <span class="count">{{ applyOuters }}</span>
          <span class="arrow"></span>
        </div>
        <div class="button">
          <div class="icon"></div>
          <div v-show="hasHands" class="hand"></div>
        </div>
        <div class="title">
          {{ t('MeetingCommon.attendee')
          }}{{ usersTotal > 999 ? '999+' : usersTotal }}
        </div>
      </div>
      <ControlBarButton
        v-if="!isLocalLoading"
        id="screen"
        :title="screenTitle"
        :disabled="localPermission?.shareSelfScreen == 0"
        :mute="!localUser.isScreenShareEnabled"
        :expand="false"
        :viewType="viewType"
        @click.stop="onButtonClick('screen', !localUser.isScreenShareEnabled)"
      ></ControlBarButton>
      <ControlBarButton
        v-if="!isLocalLoading && enableHand"
        id="hand"
        :title="handTitle"
        :mute="!localUser?.isHandup"
        :expand="false"
        :viewType="viewType"
        @click.stop="onButtonClick('hand', !localUser?.isHandup)"
      ></ControlBarButton>
      <ControlBarButton
        v-if="!isLocalLoading && enableLocalScreenOuterCount"
        id="outer"
        :title="BUTTON_TITLE['outer']"
        :expand="false"
        :viewType="viewType"
        @click.stop="onButtonClick('applyOuter')"
      ></ControlBarButton>
      <div v-if="!isLocalLoading && enableSummary" class="summary click-enable">
        <ControlBarButton
          id="summary"
          :title="BUTTON_TITLE['summary']"
          :expand="false"
          :viewType="viewType"
          @click.stop="onButtonClick('summary')"
        ></ControlBarButton>
        <SummaryFloat
          v-if="showSummaryTip"
          :viewType="viewType"
          @on-tip-close="onSummaryTipClose"
        ></SummaryFloat>
      </div>

      <div
        v-if="!isLocalLoading && moreButtonList && moreButtonList.length"
        class="more"
      >
        <ControlBarButton
          id="more"
          :title="BUTTON_TITLE['more']"
          :viewType="viewType"
          @click.stop="onButtonClick('more')"
        ></ControlBarButton>
        <ControlButtonFloat
          v-if="showMoreFloat"
          :loading="isLocalLoading"
          :viewType="viewType"
          :counts="moreButtonList.length"
          @close="showMoreFloat = false"
        ></ControlButtonFloat>
      </div>
    </div>
    <div class="control-right">
      <ControlBarButton
        id="share"
        :title="BUTTON_TITLE['share']"
        :viewType="viewType"
        @click.stop="onButtonClick('share')"
      ></ControlBarButton>
      <ControlBarButton
        id="leave"
        :title="BUTTON_TITLE['leave']"
        :viewType="viewType"
        @click.stop="onButtonClick('leave')"
      ></ControlBarButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watchEffect, computed, inject, type Ref } from 'vue'
import { i18nHelper } from '@i18n/i18n.helper'

import bus from '@renderer/apps/meeting/utils/bus'
import type { ILocalPermission } from '../../composables/useUserPermission'
import type { IRendererParticipant } from '../../composables/useParticipants'

import ControlBarButton from './ControlBarButton.vue'
import ControlButtonFloat from './ControlButtonFloat.vue'
import SummaryFloat from './SummaryFloat.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
withDefaults(
  defineProps<{
    viewType: string
    style?: string
  }>(),
  {
    viewType: 'grid',
  },
)
const localUser = inject('localUser') as Ref<IRendererParticipant>
const usersTotal = inject('usersTotal') as Ref<number>
const hasHands = inject('hasHands') as Ref<boolean>
const isLocalLoading = inject('isLocalLoading') as Ref<boolean>
const isLocalCreator = inject('isLocalCreator') as Ref<boolean>
const applyOuters = inject('applyOuters') as Ref<number>

const localPermission = inject(
  'localPermission',
) as Ref<ILocalPermission | null>

const BUTTON_TITLE = ref({
  audio: i18nHelper.get().MeetingCommon.microphone,
  video: i18nHelper.get().MeetingCommon.camera,
  meetingDevices: i18nHelper.get().MeetingCommon.meetingDevices,
  outer: i18nHelper.get().MeetingCommon.externalAccess,
  share: i18nHelper.get().MeetingCommon.shareMeeting,
  leave: i18nHelper.get().MeetingCommon.leave,
  muteAll: i18nHelper.get().MeetingCommon.muteAll,
  summary: i18nHelper.get().MeetingCommon.summary,
  more: i18nHelper.get().MeetingCommon.more,
})

const showMoreFloat = ref(false)
const showSummaryTip = ref(false)

const screenTitle = computed(() => {
  return localUser.value?.isScreenShareEnabled
    ? i18nHelper.get().MeetingCommon.stopSharing
    : i18nHelper.get().MeetingControlBar.share
})
const handTitle = computed(() => {
  return localUser.value?.isHandup
    ? i18nHelper.get().MeetingCommon.handDown
    : i18nHelper.get().MeetingCommon.raiseHand
})
const enableHand = computed(() => {
  const isHandup = localUser.value?.isHandup
  const enableRaise = !isHandup && localPermission.value?.raiseHand == 1
  const enableDown = isHandup && localPermission.value?.raiseHand == 1
  return enableRaise || enableDown
})
const enableLocalScreenOuterCount = computed(() => {
  return applyOuters.value && localUser.value?.isScreenShareEnabled
})
const enableOuterCount = computed(() => {
  return applyOuters.value && !localUser.value?.isScreenShareEnabled
})
const enableSummary = computed(() => {
  return isLocalCreator.value
})
const summaryHideTipKey = computed(() => {
  return `HIDE_MEETING_SUMMARY_TIP_${localUser.value?.id}`
})
const moreButtonList = computed(() => {
  const validButton = []
  if (localPermission.value?.muteall == 1) {
    validButton.push('muteAll')
  }
  if (isLocalCreator.value) {
    validButton.push('record')
  }
  validButton.push('file')
  return validButton
})

const emit = defineEmits(['mouseover', 'mouseout'])
function onOver() {
  emit('mouseover')
}
function onOut() {
  emit('mouseout')
}

function onExpand(type: any) {
  onButtonClick('devicesFloat', type)
}
function onButtonClick(type: any, status?: any) {
  if (!localUser.value?.isScreenShareEnabled && type === 'more') {
    showMoreFloat.value = !showMoreFloat.value
  } else {
    if (showMoreFloat.value) {
      showMoreFloat.value = false
    }
    bus.emit('on-control-button-click', { type, status })
  }
}

watchEffect(() => {
  if (
    enableSummary.value ||
    localUser.value?.id ||
    localUser.value?.isScreenShareEnabled
  ) {
    checkSummaryTip()
  }
})
function onSummaryTipClose() {
  localStorage.setItem(summaryHideTipKey.value, 'true')
  checkSummaryTip()
}
function checkSummaryTip() {
  const noSelfScreenShare = !localUser.value?.isScreenShareEnabled
  if (enableSummary.value && noSelfScreenShare) {
    showSummaryTip.value = !localStorage.getItem(summaryHideTipKey.value)
  } else {
    showSummaryTip.value = false
  }
}
</script>
<style scoped lang="scss">
.control-bar {
  width: 100%;
  // min-width: 985px;
  height: 86px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 14px 20px;
  box-sizing: border-box;
  background: transparent;
  box-shadow: 0px -1px 6px rgba(70, 71, 79, 0.05);
  z-index: 9;

  &.black {
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0;
    z-index: 99;

    backdrop-filter: blur(10px);
    background: rgba(37, 37, 37, 0.68);

    // opacity: 0.8;

    .user {
      .button {
        background: rgba(80, 84, 91, 0.6) !important;

        .icon {
          background-image: url('@renderer/apps/meeting/assets/meetingRoom/bar/user_active_black.svg') !important;
          background-size: cover;
        }

        &:hover {
          background: rgba(80, 84, 91, 0.3) !important;

          .icon {
            background-image: url('@renderer/apps/meeting/assets/meetingRoom/bar/user_active_black_hover.svg') !important;
            background-size: cover;
          }
        }
      }
    }
  }

  .control-left,
  .control-center,
  .control-right {
    display: flex;
    justify-content: center;
    justify-items: center;
    gap: 18px;
  }

  .control-center {
    .user {
      position: relative;
      width: 53px;
      height: 35px;

      cursor: pointer;
      user-select: none;

      .apply-tips {
        position: absolute;
        top: -50px;
        left: 50%;
        transform: translateX(-50%);

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        width: 129px;
        height: 40px;

        font-weight: 600;
        font-size: 14px;
        line-height: 40px;
        text-align: center;
        color: #ffffff;
        border-radius: 40px;
        background: #ff8f28;
        cursor: pointer;
        .count {
          display: flex;
          height: 16px;
          line-height: 16px;
          margin-left: 4px;
          padding: 0 4px;
          font-weight: 600;
          font-size: 12px;
          color: #ff8f28;
          border-radius: 8px;
          background: #fff;
        }
        .arrow {
          position: absolute;
          top: 40px;
          width: 11px;
          height: 5px;
          background-image: url('@renderer/apps/meeting/assets/meetingRoom/apply_arrow.svg');
          background-size: cover;
        }
      }
      .button {
        position: relative;

        width: 53px;
        height: 35px;

        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;

        background: #ebedf1;
        border-radius: 6px;

        &:hover {
          background: #edf2ff;

          .icon {
            background-image: url('@renderer/apps/meeting/assets/meetingRoom/bar/user_active_hover.svg');
            background-size: cover;
          }
        }

        .icon {
          width: 20px;
          height: 20px;

          background-image: url('@renderer/apps/meeting/assets/meetingRoom/bar/user_active.svg');
          background-size: cover;
        }

        .num {
          position: absolute;
          right: -8px;
          top: -8px;

          min-width: 16px;
          height: 16px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0 4px;
          box-sizing: border-box;
          font-weight: 600;
          font-size: 12px;
          background: #8b91a0;
          border: 1px solid #ffffff;
          color: #ffffff;
          border-radius: 9px;

          &.more {
            border-radius: 50%;
            width: 16px;
          }
        }
        .hand {
          position: absolute;
          width: 18px;
          height: 18px;

          bottom: -3.5px;
          right: -8.5px;
          background-size: cover;
          background-image: url('@renderer/apps/meeting/assets/meetingRoom/bar/icon-hand-prompt.svg');
        }
      }
      .title {
        width: 100%;
        text-align: center;
        margin-top: 6px;
        color: #8b91a0;
        font-weight: 400;
        font-size: 12px;
        line-height: 17px;
      }
    }
  }

  .more,
  .summary,
  .audio,
  .video {
    position: relative;
  }
}
</style>
