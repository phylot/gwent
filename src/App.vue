<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
// import { RouterLink, RouterView } from 'vue-router'
import { type Card } from '@/types'
import { Howl } from 'howler'
import GameBoardView from './views/GameBoardView.vue'
import MainMenuView from './views/MainMenuView.vue'
import DeckManagerView from './views/DeckManagerView.vue'
import StandardModal from './components/StandardModal.vue'

import { defaultCards, defaultLeaderCards } from './data/cards'
import { defaultAwards } from './data/awards'

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
let playerCardCollection = JSON.parse(JSON.stringify(defaultCards))
let playerLeaderCards = JSON.parse(JSON.stringify(defaultLeaderCards))
let opponentCardCollection = JSON.parse(JSON.stringify(defaultCards))
let opponentLeaderCards = JSON.parse(JSON.stringify(defaultLeaderCards))
let selectedPlayerDeck: Card[] = []
let selectedPlayerLeader: Card
let selectedOpponentDeck: Card[] = []
let selectedOpponentLeader: Card
let playerAwards = ref(JSON.parse(JSON.stringify(defaultAwards)))

// COMPUTED DATA

const awardsCount = computed((): number => {
  let count = 0
  for (const awardKey in playerAwards.value) {
    if (playerAwards.value[awardKey].active) {
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

  // Preload card collections
  for (const faction in playerCardCollection) {
    for (const key in playerCardCollection[faction]) {
      playerCardCollection[faction][key] = await preloadCards(playerCardCollection[faction][key])
    }
  }
  for (const faction in opponentCardCollection) {
    for (const key in opponentCardCollection[faction]) {
      opponentCardCollection[faction][key] = await preloadCards(opponentCardCollection[faction][key])
    }
  }

  // Preload leader cards
  for (const faction in playerLeaderCards) {
    playerLeaderCards[faction].collection = await preloadCards(playerLeaderCards[faction].collection)
    playerLeaderCards[faction].selected = await preloadCards([playerLeaderCards[faction].selected])
    playerLeaderCards[faction].selected = playerLeaderCards[faction].selected[0]
  }
  for (const faction in opponentLeaderCards) {
    opponentLeaderCards[faction].collection = await preloadCards(opponentLeaderCards[faction].collection)
    opponentLeaderCards[faction].selected = await preloadCards([opponentLeaderCards[faction].selected])
    opponentLeaderCards[faction].selected = opponentLeaderCards[faction].selected[0]
  }

  // TODO: Preload unlockable cards

  // Preload title screen background image
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
    // Read card collections from localStorage
    let retrievedPlayerCards: string | null = localStorage.getItem('playerCards')
    if (retrievedPlayerCards) {
      playerCardCollection = JSON.parse(retrievedPlayerCards)
    }
    let retrievedPlayerLeaderCards: string | null = localStorage.getItem('playerLeaderCards')
    if (retrievedPlayerLeaderCards) {
      playerLeaderCards = JSON.parse(retrievedPlayerLeaderCards)
    }
    let retrievedOpponentCards: string | null = localStorage.getItem('opponentCards')
    if (retrievedOpponentCards) {
      opponentCardCollection = JSON.parse(retrievedOpponentCards)
    }
    let retrievedOpponentLeaderCards: string | null = localStorage.getItem('opponentLeaderCards')
    if (retrievedOpponentLeaderCards) {
      opponentLeaderCards = JSON.parse(retrievedOpponentLeaderCards)
    }

    // Read awards from localStorage
    let retrievedAwards: string | null = localStorage.getItem('awards')
    if (retrievedAwards) {
      playerAwards.value = JSON.parse(retrievedAwards)
    }

    resolve()
  })
}

async function preloadCards(cards: Card[]) {
    let imageCount = cards?.length || 0
    let imagesLoaded = 0

    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        cards[i].imageUrl = new URL(`./assets/images/${cards[i].image}`, import.meta.url).href
        await loadImage(cards[i].imageUrl!)
          imagesLoaded++
          if (imagesLoaded == imageCount) {
            return cards
          }
      }
    } else {
      return cards
    }
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
    // TODO: Set / check a flag to determine if title sequence has already played, and if so, skip it

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

    // TODO: Display Deck Manager
    // TODO: Set decks and leaders based on player's faction choice (emit player's selected faction from Deck Manager)
    selectedPlayerDeck = playerCardCollection.british.deck // TEMP
    selectedOpponentDeck = opponentCardCollection.french.deck // TEMP
    selectedPlayerLeader = playerLeaderCards.british.selected // TEMP
    selectedOpponentLeader = opponentLeaderCards.french.selected // TEMP

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
    playerAwards.value[awardKey].active = true
  }
  localStorage.setItem('awards', JSON.stringify(playerAwards.value))
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

        <button class="btn large" @click="showMainMenu">Continue</button>
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
      :title="`Awards (${awardsCount}/${Object.keys(playerAwards).length})`"
    >
      <div class="awards-gallery">
        <div v-if="awardsCount > 0" class="awards-grid">
          <template v-for="(award, key) in playerAwards" :key="key">
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
    <DeckManagerView
      v-if="manageDeckIsActive"
      :card-collection="playerCardCollection"
      :desktop="isDesktop"
      :leader-cards="playerLeaderCards"
    ></DeckManagerView>
  </transition>

  <transition name="fast-fade">
    <GameBoardView
      v-if="gameIsActive"
      :player-cards="selectedPlayerDeck"
      :player-leader-card="selectedPlayerLeader"
      :opponent-cards="selectedOpponentDeck"
      :opponent-leader-card="selectedOpponentLeader"
      :cpu-difficulty="cpuDifficulty"
      :desktop="isDesktop"
      @loading-change="loadingChange"
      @save-awards="saveAwards"
      @show-menu="showMainMenu"
    ></GameBoardView>
  </transition>
</template>
