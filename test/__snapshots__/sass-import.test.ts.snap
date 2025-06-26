<template>
  <div class="setting-cell" @click.stop="click">
    <div class="setting__left">
      <div class="setting__left__title">
        {{ title }}
      </div>
      <div class="setting__left__subtitle" v-if="subtitle">
        {{ subtitle }}
      </div>
    </div>
    <div class="setting-cell__right">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  subtitle?: string
}>()
//click
const emit = defineEmits(['click'])
const click = () => {
  emit('click')
}
</script>

<style scoped>
@import './SettingCell.scss';
</style>
