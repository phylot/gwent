<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
// import { RouterLink, RouterView } from 'vue-router'
import {
  type Card,
  allOpponentCards,
  allPlayerCards,
  emptyPlayerBoardArrays,
  emptyOpponentBoardArrays,
  emptyPlayerBuffsArrays,
  emptyOpponentBuffsArrays,
  emptyCardArray
  // dummyPlayerCards,
  // dummyOpponentCards,
  // dummySpecialCards,
  // dummyPlayerBuffs,
  // dummyOpponentBuffs,
} from './data/default-cards'
import BoardCard from './components/BoardCard.vue'
import CardModal from './components/CardModal.vue'
import CarouselCard from './components/CarouselCard.vue'

// DATA

let loading = ref(true)
let isDesktop = ref(false)

// Board-related
let playerDeck = ref(allPlayerCards)
let opponentDeck = ref(allOpponentCards)
let playerHand = ref(emptyCardArray)
let opponentHand = ref(emptyCardArray)
// let playerBoardCards = reactive(dummyPlayerCards)
let playerBoardCards = reactive(emptyPlayerBoardArrays)
// let opponentBoardCards = reactive(dummyOpponentCards)
let opponentBoardCards = reactive(emptyOpponentBoardArrays)
// let playerBuffs = reactive(dummyPlayerBuffs)
// let opponentBuffs = reactive(dummyOpponentBuffs)
let playerBuffs = reactive(emptyPlayerBuffsArrays)
let opponentBuffs = reactive(emptyOpponentBuffsArrays)
// let specialDeadPile = ref(dummySpecialCards)
let specialDeadPile = ref(emptyCardArray)
let playerHandIsActive = ref(false)
let activeCardRow = ref(emptyCardArray)
let slideIndex = ref(1)
let cardModal = ref(false)
let carouselIsHidden = ref(false)
let boardDisabled = ref(true)

// Game stats
let playerIsLead = ref(false)
let isPlayerTurn = ref(false)
let playerIsPassed = ref(false)
let opponentIsPassed = ref(false)
let playerHasRound = ref(false)
let opponentHasRound = ref(false)

// TODO: Derive from Leader cards
const playerImg = new URL(`./assets/images/br-wellington.jpg`, import.meta.url)
const opponentImg = new URL(`./assets/images/fr-napoleon.jpg`, import.meta.url)

// COMPUTED DATA

const opponentTotal = computed((): number => {
  let total = 0
  for (let i = 0; i < opponentBoardCards.length; i++) {
    for (let j = 0; j < opponentBoardCards[i].length; j++) {
      total = total + opponentBoardCards[i][j].value
    }
  }
  return total
})

const playerTotal = computed((): number => {
  let total = 0
  for (let i = 0; i < playerBoardCards.length; i++) {
    for (let j = 0; j < playerBoardCards[i].length; j++) {
      total = total + playerBoardCards[i][j].value
    }
  }
  return total
})

const rowTotals = computed(
  (): {
    player: number[]
    opponent: number[]
  } => {
    let totals: { player: number[]; opponent: number[] } = { player: [], opponent: [] }

    for (let i = 0; i < playerBoardCards.length; i++) {
      totals.player.push(getRowTotal(playerBoardCards[i]))
    }
    for (let i = 0; i < opponentBoardCards.length; i++) {
      totals.opponent.push(getRowTotal(opponentBoardCards[i]))
    }
    return totals
  }
)

const playerHandCount = computed((): number => {
  let count = 0
  if (playerHand && playerHand.value.length) {
    count = playerHand.value.length
  }
  return count
})

const opponentHandCount = computed((): number => {
  let count = 0
  if (opponentHand && opponentHand.value.length) {
    count = opponentHand.value.length
  }
  return count
})

const recentSpecialCard = computed(() => {
  let card = null
  if (specialDeadPile.value.length > 0) {
    card = specialDeadPile.value[specialDeadPile.value.length - 1]
  }
  return card
})

// HOOKS

onMounted(() => {
  onResize()
  window.addEventListener('resize', onResize)

  preloadCardImages(allPlayerCards, () => {
    // TODO: Call this from main menu "New Game" or "Continue" click
    setupGame(() => {
      loading.value = false
      startTurn()
    })
  })
})

// METHODS - GAME SETUP

function onResize() {
  let width = window.innerWidth
  let height = window.innerHeight
  let isLandscape = width > height

  isDesktop.value =
    (height >= 880 && isLandscape) || (width >= 768 && height >= 1024 && !isLandscape)
}

function preloadCardImages(cards: Card[], callback: Function) {
  let imageCount = cards.length
  let imagesLoaded = 0

  for (let i = 0; i < imageCount; i++) {
    loadImage(cards[i].image, () => {
      imagesLoaded++
      if (imagesLoaded == imageCount) {
        if (callback) {
          callback()
        }
      }
    })
  }
}

function loadImage(image: string, callback: Function) {
  let img = new Image()
  img.onload = function () {
    if (callback) {
      callback()
    }
  }
  img.onerror = function (err) {
    console.log('loadImage ERROR: ', err)
  }
  img.src = new URL(`./assets/images/${image}`, import.meta.url).href
}

function setupGame(callback: Function) {
  // Reset any existing game data / set default values

  // Generate a random hand of 10 cards for each player
  playerHand.value = dealRandomCards(playerDeck.value, 10)
  opponentHand.value = dealRandomCards(opponentDeck.value, 10)

  // console.log("playerHand: ", JSON.parse(JSON.stringify(playerHand.value)))
  // console.log("playerDeck: ", JSON.parse(JSON.stringify(playerDeck.value)))

  // Decide lead player / first turn
  playerIsLead.value = isPlayerTurn.value = getChanceOutcome(0.5)
  // playerIsLead.value = isPlayerTurn.value = true // TEMP

  // TODO: Swap cards dialog + logic
  // • return promise (to delay/prevent below callback)
  // • Dialog actions are "SWAP" and "DONE"
  // • Add title attribute to CardModal slot

  if (callback) {
    callback()
  }
}

function dealRandomCards(arr: Card[], amount: number) {
  let cards = []
  for (let i = 0; i < amount; i++) {
    let randomIndex = Math.floor(Math.random() * arr.length)

    cards.push(arr[randomIndex])
    arr.splice(randomIndex, 1)
  }
  return cards
}

// function setupRound()

// METHODS - GAME LOOP

function startTurn() {
  // TODO: Display "Your Turn" / "Opponent's Turn" dialog
  // • contains avatar of Leader Card)
  // • set a timeout, then hide

  if (isPlayerTurn.value) {
    boardDisabled.value = false
  } else {
    boardDisabled.value = true
    // CPU logic
    determineCpuCard((card: Card) => {
      // console.log('CPU card: ', card)
      playCard(card, () => {
        finishTurn()
      })
    })
  }
}

function playCard(card: Card, callback: Function) {
  console.log('playCard() card: ', card)

  // Board row indexes for each card type
  const abilityIndexes: Record<string, number> = {
    close: 0,
    ranged: 1,
    siege: 2
  }
  let handArr = isPlayerTurn.value ? playerHand : opponentHand

  // TODO: Card modal animations

  setTimeout(() => {
    resetActiveCard(() => {
      // TODO: Decoy card
      // • Add visual highlight to board rows containing eligible cards for swapping
      // • Enable ONLY cards eligible for swapping
      // • Display card carousel containing ONLY cards eligible for swapping, with a "SWAP" and "CANCEL" button

      // TODO: Remove played card from 'playerHand' or 'opponentHand'

      // TODO: Determine row to push card to, based on card 'type' attribute
      if (card.type === 'special') {
        specialDeadPile.value.push(card)
      } else {
        if (isPlayerTurn.value) {
          playerBoardCards[abilityIndexes[card.type]].push(card)
        } else {
          opponentBoardCards[abilityIndexes[card.type]].push(card)
        }
      }

      // Remove card from hand
      for (let i = 0; i < handArr.value.length; i++) {
        if (handArr.value[i].id == card.id) {
          handArr.value.splice(i, 1)
        }
      }

      closeCardModal()

      // TODO: Board card animations + setTimeout

      if (callback) {
        callback()
      }
    })
  }, 1000)
}

function pass() {
  alert('You shall not pass!')
}

function determineCpuCard(callback: Function) {
  let card = null

  // TODO: Determine card to play
  card = opponentHand.value[Math.floor(Math.random() * opponentHand.value.length)] // TEMP

  if (callback) {
    callback(card)
  }
}

function finishTurn() {
  isPlayerTurn.value = !isPlayerTurn.value
  startTurn()
}

// METHODS - EVENTS

async function handCardClick(index: number) {
  // If the clicked card is already active, close the card carousel
  if (activeCardRow.value[index]?.active) {
    resetActiveCard(() => {
      closeCardModal()
    })
  } else {
    // If player hand isn't currently active, reload carousel component (hide / show it)
    if (!playerHandIsActive.value) {
      carouselIsHidden.value = true
    }
    await nextTick()
    carouselIsHidden.value = false

    resetActiveCard(() => {
      activeCardRow.value = playerHand.value
      playerHandIsActive.value = true
      slideIndex.value = index + 1
      showSlide()
      cardModal.value = true
    })
  }
}

function playerBoardCardClick(index: number, rowIndex: number) {
  activeCardRow.value = playerBoardCards[rowIndex]
  slideIndex.value = index + 1
  showSlide()
  cardModal.value = true
}

function opponentBoardCardClick(index: number, rowIndex: number) {
  activeCardRow.value = opponentBoardCards[rowIndex]
  slideIndex.value = index + 1
  showSlide()
  cardModal.value = true
}

function playerDeadPileClick() {
  console.log('playerDeadPileClick')
}

function opponentDeadPileClick() {
  console.log('opponentDeadPileClick')
}

function resetActiveCard(callback: Function) {
  for (let i = 0; i < activeCardRow.value.length; i++) {
    activeCardRow.value[i].active = false
  }
  if (callback) {
    callback()
  }
}

function changeSlide(index: number) {
  showSlide((slideIndex.value += index))
}

function showSlide(index?: number) {
  if (index || index === 0) {
    if (index > activeCardRow.value.length) {
      slideIndex.value = 1
    }
    if (index < 1) {
      slideIndex.value = activeCardRow.value.length
    }
  }

  for (let i = 0; i < activeCardRow.value.length; i++) {
    activeCardRow.value[i].active = false
  }
  activeCardRow.value[slideIndex.value - 1].active = true
}

function closeCardModal() {
  resetActiveCard(() => {
    playerHandIsActive.value = false
    cardModal.value = false
  })
}

function confirmCardModal() {
  // If the player is playing a card...
  // TODO: Also determine if player is healing a card
  if (playerHandIsActive.value) {
    // TODO: Determine selected carousel card
    playCard(activeCardRow.value[slideIndex.value - 1], () => {
      finishTurn()
    })
  } else {
    // Player is redrawing a card before the game, or swapping a decoy card, etc.
  }
}

// METHODS - HELPERS

function getRowTotal(arr: Card[]) {
  let total = 0
  for (let i = 0; i < arr.length; i++) {
    total = total + arr[i].value
  }
  return total
}

function getChanceOutcome(percentage: number) {
  return Math.random() < percentage
}
</script>

<template>
  <div class="game-container">
    <transition name="fade">
      <div v-if="loading" class="loader fade-out">Loading...</div>
    </transition>

    <div class="scroll-container">
      <CardModal v-if="cardModal" class="quick-fade">
        <div v-if="!carouselIsHidden" class="card-carousel">
          <div class="slides">
            <CarouselCard
              v-for="(card, i) in activeCardRow"
              :ability="card.ability"
              :ability-icon="card.abilityIcon"
              class="slide fade"
              :class="{ active: card.active }"
              :default-value="card.defaultValue"
              :description="card.description"
              :desktop="isDesktop"
              :faction="card.faction"
              :hero="card.hero"
              :image="card.image"
              :name="card.name"
              tabindex="2"
              :type-icon="card.typeIcon"
              :value="card.value"
              :key="i"
            >
            </CarouselCard>
          </div>
          <span
            class="prev-btn no-mobile-highlight"
            tabindex="2"
            @click="changeSlide(-1)"
            @keyup.enter="changeSlide(-1)"
            @keyup.space="changeSlide(-1)"
          >
            <v-icon name="hi-chevron-left" class="icon" :scale="isDesktop ? 1.5 : 1" />
          </span>
          <span
            class="next-btn no-mobile-highlight"
            tabindex="2"
            @click="changeSlide(1)"
            @keyup.enter="changeSlide(1)"
            @keyup.space="changeSlide(1)"
          >
            <v-icon name="hi-chevron-right" class="icon" :scale="isDesktop ? 1.5 : 1" />
          </span>
        </div>

        <button
          v-if="playerHandIsActive"
          class="btn large primary no-mobile-highlight"
          tabindex="2"
          @click="confirmCardModal"
          @keyup.enter="confirmCardModal"
          @keyup.space="confirmCardModal"
        >
          PLAY CARD
        </button>
        <button
          class="btn large no-mobile-highlight"
          tabindex="2"
          @click="closeCardModal"
          @keyup.enter="closeCardModal"
          @keyup.space="closeCardModal"
        >
          {{ playerHandIsActive ? 'CANCEL' : 'CLOSE' }}
        </button>
      </CardModal>

      <div class="opponent-board">
        <div v-for="(row, i) in opponentBoardCards" class="card-row" :key="`opponent-row-${i}`">
          <div class="row-stats">
            <div class="stat-badge opponent">{{ rowTotals.opponent[i] }}</div>
            <div v-for="(card, key) in opponentBuffs[i]" class="ability card-stat-badge" :key="key">
              <v-icon :name="card.abilityIcon" class="icon" :scale="isDesktop ? 1 : 0.8" />
            </div>
          </div>

          <div class="card-container">
            <BoardCard
              v-for="(card, j) in row"
              :ability="card.ability"
              :ability-icon="card.abilityIcon"
              :class="{ active: card.active }"
              class="no-mobile-highlight"
              :default-value="card.defaultValue"
              :desktop="isDesktop"
              :disabled="boardDisabled"
              :faction="card.faction"
              :hero="card.hero"
              :image="card.image"
              :key="j"
              tabindex="4"
              :type-icon="card.typeIcon"
              :value="card.value"
              @click="opponentBoardCardClick(j, i)"
              @keyup.enter="opponentBoardCardClick(j, i)"
              @keyup.space="opponentBoardCardClick(j, i)"
            />
          </div>
        </div>
      </div>

      <div class="game-details">
        <button
          class="btn pass-btn no-mobile-highlight"
          :class="{ disabled: !isPlayerTurn }"
          @click="isPlayerTurn ? pass() : null"
        >
          <span>PASS</span>
        </button>
        <div class="player-details">
          <div class="total">
            <v-icon
              v-if="playerHasRound"
              name="gi-round-star"
              class="icon round-icon"
              :scale="isDesktop ? 1.8 : 1.2"
              fill="gold"
            />
            <v-icon
              v-if="playerIsPassed"
              name="pr-flag-fill"
              class="icon pass-icon"
              :scale="isDesktop ? 1.8 : 1.2"
              animation="float"
              fill="white"
            />
            <div
              class="avatar"
              :class="{ active: isPlayerTurn }"
              :style="{ backgroundImage: `url(${playerImg})` }"
            ></div>
            <div class="stat-badge player">{{ playerTotal }}</div>
          </div>
          <div class="details">
            <div class="name">
              <div class="title">Wellington</div>
              <div class="subtitle">British</div>
            </div>
            <div class="stats">
              <div class="hand-total">
                <v-icon name="fa-layer-group" class="icon" :scale="isDesktop ? 2 : 1" />
                {{ playerHandCount }}
              </div>
              <div
                class="dead-pile no-mobile-highlight"
                @click="playerDeadPileClick"
                @keyup.enter="playerDeadPileClick"
                @keyup.space="playerDeadPileClick"
              >
                <v-icon name="io-skull" class="icon" :scale="isDesktop ? 2 : 1" />
                0
              </div>
            </div>
          </div>
        </div>

        <BoardCard
          v-if="recentSpecialCard"
          :ability="recentSpecialCard.ability"
          :ability-icon="recentSpecialCard.abilityIcon"
          :class="{ active: recentSpecialCard.active }"
          class="no-mobile-highlight"
          :default-value="recentSpecialCard.value"
          :desktop="isDesktop"
          :disabled="boardDisabled"
          :faction="recentSpecialCard.faction"
          :hero="recentSpecialCard.hero"
          :image="recentSpecialCard.image"
          tabindex="5"
          :type-icon="recentSpecialCard.typeIcon"
          :value="recentSpecialCard.value"
        />
        <BoardCard v-else :desktop="isDesktop" disabled class="no-mobile-highlight" tabindex="5" />

        <div class="opponent-details">
          <div class="total">
            <v-icon
              v-if="opponentHasRound"
              name="gi-round-star"
              class="icon round-icon"
              :scale="isDesktop ? 1.8 : 1.2"
              fill="gold"
            />
            <v-icon
              v-if="opponentIsPassed"
              name="pr-flag-fill"
              class="icon pass-icon"
              :scale="isDesktop ? 1.8 : 1.2"
              animation="float"
              fill="white"
            />
            <div
              class="avatar"
              :class="{ active: !isPlayerTurn }"
              :style="{ backgroundImage: `url(${opponentImg})` }"
            ></div>
            <div class="stat-badge opponent">{{ opponentTotal }}</div>
          </div>
          <div class="details">
            <div class="name">
              <div class="title">Napoleon</div>
              <div class="subtitle">French</div>
            </div>
            <div class="stats">
              <div class="hand-total">
                <v-icon name="fa-layer-group" class="icon" :scale="isDesktop ? 2 : 1" />
                {{ opponentHandCount }}
              </div>
              <div
                class="dead-pile no-mobile-highlight"
                @click="opponentDeadPileClick"
                @keyup.enter="opponentDeadPileClick"
                @keyup.space="opponentDeadPileClick"
              >
                <v-icon name="io-skull" class="icon" :scale="isDesktop ? 2 : 1" />
                0
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="player-board">
        <div v-for="(row, i) in playerBoardCards" class="card-row" :key="`player-row-${i}`">
          <div class="row-stats">
            <div class="stat-badge player">{{ rowTotals.player[i] }}</div>
            <div v-for="(card, key) in playerBuffs[i]" class="ability card-stat-badge" :key="key">
              <v-icon :name="card.abilityIcon" class="icon" :scale="isDesktop ? 1 : 0.8" />
            </div>
          </div>

          <div class="card-container">
            <BoardCard
              v-for="(card, j) in row"
              :ability="card.ability"
              :ability-icon="card.abilityIcon"
              :class="{ active: card.active }"
              class="no-mobile-highlight"
              :default-value="card.defaultValue"
              :desktop="isDesktop"
              :faction="card.faction"
              :hero="card.hero"
              :image="card.image"
              :key="j"
              tabindex="3"
              :type-icon="card.typeIcon"
              :value="card.value"
              @click="playerBoardCardClick(j, i)"
              @keyup.enter="playerBoardCardClick(j, i)"
              @keyup.space="playerBoardCardClick(j, i)"
            />
          </div>
        </div>

        <div class="card-row player-hand">
          <BoardCard
            v-for="(card, i) in playerHand"
            :ability="card.ability"
            :ability-icon="card.abilityIcon"
            :class="{ active: card.active }"
            class="no-mobile-highlight"
            :default-value="card.defaultValue"
            :desktop="isDesktop"
            :disabled="boardDisabled"
            :faction="card.faction"
            :hero="card.hero"
            :image="card.image"
            :key="i"
            tabindex="1"
            :type-icon="card.typeIcon"
            :value="card.value"
            @boardcard-click="handCardClick(i)"
            @keyup.enter="handCardClick(i)"
            @keyup.space="handCardClick(i)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
