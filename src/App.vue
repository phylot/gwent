<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
// import { RouterLink, RouterView } from 'vue-router'
import {
  type Card,
  allCards,
  dummyPlayerCards,
  dummyOpponentCards,
  dummySpecialCards,
  emptyCardRow
} from './data/default-cards'
import BoardCard from './components/BoardCard.vue'
import CardModal from './components/CardModal.vue'
import CarouselCard from './components/CarouselCard.vue'

// Data

let loading = ref(true)
let isDesktop = ref(false)
let playerHand = reactive(allCards)
let opponentHand = reactive(allCards)
let playerBoardCards = reactive(dummyPlayerCards)
let opponentBoardCards = reactive(dummyOpponentCards)
let specialCards = ref(dummySpecialCards)
let cardModal = ref(false)
let slideIndex = ref(1)
let carouselIsHidden = ref(false)
let activeCardRow = ref(emptyCardRow)
let playerHandIsActive = ref(false)
const playerImg = new URL(`./assets/images/br-wellington.jpg`, import.meta.url)
const opponentImg = new URL(`./assets/images/fr-napoleon.jpg`, import.meta.url)

// Computed data

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
  if (playerHand && playerHand.length) {
    count = playerHand.length
  }
  return count
})

const opponentHandCount = computed((): number => {
  let count = 0
  if (opponentHand && opponentHand.length) {
    count = opponentHand.length
  }
  return count
})

// Hooks

onMounted(() => {
  preloadCardImages(playerHand, () => {
    loading.value = false
  })
  onResize()
  window.addEventListener('resize', onResize)
})

// Methods

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
  img.src = new URL(`./assets/images/${image}`, import.meta.url).href
}

function onResize() {
  let width = window.innerWidth
  let height = window.innerHeight
  let isLandscape = width > height

  isDesktop.value =
    (height >= 880 && isLandscape) || (width >= 768 && height >= 1024 && !isLandscape)
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
      activeCardRow.value = playerHand
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
          @click="closeCardModal"
          @keyup.enter="closeCardModal"
          @keyup.space="closeCardModal"
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
            <div class="ability card-stat-badge">
              <v-icon name="gi-hunting-horn" class="icon" :scale="isDesktop ? 1 : 0.8" />
            </div>
            <div class="ability card-stat-badge">
              <v-icon name="gi-heavy-rain" class="icon" :scale="isDesktop ? 1 : 0.8" />
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
        <div class="player-details">
          <div class="total">
            <!--            <v-icon-->
            <!--              name="gi-round-star"-->
            <!--              class="icon"-->
            <!--              :scale="isDesktop ? 1.8 : 1.2"-->
            <!--              animation="float"-->
            <!--              speed="slow"-->
            <!--              fill="gold"-->
            <!--            />-->
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
                <v-icon name="gi-hasty-grave" class="icon" :scale="isDesktop ? 2 : 1" />
                0
              </div>
            </div>
          </div>
        </div>

        <BoardCard
          v-if="specialCards.length && specialCards.length > 1"
          :ability="specialCards[specialCards.length - 1].ability"
          :ability-icon="specialCards[specialCards.length - 1].abilityIcon"
          :default-value="specialCards[specialCards.length - 1].value"
          :desktop="isDesktop"
          :faction="specialCards[specialCards.length - 1].faction"
          :hero="specialCards[specialCards.length - 1].hero"
          :image="specialCards[specialCards.length - 1].image"
          :type-icon="specialCards[specialCards.length - 1].typeIcon"
          :value="specialCards[specialCards.length - 1].value"
          :class="{ active: specialCards[specialCards.length - 1].active }"
          class="no-mobile-highlight"
          tabindex="5"
        />
        <BoardCard v-else class="no-mobile-highlight" tabindex="5" />

        <div class="opponent-details">
          <div class="total">
            <v-icon
              name="gi-round-star"
              class="icon"
              :scale="isDesktop ? 1.8 : 1.2"
              animation="float"
              speed="slow"
              fill="gold"
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
                <v-icon name="gi-hasty-grave" class="icon" :scale="isDesktop ? 2 : 1" />
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
