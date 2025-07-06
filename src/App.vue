<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
// import { RouterLink, RouterView } from 'vue-router'
import { type Card, type CardCollection } from '@/types'
import { Howl } from 'howler'
import DeckManagerView from './views/DeckManagerView.vue'
import GameBoardView from './views/GameBoardView.vue'
import MainMenuView from './views/MainMenuView.vue'
import AwardBadge from './components/AwardBadge.vue'
import CardUnlockModal from './components/CardUnlockModal.vue'
import StandardModal from './components/StandardModal.vue'

import { defaultCards, defaultLeaderCards, unlockableCards } from './data/cards'
import { defaultAwards } from './data/awards'

// GLOBAL DATA

let cpuDifficulty = 0.3
let gameIsActive = ref(false)
let gameBoardDisabled = ref(false)
let mainMenuIsActive = ref(false)
let mainMenuDisabled = ref(false)
let deckManagerIsActive = ref(false)
let deckManagerIsPreMatch = ref(false)
let isDesktop = ref(false)
let loading = ref(true)
let showContinueBtn = ref(false)
let themeSong: Howl
let titleSequenceHasPlayed = ref(false)
let themeSongFadeTimeout: ReturnType<typeof setTimeout>
let playerCardCollection = JSON.parse(JSON.stringify(defaultCards))
let playerLeaderCards = JSON.parse(JSON.stringify(defaultLeaderCards))
let opponentCardCollection = JSON.parse(JSON.stringify(defaultCards))
let opponentLeaderCards = JSON.parse(JSON.stringify(defaultLeaderCards))
let selectedPlayerDeck: Card[] = []
let selectedPlayerLeader: Card
let selectedOpponentDeck: Card[] = []
let selectedOpponentLeader: Card
let playerAwards = ref(JSON.parse(JSON.stringify(defaultAwards)))
let awardsModal = ref()
let playerWins: number = 0
let unlockedCard = ref<Card>()
let cardUnlockModal = ref()
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

interface FactionAndCollection {
  faction: string
  collection: CardCollection
}

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
      opponentCardCollection[faction][key] = await preloadCards(
        opponentCardCollection[faction][key]
      )
    }
  }

  // Preload leader cards
  for (const faction in playerLeaderCards) {
    playerLeaderCards[faction].collection = await preloadCards(
      playerLeaderCards[faction].collection
    )
    playerLeaderCards[faction].selected = await preloadCards([playerLeaderCards[faction].selected])
    playerLeaderCards[faction].selected = playerLeaderCards[faction].selected[0]
  }
  for (const faction in opponentLeaderCards) {
    opponentLeaderCards[faction].collection = await preloadCards(
      opponentLeaderCards[faction].collection
    )
    opponentLeaderCards[faction].selected = await preloadCards([
      opponentLeaderCards[faction].selected
    ])
    opponentLeaderCards[faction].selected = opponentLeaderCards[faction].selected[0]
  }

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

    // Read total player wins from localStorage
    let retrievedWins: string | null = localStorage.getItem('playerWins')
    if (retrievedWins) {
      playerWins = JSON.parse(retrievedWins)
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
  showContinueBtn.value = false
  gameIsActive.value = false

  clearTimeout(themeSongFadeTimeout)
  themeSong.stop()
  themeSong.volume(1)
  themeSong.play()

  setTimeout(
    () => {
      mainMenuIsActive.value = true

      themeSongFadeTimeout = setTimeout(() => {
        if (!gameIsActive.value) {
          themeSong.fade(themeSong.volume(), 0, 12000)
        }
      }, 48000)
    },
    titleSequenceHasPlayed.value ? 0 : 1500
  )
}

function showDeckManager(preMatch: boolean) {
  mainMenuIsActive.value = false
  gameIsActive.value = false
  deckManagerIsPreMatch.value = preMatch
  clearTimeout(themeSongFadeTimeout)
  themeSong.fade(themeSong.volume(), 0, 4000)

  // Timeout to allow main menu to fade out
  setTimeout(() => {
    deckManagerIsActive.value = true
  }, 1000)
}

function cancelDeckManager() {
  deckManagerIsActive.value = false

  // Timeout to allow theme song to fade out
  setTimeout(() => {
    showMainMenu()
  }, 1200)
}

function deckManagerSave(collection: CardCollection) {
  playerCardCollection = collection
  deckManagerIsActive.value = false
  themeSong.fade(themeSong.volume(), 0, 1200)

  saveCardsToStorage(() => {
    // Timeout to allow theme song to fade out
    setTimeout(() => {
      showMainMenu()
    }, 1200)
  })
}

function showAwards() {
  mainMenuDisabled.value = true
  awardsModal.value.show().then(() => {
    mainMenuDisabled.value = false
  })
}

function play() {
  clearTimeout(themeSongFadeTimeout)
  mainMenuIsActive.value = false

  // Timeout to allow Main Menu to fade out
  setTimeout(() => {
    showDeckManager(true)
  }, 1000)
}

function setupGameAndStart(deckSelection: FactionAndCollection) {
  let opponentFaction: string = deckSelection.faction === 'british' ? 'french' : 'british'
  loading.value = true
  deckManagerIsActive.value = false

  playerCardCollection = deckSelection.collection
  saveCardsToStorage(() => {
    // Set decks and leaders based on player's faction choice
    selectedPlayerDeck = playerCardCollection[deckSelection.faction].deck
    selectedPlayerLeader = playerLeaderCards[deckSelection.faction].selected

    selectedOpponentDeck = opponentCardCollection[opponentFaction].deck
    selectedOpponentLeader = opponentLeaderCards[opponentFaction].selected

    // Timeout to allow loader to fade in
    setTimeout(() => {
      gameIsActive.value = true
    }, 200)
  })
}

function skip() {
  themeSong.stop()
  themeSong.seek(18)
  themeSong.play()
}

function saveCardsToStorage(callback?: Function) {
  localStorage.setItem('playerCards', JSON.stringify(playerCardCollection))
  localStorage.setItem('playerLeaderCards', JSON.stringify(playerLeaderCards))
  localStorage.setItem('opponentCards', JSON.stringify(opponentCardCollection))
  localStorage.setItem('opponentLeaderCards', JSON.stringify(opponentLeaderCards))

  if (callback) {
    callback()
  }
}

function saveAwardsToStorage(awardKeys: string[]) {
  for (const awardKey of awardKeys) {
    playerAwards.value[awardKey].active = true
  }
  localStorage.setItem('awards', JSON.stringify(playerAwards.value))
}

function loadingChange(val: boolean) {
  loading.value = val
}

async function determineCardUnlock() {
  playerWins++
  localStorage.setItem('playerWins', JSON.stringify(playerWins))

  // Unlock 'Card Master' award
  if (playerWins === playerAwards.value.cardmaster.targetCount) {
    saveAwardsToStorage(['cardmaster'])
  }

  // If there's an unlockable card match...
  if (unlockableCards[playerWins]) {
    // Disable GameBoardView
    gameBoardDisabled.value = true

    let card = unlockableCards[playerWins]

    // Preload unlocked card
    let preloadedCard = await preloadCards([card])
    if (preloadedCard) {
      card = preloadedCard[0]
    }

    // Copy card to player's collection
    playerCardCollection[card.faction].collection.push(card)

    // Determine if a card should be removed from the opponent's deck
    for (let i = 0; i < opponentCardCollection[card.faction].deck.length; i++) {
      let opponentDeckCard = opponentCardCollection[card.faction].deck[i]

      // If there's a deck card with an 'id' that matches the unlocked card's 'replacedById', move the deck card to the collection
      if (opponentDeckCard.replacedById === card.id) {
        // Move replaced card from opponent's deck to their collection
        opponentCardCollection[card.faction].collection.push(opponentDeckCard)
        opponentCardCollection[card.faction].deck.splice(i, 1)
      }
    }

    // Add the unlocked card to opponent's deck
    opponentCardCollection[card.faction].deck.push(card)

    // Set global reactive unlocked card
    unlockedCard.value = card

    setTimeout(() => {
      cardUnlockModal.value.show().then((res: boolean) => {
        if (res) {
          showDeckManager(false)
        }
        gameBoardDisabled.value = false
      })
    }, 1000)

    // Save player / opponent card collections to localStorage
    saveCardsToStorage()
  }
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

  <CardUnlockModal
    :card="unlockedCard"
    :desktop="isDesktop"
    ref="cardUnlockModal"
  ></CardUnlockModal>

  <StandardModal
    :buttons="['Close']"
    :desktop="isDesktop"
    no-primary
    ref="awardsModal"
    :title="`Awards (${awardsCount}/${Object.keys(playerAwards).length})`"
  >
    <div class="awards-gallery">
      <div class="awards-grid">
        <div v-for="(award, key) in playerAwards" class="award-container" :key="key">
          <AwardBadge
            :active="award.active"
            :desktop="isDesktop"
            :icon="award.icon"
            :name="award.name"
            :type="String(key)"
          ></AwardBadge>
          <p v-html="award.description" class="description"></p>
        </div>
      </div>
    </div>
  </StandardModal>

  <transition name="slow-fade">
    <MainMenuView
      v-if="mainMenuIsActive"
      :awards-count="awardsCount"
      :disabled="mainMenuDisabled"
      :show-menu="titleSequenceHasPlayed"
      @loading-change="loadingChange"
      @awards="showAwards"
      @manage-deck="showDeckManager"
      @play="play"
      @skip="skip"
      @title-sequence-end="titleSequenceHasPlayed = true"
    ></MainMenuView>
  </transition>

  <transition name="fast-fade">
    <DeckManagerView
      v-if="deckManagerIsActive"
      :card-collection="playerCardCollection"
      :desktop="isDesktop"
      :leader-cards="playerLeaderCards"
      :pre-match="deckManagerIsPreMatch"
      @cancel="cancelDeckManager"
      @faction-selected="setupGameAndStart"
      @save="deckManagerSave"
    ></DeckManagerView>
  </transition>

  <transition name="fast-fade">
    <GameBoardView
      v-if="gameIsActive"
      :cpu-difficulty="cpuDifficulty"
      :desktop="isDesktop"
      :disabled="gameBoardDisabled"
      :opponent-cards="selectedOpponentDeck"
      :opponent-leader-card="selectedOpponentLeader"
      :player-cards="selectedPlayerDeck"
      :player-leader-card="selectedPlayerLeader"
      @loading-change="loadingChange"
      @player-win="determineCardUnlock"
      @save-awards="saveAwardsToStorage"
      @show-menu="showMainMenu"
    ></GameBoardView>
  </transition>
</template>
