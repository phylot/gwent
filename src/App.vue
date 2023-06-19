<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
// import { RouterLink, RouterView } from 'vue-router'
// import defaultCards from './data/default-cards.js'
import BoardCard from './components/BoardCard.vue'
import CardModal from './components/CardModal.vue'

// const deck = ref(defaultCards)
const dummyOpponentCards: { value: number; active: boolean }[][] = [
  [
    { value: 1, active: false },
    { value: 1, active: false },
    { value: 1, active: false },
    { value: 1, active: false },
    { value: 1, active: false },
    { value: 1, active: false },
    { value: 1, active: false },
    { value: 1, active: false },
    { value: 1, active: false },
    { value: 1, active: false },
    { value: 2, active: false },
    { value: 3, active: false }
  ],
  [
    { value: 6, active: false },
    { value: 5, active: false }
  ],
  [{ value: 8, active: false }]
]
const dummyPlayerCards: { value: number; active: boolean }[][] = [
  [
    { value: 4, active: false },
    { value: 4, active: false },
    { value: 6, active: false },
    { value: 6, active: false },
    { value: 7, active: false }
  ],
  [
    { value: 5, active: false },
    { value: 5, active: false },
    { value: 5, active: false }
  ],
  [
    { value: 6, active: false },
    { value: 6, active: false },
    { value: 8, active: false },
    { value: 8, active: false }
  ]
]
// const dummyOpponentHand: { value: number }[] = [
//   { value: 1 },
//   { value: 1 },
//   { value: 1 },
//   { value: 2 },
//   { value: 2 },
//   { value: 3 },
//   { value: 4 },
//   { value: 5 },
//   { value: 5 },
//   { value: 6 },
//   { value: 8 },
//   { value: 10 },
//   { value: 10 },
//   { value: 10 },
// ];
const dummyPlayerHand: { value: number; active: boolean }[] = [
  { value: 1, active: false },
  { value: 2, active: false },
  { value: 3, active: false },
  { value: 4, active: false },
  { value: 5, active: false },
  { value: 6, active: false },
  { value: 7, active: false },
  { value: 8, active: false },
  { value: 9, active: false },
  { value: 10, active: false },
  { value: 11, active: false },
  { value: 12, active: false },
  { value: 13, active: false },
  { value: 14, active: false }
]

const emptyCardRow: { value: number; active: boolean }[] = []

// Data

let opponentBoardCards = reactive(dummyOpponentCards)
let playerBoardCards = reactive(dummyPlayerCards)
// let opponentHand = reactive(dummyOpponentHand)
let playerHand = reactive(dummyPlayerHand)
let deckModal = ref(false)
// let slides = reactive([{value: 1}, {value: 1}, 3, 4, 5])
let slideIndex = ref(1)
let activeCardRow = reactive(emptyCardRow)

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

// Methods

function handCardClick(index: number) {
  activeCardRow = playerHand
  slideIndex.value = index + 1
  showSlide()
  deckModal.value = true
}

function playerBoardCardClick(index: number, rowIndex: number) {
  activeCardRow = playerBoardCards[rowIndex]
  slideIndex.value = index + 1
  showSlide()
  deckModal.value = true
}

function opponentBoardCardClick(index: number, rowIndex: number) {
  activeCardRow = opponentBoardCards[rowIndex]
  slideIndex.value = index + 1
  showSlide()
  deckModal.value = true
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
    if (index > activeCardRow.length) {
      slideIndex.value = 1
    }
    if (index < 1) {
      slideIndex.value = activeCardRow.length
    }
  }

  for (let i = 0; i < activeCardRow.length; i++) {
    activeCardRow[i].active = false
  }
  activeCardRow[slideIndex.value - 1].active = true
}

function closeDeckModal() {
  deckModal.value = false
}
</script>

<template>
  <div class="game-container">
    <div class="scroll-container">
      <CardModal v-if="deckModal" class="quick-fade">
        <div class="slide-container">
          <div class="slides">
            <div
              v-for="(card, i) in activeCardRow"
              class="slide fade"
              :class="{ active: card.active }"
              :key="i"
            >
              Card {{ card.value }}
            </div>
          </div>
          <span class="prev" @click="changeSlide(-1)">
            <i class="fa fa-chevron-left" aria-hidden="true"></i>
          </span>
          <span class="next" @click="changeSlide(1)">
            <i class="fa fa-chevron-right" aria-hidden="true"></i>
          </span>
          <button @click="closeDeckModal" class="cancel-btn">CANCEL</button>
        </div>
      </CardModal>

      <div class="opponent-board">
        <div v-for="(row, i) in opponentBoardCards" class="card-row" :key="`opponent-row-${i}`">
          <div class="row-stats">
            <div class="total-counter">{{ getOpponentRowTotal(i) }}</div>
          </div>

          <div class="card-container">
            <BoardCard
              v-for="(card, j) in row"
              :value="card.value"
              @click="opponentBoardCardClick(j, i)"
            />
          </div>
        </div>
      </div>

      <div class="game-stats">
        <div class="player-stats">
          <div class="total-counter player-total">{{ playerTotal }}</div>
        </div>
        <!-- TODO: Display last card in specialCards array, ELSE display placeholder -->
        <BoardCard />
        <div class="opponent-stats">
          <div class="total-counter opponent-total">{{ opponentTotal }}</div>
        </div>
      </div>

      <div class="player-board">
        <div v-for="(row, i) in playerBoardCards" class="card-row" :key="`player-row-${i}`">
          <div class="row-stats">
            <div class="total-counter">{{ getPlayerRowTotal(i) }}</div>
          </div>

          <div class="card-container">
            <BoardCard
              v-for="(card, j) in row"
              :value="card.value"
              @click="playerBoardCardClick(j, i)"
            />
          </div>
        </div>

        <div class="card-row player-hand">
          <BoardCard
            v-for="(card, i) in playerHand"
            :value="card.value"
            :class="{ active: card.active }"
            @click="handCardClick(i)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
