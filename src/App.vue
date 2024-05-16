<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
// import { RouterLink, RouterView } from 'vue-router'
import { Howl } from 'howler'
import GameBoardView from './views/GameBoardView.vue'
import MainMenuView from './views/MainMenuView.vue'
import ManageDeckView from './views/ManageDeckView.vue'
import StandardModal from './components/StandardModal.vue'
import { defaultPlayerAwards } from './data/common'

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
let themeSong: Howl
let unlockedAwards = ref(JSON.parse(JSON.stringify(defaultPlayerAwards)))

// COMPUTED DATA

const awardsCount = computed((): number => {
  let count = 0
  for (const awardKey in unlockedAwards.value) {
    if (unlockedAwards.value[awardKey].active) {
      count++
    }
  }
  return count
})

// GLOBAL HOOKS

onMounted(() => {
  loading.value = true
  onResize()
  window.addEventListener('resize', onResize)
  preload()
})

// GLOBAL METHODS

function onResize() {
  let width = window.innerWidth
  let height = window.innerHeight
  let isLandscape = width > height

  isDesktop.value =
    (height >= 880 && isLandscape) || (width >= 768 && height >= 1024 && !isLandscape)
}

async function preload() {
  await preloadThemeSong()
  await loadLocalStorage()

  // Preload background image
  await loadImage(new URL(`./assets/images/main-menu-bg.jpg`, import.meta.url).href)
  showContinueBtn.value = true
}

function preloadThemeSong() {
  return new Promise<void>((resolve) => {
    themeSong = new Howl({
      src: [new URL(`./assets/audio/sharpe-theme.ogg`, import.meta.url).href],
      volume: 1,
      preload: true,
      onload: () => {
        resolve()
      },
      onloaderror: () => {
        resolve()
      }
    })
  })
}

function loadLocalStorage() {
  return new Promise<void>((resolve) => {
    // Read from localStorage
    let retrievedAwards: string | null = localStorage.getItem('awards')
    if (retrievedAwards) {
      unlockedAwards.value = JSON.parse(retrievedAwards)
    }

    // TODO: Set 'unlockableCards' object
    // TODO: Set local 'unlockableCards' variable and splice in any unclocked cards into relevant player decks
    resolve()
  })
}

function loadImage(imageUrl: string) {
  return new Promise<void>((resolve) => {
    let img = new Image()
    img.onload = function () {
      resolve()
    }
    img.onerror = function (err) {
      console.log('loadImage ERROR: ', err)
      resolve()
    }
    img.src = imageUrl
  })
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

function loadingChange(val: boolean) {
  loading.value = val
}

function saveAwards(awardKeys: string[]) {
  for (const awardKey of awardKeys) {
    unlockedAwards.value[awardKey].active = true
  }
  localStorage.setItem('awards', JSON.stringify(unlockedAwards.value))
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

        <button class="btn large no-mobile-highlight" @click="showMainMenu">Continue</button>
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
    <StandardModal
      :buttons="['Close']"
      :desktop="isDesktop"
      no-primary
      ref="awardsModal"
      :title="`Awards (${awardsCount}/5)`"
    >
      <div class="awards-gallery">
        <div v-if="awardsCount > 0" class="awards-grid">
          <template v-for="(award, key) in unlockedAwards" :key="key">
            <div v-if="award.active" class="award-container">
              <div class="award" :class="key">
                <v-icon :name="award.icon" class="icon" fill="white" :scale="isDesktop ? 2 : 1.2" />
                <div class="name">{{ award.name }}</div>
              </div>
              <p v-html="award.description" class="description"></p>
            </div>
          </template>
        </div>
        <p v-else class="no-awards-text">
          If the game deems you have done something noteworthy, it may reward you...
        </p>
      </div>
    </StandardModal>
  </transition>

  <transition name="slow-fade">
    <MainMenuView
      v-if="mainMenuIsActive"
      :awards-count="awardsCount"
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
      @save-awards="saveAwards"
      @show-menu="showMainMenu"
    ></GameBoardView>
  </transition>
</template>
