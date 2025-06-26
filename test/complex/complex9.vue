<template>
  <div
    :id="`${participant?.id}_user_video`"
    class="participant-card"
    ref="participantCardRef"
    :style="itemStyle"
  >
    <div class="item-header">
      <div
        v-if="needPermission"
        class="permission"
        @click.stop="onPermissionClick"
      ></div>
    </div>
    <div class="relative user-cont flex items-center justify-center">
      <img
        v-show="!participant?.isCameraEnabled"
        :src="avatar"
        loading="lazy"
        alt=""
        class="avatar rounded-lg"
        draggable="false"
      />
      <!-- loading -->
      <img
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        v-show="enableCamera"
        src="@renderer/apps/meeting/assets/common/loading.svg"
        alt=""
      />
      <video
        v-show="enableCamera"
        :id="`video_palyer_${activeCameraDid}`"
        class="absolute w-full h-full object-contain"
        ref="videoRef"
      ></video>
      <!-- <audio ref="audioRef"></audio> -->
    </div>
    <div class="user-info">
      <div class="info-left">
        <img v-if="userTypeIcon" class="type" :src="userTypeIcon" />
        <div class="name truncate" :class="{ pl: userTypeIcon }">
          {{ participant?.name || participant?.uid }}
        </div>
      </div>
      <div
        v-if="
          !participant?.isMicrophoneEnabled || participant?.isScreenShareEnabled
        "
        class="info-right"
      >
        <img
          v-if="!participant?.isMicrophoneEnabled"
          class="audio"
          src="@renderer/apps/meeting/assets/meetingRoom/user/grid_audio_mute.png"
        />
        <div
          v-if="
            !participant?.isMicrophoneEnabled &&
            participant?.isScreenShareEnabled &&
            !isGrid
          "
          class="line"
        ></div>
        <img
          v-if="participant?.isScreenShareEnabled && !isGrid"
          class="screen"
          src="@renderer/apps/meeting/assets/meetingRoom/user/share_screen.svg"
        />
      </div>
    </div>
    <div v-show="participant?.isSpeaking" class="speaking"></div>
  </div>
</template>
<script setup lang="ts">
import {
  ref,
  nextTick,
  watch,
  computed,
  inject,
  type Ref,
  onMounted,
  onUnmounted,
} from 'vue'
import { useElementBounding } from '@vueuse/core'

import bus from '@renderer/apps/meeting/utils/bus'

import { getUserAvatar, getUserTypeIcon } from '../../utils/participants'
import type { IRendererParticipant } from '../../composables/useParticipants'

const activeCameraDid = inject('activeCameraDid') as Ref<string>
const props = withDefaults(
  defineProps<{
    participant: IRendererParticipant | null
    itemStyle?: any
    needPermission?: boolean
    isGrid?: boolean
  }>(),
  {
    participant: null,
    itemStyle: null,
    needPermission: true,
    isGrid: true,
  },
)
const participantCardRef = ref(null)
const videoRef = ref(null)
// const audioRef = ref(null);

const avatar = computed(() => {
  return getUserAvatar(
    props.participant?.avatar || '',
    props.participant?.userType,
  )
})
const userTypeIcon = computed(() => {
  return getUserTypeIcon(
    props.participant?.roleType,
    props.participant?.userType,
  )
})
const isLocal = computed(() => {
  return props.participant?.isLocal
})
const enableCamera = computed(() => {
  const cameraPub = props.participant?.cameraPublication
  return !!(
    cameraPub &&
    cameraPub.isSubscribed &&
    !cameraPub.isMuted &&
    cameraPub.videoTrack
  )
})
// const enableMic = computed(() => {
//   const micPub = props.participant?.micPublication;
//   return !!(micPub && micPub.isSubscribed && !micPub.isMuted && micPub.audioTrack);
// });

watch(
  () => props.participant?.id,
  (nv: string) => {
    if (nv) {
      attachTracks()
    }
  },
)
watch(
  () => enableCamera.value,
  (nv: boolean) => {
    attachTracks()
  },
)
watch(
  () => activeCameraDid.value,
  (nv: string) => {
    if (nv) {
      // nextTick(() => {
      attachTracks()
      // });
    }
  },
)
// watch(
//   () => enableMic.value,
//   (nv: boolean) => {
//     attachTracks();
//   }
// );
watch(
  () => props.participant?.isCameraEnabled,
  (nv: boolean) => {
    attachTracks()
  },
)
// watch(
//   () => props.participant?.isMicrophoneEnabled,
//   (nv: boolean) => {
//     attachTracks();
//   }
// );
onMounted(() => {
  attachTracks()
})

onUnmounted(() => {
  clearMediaSources()
})

// Method to attach video and audio tracks
const attachTracks = () => {
  nextTick(() => {
    const videoElm = videoRef.value
    // const audioElm = audioRef.value;

    // if (!videoElm || !audioElm) return;
    if (!videoElm) return

    const cameraPub = props.participant?.cameraPublication
    // const micPub = props.participant?.micPublication;

    // Attach camera track
    if (
      cameraPub &&
      cameraPub.isSubscribed &&
      !cameraPub.isMuted &&
      cameraPub.videoTrack
    ) {
      console.log('aaaaaaaaaaaa---cam', props.participant.id)

      cameraPub.videoTrack.attach(videoElm)

      // Handle local participant video flip
      if (isLocal.value) {
        ;(videoElm as any).style.transform = 'scale(-1, 1)'
      }
    } else {
      ;(videoElm as any).srcObject = null
      ;(videoElm as any).src = ''
    }

    // Attach microphone track
    // if (
    //   micPub &&
    //   micPub.isSubscribed &&
    //   !micPub.isMuted &&
    //   micPub.audioTrack &&
    //   !isLocal.value
    // ) {
    //   console.log('aaaaaaaaaaaa---mic');

    //   micPub.audioTrack.attach(audioElm);
    // } else {
    //   (audioElm as any).srcObject = null;
    //   (audioElm as any).src = '';
    // }
  })
}
// Method to clear video and audio sources
const clearMediaSources = () => {
  const videoElm = videoRef.value
  // const audioElm = audioRef.value;

  // if (!videoElm || !audioElm) return;
  if (!videoElm) return

  if (videoElm) {
    ;(videoElm as any).srcObject = null
    ;(videoElm as any).src = ''
  }
  // if (audioElm) {
  //   (audioElm as any).srcObject = null;
  //   (audioElm as any).src = '';
  // }
}

function onPermissionClick(e: any) {
  e.stopPropagation()
  // if (props.participant?.userType === 'DEVICE') return

  doPermissionFloatShow()
}
function doPermissionFloatShow() {
  const { top, left } = useElementBounding(participantCardRef)
  // showPermissionFloat.value = true;
  // permissionFloatPos.value = {
  //   x: left.value,
  //   y: top.value
  // };
  // targetParticipant.value = props.participant;

  bus.emit('on-permission-click', {
    showFloat: true,
    floatPos: {
      x: left.value,
      y: top.value,
    },
    targetUser: props.participant,
  })
}
</script>
<style scoped lang="scss">
.participant-card {
  .user-info {
    .info-left,
    .info-right {
      width: 100%;
      height: 32px;

      display: flex;
      align-items: flex-end;
    }
    .info-right {
      width: fit-content;
      height: 28px;
      justify-content: flex-end;
      align-items: center;

      padding: 0 12px;
      box-sizing: border-box;
      line-height: 28px;

      background: rgba(7, 7, 7, 0.5);
      backdrop-filter: blur(2px);
      border-radius: 9px 0 9px 0;
    }
  }
}
</style>
