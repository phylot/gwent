<script setup lang="ts">
import { onMounted, ref } from 'vue'
// import { RouterLink, RouterView } from 'vue-router'
import MainMenuView from './views/MainMenuView.vue'
import GameBoardView from './views/GameBoardView.vue'

// GLOBAL DATA

let cpuDifficulty = 0.3
let mainMenuIsActive = ref(true)
let gameIsActive = ref(false)
let isDesktop = ref(false)
let loading = ref(false)

// GLOBAL HOOKS

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

function play() {
  gameIsActive.value = true
  mainMenuIsActive.value = false
}

function showMenu() {
  gameIsActive.value = false
  mainMenuIsActive.value = true
}

function loadingChange(val: boolean) {
  loading.value = val
}
</script>

<template>
  <transition name="fade">
    <div v-if="loading" class="loader" role="alert">Loading...</div>
  </transition>

  <transition name="fast-fade">
    <MainMenuView
      v-if="mainMenuIsActive"
      @loading-change="loadingChange"
      @play="play"
    ></MainMenuView>
  </transition>

  <transition name="fast-fade">
    <GameBoardView
      v-if="gameIsActive"
      :cpu-difficulty="cpuDifficulty"
      :desktop="isDesktop"
      @loading-change="loadingChange"
      @show-menu="showMenu"
    ></GameBoardView>
  </transition>
</template>
