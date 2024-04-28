<script setup lang="ts">
import { onMounted, ref } from 'vue'
// import { RouterLink, RouterView } from 'vue-router'
import { Howl } from 'howler'
import GameBoardView from './views/GameBoardView.vue'
import MainMenuView from './views/MainMenuView.vue'
import ManageDeckView from './views/ManageDeckView.vue'
import Modal from './components/Modal.vue'

// GLOBAL DATA

let cpuDifficulty = 0.3
let gameIsActive = ref(false)
let mainMenuIsActive = ref(false)
let mainMenuDisabled = ref(false)
let awardsModal = ref()
let manageDeckIsActive = ref(false)
let isDesktop = ref(false)
let loading = ref(true)
let showContinueBtn = ref(false)
let themeSong = new Howl({
  src: [new URL(`./assets/audio/sharpe-theme.ogg`, import.meta.url).href],
  volume: 1,
  preload: true,
  onload: () => {
    // Preload background image
    loadImage(new URL(`./assets/images/main-menu-bg.jpg`, import.meta.url).href, () => {
      showContinueBtn.value = true
    })
  }
})

// GLOBAL HOOKS

onMounted(() => {
  loading.value = true
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

function showMainMenu() {
  loading.value = false
  gameIsActive.value = false
  themeSong.stop()
  themeSong.volume(1)
  themeSong.play()

  setTimeout(() => {
    mainMenuIsActive.value = true
    showContinueBtn.value = false

    setTimeout(() => {
      if (!gameIsActive.value) {
        themeSong.fade(themeSong.volume(), 0, 12000)
      }
    }, 48000)
  }, 1500)
}

function showManageDeck() {
  mainMenuIsActive.value = false

  // Timeout to allow main menu to fade out
  setTimeout(() => {
    manageDeckIsActive.value = true
  }, 1000)
}

function showAwards() {
  mainMenuDisabled.value = true
  awardsModal.value.show().then(() => {
    mainMenuDisabled.value = false
  })
}

function play() {
  themeSong.fade(themeSong.volume(), 0, 4000)
  mainMenuIsActive.value = false

  // Timeout to allow main menu to fade out
  setTimeout(() => {
    loading.value = true

    // Timeout to allow loader to fade in
    setTimeout(() => {
      gameIsActive.value = true
    }, 200)
  }, 1000)
}

function skip() {
  themeSong.stop()
  themeSong.seek(18)
  themeSong.play()
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
    <div v-if="loading" class="loader" role="alert">
      <template v-if="showContinueBtn">
        <div class="save-warning">
          <v-icon
            animation="pulse"
            class="icon"
            name="fa-regular-save"
            :scale="isDesktop ? 1.8 : 1.4"
            speed="fast"
          />WARNING: Your progress is saved to this device
        </div>

        <button class="btn large no-mobile-highlight" @click="showMainMenu">CONTINUE</button>
      </template>
      <template v-else
        ><v-icon
          animation="spin"
          class="icon"
          name="la-spinner-solid"
          :scale="isDesktop ? 1.8 : 1.4"
        />Loading</template
      >
    </div>
  </transition>

  <transition name="fast-fade">
    <Modal :buttons="['CLOSE']" :desktop="isDesktop" no-primary ref="awardsModal" title="Awards">
      <div class="awards">
        <p class="no-awards-text">
          If the game deems you have done something noteworthy, it might reward you...
        </p>
      </div>
    </Modal>
  </transition>

  <transition name="slow-fade">
    <MainMenuView
      v-if="mainMenuIsActive"
      :disabled="mainMenuDisabled"
      @loading-change="loadingChange"
      @awards="showAwards"
      @manage-deck="showManageDeck"
      @play="play"
      @skip="skip"
    ></MainMenuView>
  </transition>

  <transition name="fast-fade">
    <ManageDeckView v-if="manageDeckIsActive"></ManageDeckView>
  </transition>

  <transition name="fast-fade">
    <GameBoardView
      v-if="gameIsActive"
      :cpu-difficulty="cpuDifficulty"
      :desktop="isDesktop"
      @loading-change="loadingChange"
      @show-menu="showMainMenu"
    ></GameBoardView>
  </transition>
</template>
