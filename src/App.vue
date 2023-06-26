<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
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
// let opponentHand = reactive(dummyOpponentHand)
let playerBoardCards = reactive(dummyPlayerCards)
let opponentBoardCards = reactive(dummyOpponentCards)
let specialCards = ref(dummySpecialCards)
let cardModal = ref(false)
let slideIndex = ref(1)
let activeCardRow = ref(emptyCardRow)

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

onMounted(() => {
  preloadImages(playerHand, () => {
    loading.value = false
  })
  onResize()
  window.addEventListener('resize', onResize)
})

// Methods

function preloadImages(cards: Card[], callback: Function) {
  let imageCount = cards.length
  let imagesLoaded = 0

  for (let i = 0; i < imageCount; i++) {
    let img = new Image()
    img.onload = function () {
      imagesLoaded++
      if (imagesLoaded == imageCount) {
        if (callback) {
          callback()
        }
      }
    }
    img.src = new URL(`./assets/images/${cards[i].image}`, import.meta.url).href
  }
}

function onResize() {
  let width = window.innerWidth
  let height = window.innerHeight
  let isLandscape = width > height

  isDesktop.value =
    (height >= 880 && isLandscape) || (width >= 768 && height >= 1024 && !isLandscape)
}

function handCardClick(index: number) {
  resetActiveCard(() => {
    activeCardRow.value = playerHand
    slideIndex.value = index + 1
    showSlide()
    cardModal.value = true
  })
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

function getOpponentRowTotal(rowIndex: number): number {
  let total = 0
  for (let i = 0; i < opponentBoardCards[rowIndex].length; i++) {
    total = total + opponentBoardCards[rowIndex][i].value
  }
  return total
}

function getPlayerRowTotal(rowIndex: number): number {
  let total = 0
  for (let i = 0; i < playerBoardCards[rowIndex].length; i++) {
    total = total + playerBoardCards[rowIndex][i].value
  }
  return total
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
    cardModal.value = false
  })
}

function resetActiveCard(callback: Function) {
  for (let i = 0; i < activeCardRow.value.length; i++) {
    activeCardRow.value[i].active = false
  }
  if (callback) {
    callback()
  }
}
</script>

<template>
  <div class="game-container">
    <transition name="fade">
      <div v-if="loading" class="loader fade-out">Loading...</div>
    </transition>

    <div class="scroll-container">
      <CardModal v-if="cardModal" class="quick-fade">
        <div class="card-carousel">
          <div class="slides">
            <CarouselCard
              v-for="(card, i) in activeCardRow"
              :ability="card.ability"
              :ability-icon="card.abilityIcon"
              :default-value="card.defaultValue"
              :desktop="isDesktop"
              :faction="card.faction"
              :hero="card.hero"
              :image="card.image"
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
          class="cancel-btn no-mobile-highlight"
          tabindex="2"
          @click="closeCardModal"
          @keyup.enter="closeCardModal"
          @keyup.space="closeCardModal"
        >
          CANCEL
        </button>
      </CardModal>

      <div class="opponent-board">
        <div v-for="(row, i) in opponentBoardCards" class="card-row" :key="`opponent-row-${i}`">
          <div class="row-stats">
            <div class="stat-badge">{{ getOpponentRowTotal(i) }}</div>
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

      <div class="game-stats">
        <div class="player-stats">
          <div class="stat-badge player-total">{{ playerTotal }}</div>
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
        <div class="opponent-stats">
          <div class="stat-badge opponent-total">{{ opponentTotal }}</div>
        </div>
      </div>

      <div class="player-board">
        <div v-for="(row, i) in playerBoardCards" class="card-row" :key="`player-row-${i}`">
          <div class="row-stats">
            <div class="stat-badge">{{ getPlayerRowTotal(i) }}</div>
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
