<script setup lang="ts">
import { onMounted, ref } from 'vue'
// import { RouterLink, RouterView } from 'vue-router'
import GameBoardView from './views/GameBoardView.vue'

// GLOBAL DATA

let cpuDifficulty = 0.3
let gameIsActive = ref(true)
let isDesktop = ref(false)
let loading = ref(true)

// HOOKS

onMounted(() => {
  onResize()
  window.addEventListener('resize', onResize)
})

// GLOBAL METHODS

function onResize() {
  let width = window.innerWidth
  let height = window.innerHeight
  let isLandscape = width > height

  isDesktop.value =
    (height >= 880 && isLandscape) || (width >= 768 && height >= 1024 && !isLandscape)
}

function loadingChange(val: boolean) {
  loading.value = val
}
</script>

<template>
  <transition name="fade">
    <div v-if="loading" class="loader" role="alert">Loading...</div>
  </transition>
  <transition name="fade">
    <GameBoardView
      v-if="gameIsActive"
      :cpu-difficulty="cpuDifficulty"
      :desktop="isDesktop"
      @loading-change="loadingChange"
    ></GameBoardView>
  </transition>
</template>
