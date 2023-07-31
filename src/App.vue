<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
// import { RouterLink, RouterView } from 'vue-router'
import {
  type Card,
  allOpponentCards,
  allPlayerCards,
  emptyBoardArrays,
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
let playerBoardCards = reactive(emptyBoardArrays)
// let opponentBoardCards = reactive(dummyOpponentCards)
let opponentBoardCards = reactive(emptyBoardArrays)
// let playerBuffs = reactive(dummyPlayerBuffs)
// let opponentBuffs = reactive(dummyOpponentBuffs)
let playerBuffs = reactive(emptyBoardArrays)
let opponentBuffs = reactive(emptyBoardArrays)
// let specialDeadPile = ref(dummySpecialCards)
let specialDeadPile = ref(emptyCardArray)
let cardModal = ref(false)
let slideIndex = ref(1)
let carouselIsHidden = ref(false)
let activeCardRow = ref(emptyCardArray)
let playerHandIsActive = ref(false)
let boardEnabled = ref(false)

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

// METHODS

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

function startTurn() {
  // TODO: Display "Your Turn" / "Opponent's Turn" dialog (contains avatar of Leader Card)
  if (isPlayerTurn.value) {
    // TODO: Enable / disable board controls
    boardEnabled.value = true
  } else {
    // CPU logic
    // Play random card
    // playCard(getRandomCard())
  }
}

function playCard(card: Card) {
  console.log("playCard() card: ", card)

  // TODO: Determine row to push card to
  isPlayerTurn.value = !isPlayerTurn.value
  startTurn()
}

function getRowTotal(arr: Card[]) {
  let total = 0
  for (let i = 0; i < arr.length; i++) {
    total = total + arr[i].value
  }
  return total
}

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

function pass() {
  alert('You shall not pass!')
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
    // playCard(selectedCarouselCard)
  } else {
    // Player is redrawing a card before the game
  }
}

// HELPER METHODS

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
              :default-value="card.defaultValue"
              :description="card.description"
              :desktop="isDesktop"
              :faction="card.faction"
              :hero="card.hero"
              :image="card.image"
              :name="card.name"
              :type-icon="card.typeIcon"
              :value="card.value"
              class="slide fade"
              :class="{ active: card.active }"
              tabindex="2"
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
              :default-value="card.defaultValue"
              :desktop="isDesktop"
              :faction="card.faction"
              :hero="card.hero"
              :image="card.image"
              :type-icon="card.typeIcon"
              :value="card.value"
              :class="{ active: card.active }"
              class="no-mobile-highlight"
              tabindex="4"
              :key="j"
              @click="opponentBoardCardClick(j, i)"
              @keyup.enter="opponentBoardCardClick(j, i)"
              @keyup.space="opponentBoardCardClick(j, i)"
            />
          </div>
        </div>
      </div>

      <div class="game-details">
        <button class="btn pass-btn no-mobile-highlight" @click="pass"><span>PASS</span></button>
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
            <div class="avatar active" :style="{ backgroundImage: `url(${playerImg})` }"></div>
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
          v-if="specialDeadPile.length && specialDeadPile.length > 1"
          :ability="specialDeadPile[specialDeadPile.length - 1].ability"
          :ability-icon="specialDeadPile[specialDeadPile.length - 1].abilityIcon"
          :default-value="specialDeadPile[specialDeadPile.length - 1].value"
          :desktop="isDesktop"
          :faction="specialDeadPile[specialDeadPile.length - 1].faction"
          :hero="specialDeadPile[specialDeadPile.length - 1].hero"
          :image="specialDeadPile[specialDeadPile.length - 1].image"
          :type-icon="specialDeadPile[specialDeadPile.length - 1].typeIcon"
          :value="specialDeadPile[specialDeadPile.length - 1].value"
          :class="{ active: specialDeadPile[specialDeadPile.length - 1].active }"
          class="no-mobile-highlight"
          tabindex="5"
        />
        <BoardCard v-else :desktop="isDesktop" class="no-mobile-highlight" tabindex="5" />

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
            <div class="avatar" :style="{ backgroundImage: `url(${opponentImg})` }"></div>
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
              :default-value="card.defaultValue"
              :desktop="isDesktop"
              :faction="card.faction"
              :hero="card.hero"
              :image="card.image"
              :type-icon="card.typeIcon"
              :value="card.value"
              :class="{ active: card.active }"
              class="no-mobile-highlight"
              tabindex="3"
              :key="j"
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
            :default-value="card.defaultValue"
            :desktop="isDesktop"
            :faction="card.faction"
            :hero="card.hero"
            :image="card.image"
            :type-icon="card.typeIcon"
            :value="card.value"
            :class="{ active: card.active }"
            class="no-mobile-highlight"
            tabindex="1"
            :key="i"
            @click="handCardClick(i)"
            @keyup.enter="handCardClick(i)"
            @keyup.space="handCardClick(i)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
