<script setup lang="ts">
import { reactive, computed } from 'vue'
// import { RouterLink, RouterView } from 'vue-router'
// import defaultCards from './data/default-cards.js'
import BoardCard from './components/BoardCard.vue'

// const deck = ref(defaultCards)
const dummyOpponentCards: any[][] = [
  [
    { value: 1 },
    { value: 1 },
    { value: 1 },
    { value: 1 },
    { value: 1 },
    { value: 1 },
    { value: 1 },
    { value: 1 },
    { value: 1 },
    { value: 1 },
    { value: 2 },
    { value: 3 }
  ],
  [{ value: 6 }, { value: 5 }],
  [{ value: 8 }]
]
const dummyPlayerCards: any[][] = [
  [{ value: 4 }, { value: 4 }, { value: 6 }, { value: 6 }, { value: 7 }],
  [{ value: 5 }, { value: 5 }, { value: 5 }],
  [{ value: 6 }, { value: 6 }, { value: 8 }, { value: 8 }]
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
const dummyPlayerHand: { value: number }[] = [
  { value: 1 },
  { value: 1 },
  { value: 1 },
  { value: 2 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
  { value: 5 },
  { value: 6 },
  { value: 8 },
  { value: 10 },
  { value: 10 },
  { value: 10 }
]

let opponentBoardCards = reactive(dummyOpponentCards)
let playerBoardCards = reactive(dummyPlayerCards)
// let opponentHand = reactive(dummyOpponentHand)
let playerHand = reactive(dummyPlayerHand)

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
</script>

<template>
  <div class="game-container">
    <div class="scroll-container">
      <div class="opponent-board">
        <div v-for="(row, i) in opponentBoardCards" class="card-row" :key="`opponent-row-${i}`">
          <div class="row-stats">
            <div class="total-counter">{{ getOpponentRowTotal(i) }}</div>
          </div>

          <div class="card-container">
            <BoardCard v-for="card in row" :value="card.value" />
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
            <BoardCard v-for="card in row" :value="card.value" />
          </div>
        </div>

        <div class="card-row player-hand">
          <BoardCard v-for="card in playerHand" :value="card.value" />
        </div>
      </div>
    </div>
  </div>
</template>
