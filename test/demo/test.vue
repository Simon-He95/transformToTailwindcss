<script setup lang="ts"></script>

<template>
  <div
    class="container"
    style="background: red; width: 100%; line-height: 20px"
  >
    <div />
    <div />
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  display: flex;
}
.container > div {
  flex: 1;
  height: 100px;
  background-color: red;
}
</style>
