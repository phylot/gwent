<script setup lang="ts">
import { onMounted, ref } from 'vue'
// import { RouterLink, RouterView } from 'vue-router'
import MainMenuView from './views/MainMenuView.vue'
import GameBoardView from './views/GameBoardView.vue'

// GLOBAL DATA

let cpuDifficulty = 0.3
let mainMenuIsActive = ref(false)
let gameIsActive = ref(false)
let isDesktop = ref(false)
let loading = ref(false)

// GLOBAL HOOKS

onMounted(() => {
  onResize()
  window.addEventListener('resize', onResize)

  loading.value = true

  // Preload background image
  loadImage(new URL(`./assets/images/main-menu-bg.jpg`, import.meta.url).href, () => {
    loading.value = false
    showMenu()
  })
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
  mainMenuIsActive.value = false
  loading.value = true

  // Timeout to allow loader to fade in fully
  setTimeout(() => {
    gameIsActive.value = true
  }, 200)
}

function showMenu() {
  gameIsActive.value = false
  mainMenuIsActive.value = true
}

function loadImage(imageUrl: string, callback: Function) {
  let img = new Image()
  img.onload = function () {
    if (callback) {
      callback()
    }
  }
  img.onerror = function (err) {
    console.log('loadImage ERROR: ', err)
  }
  img.src = imageUrl
}

function loadingChange(val: boolean) {
  loading.value = val
}
</script>

<template>
  <transition name="fast-fade">
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
