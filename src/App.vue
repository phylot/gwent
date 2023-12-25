<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
// import { RouterLink, RouterView } from 'vue-router'
import {
  type Card,
  allOpponentCards,
  allPlayerCards,
  playerLeaderCard,
  opponentLeaderCard,
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
import AlertBanner from './components/AlertBanner.vue'
import BoardCard from './components/BoardCard.vue'
import CardModal from './components/CardModal.vue'
import CarouselCard from './components/CarouselCard.vue'
import Modal from './components/Modal.vue'

// DATA

let loading = ref(true)
let isDesktop = ref(false)

let alertBannerAvatar = ref()
let alertBannerIcon = ref()
let alertBannerModel = ref(false)
let alertBannerTitle = ref('')

const modal = ref()
let modalAvatar = ref()
let modalButtons = ref()
let modalIcon = ref()
let modalModel = ref(false)
let modalTitle = ref('')

// Board-related
let playerDeck = ref()
let opponentDeck = ref()
const playerLeader = ref(playerLeaderCard)
const opponentLeader = ref(opponentLeaderCard)
const playerImg = new URL(`./assets/images/${playerLeader.value.image}`, import.meta.url)
const opponentImg = new URL(`./assets/images/${opponentLeader.value.image}`, import.meta.url)
let playerHand = ref(emptyCardArray)
let opponentHand = ref(emptyCardArray)
let playerBoardCards = ref(emptyPlayerBoardArrays)
let opponentBoardCards = ref(emptyOpponentBoardArrays)
let playerBuffs = ref(emptyPlayerBuffsArrays)
let opponentBuffs = ref(emptyOpponentBuffsArrays)
let playerDeadPile = ref(emptyCardArray)
let opponentDeadPile = ref(emptyCardArray)
let specialDeadPile = ref(emptyCardArray)
let playerHandIsActive = ref(false)
let activeCardRow = ref(emptyCardArray)
let slideIndex = ref(1)
let cardModal = ref(false)
let carouselIsHidden = ref(false)
let boardDisabled = ref(true)

// Game stats
let roundNumber = ref(1)
let isPlayerRound = ref(false)
let isPlayerTurn = ref(false)
let playerIsPassed = ref(false)
let opponentIsPassed = ref(false)
let playerHasRound = ref(false)
let opponentHasRound = ref(false)

// COMPUTED DATA

const opponentTotal = computed((): number => {
  let total = 0
  for (let i = 0; i < opponentBoardCards.value.length; i++) {
    for (let j = 0; j < opponentBoardCards.value[i].length; j++) {
      total = total + opponentBoardCards.value[i][j].value
    }
  }
  return total
})

const playerTotal = computed((): number => {
  let total = 0
  for (let i = 0; i < playerBoardCards.value.length; i++) {
    for (let j = 0; j < playerBoardCards.value[i].length; j++) {
      total = total + playerBoardCards.value[i][j].value
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

    for (let i = 0; i < playerBoardCards.value.length; i++) {
      totals.player.push(getRowTotal(playerBoardCards.value[i]))
    }
    for (let i = 0; i < opponentBoardCards.value.length; i++) {
      totals.opponent.push(getRowTotal(opponentBoardCards.value[i]))
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
    preloadCardImages(allOpponentCards, () => {
      // TODO: Call this from main menu "New Game" or "Continue" click
      setupGame(() => {
        loading.value = false
        startTurn()
      })
    })
  })
})

// METHODS - Game Setup

function onResize() {
  let width = window.innerWidth
  let height = window.innerHeight
  let isLandscape = width > height

  isDesktop.value =
    (height >= 880 && isLandscape) || (width >= 768 && height >= 1024 && !isLandscape)
}

function preloadCardImages(cards: Card[], callback: Function) {
  let imageCount = cards?.length || 0
  let imagesLoaded = 0

  if (imageCount > 0) {
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
  } else {
    if (callback) {
      callback()
    }
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
  playerDeck.value = JSON.parse(JSON.stringify(allPlayerCards))
  opponentDeck.value = JSON.parse(JSON.stringify(allOpponentCards))

  // Generate a random hand of 10 cards for each player
  playerHand.value = dealRandomCards(playerDeck.value, 10)
  opponentHand.value = dealRandomCards(opponentDeck.value, 10)

  // console.log("setupGame() playerDeck: ", JSON.parse(JSON.stringify(playerDeck.value)))
  // console.log("setupGame() playerHand: ", JSON.parse(JSON.stringify(playerHand.value)))

  playerBoardCards.value = [[], [], []]
  opponentBoardCards.value = [[], [], []]
  playerDeadPile.value = []
  opponentDeadPile.value = []

  boardDisabled.value = true
  playerHasRound.value = false
  opponentHasRound.value = false
  playerIsPassed.value = false
  opponentIsPassed.value = false

  modalAvatar.value = null
  modalButtons.value = null
  modalIcon.value = null
  modalTitle.value = ''

  // Decide lead player / first turn
  isPlayerRound.value = isPlayerTurn.value = getChanceOutcome(0.5)

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

// METHODS - Game Loop

function startTurn() {
  // TODO: pass() here if player has no cards
  // TODO: finishTurn() here if neither player has cards

  displayAlertBanner(
    isPlayerTurn.value ? 'Your Turn' : "Opponent's Turn",
    isPlayerTurn.value ? playerLeaderCard.image : opponentLeaderCard.image,
    undefined,
    () => {
      // If active player has no cards left in their hand, pass
      if (
        (isPlayerTurn.value && playerHand.value.length < 1) ||
        (!isPlayerTurn.value && opponentHand.value.length < 1)
      ) {
        let isCpuPass = !isPlayerTurn.value && opponentHand.value.length < 1
        pass(isCpuPass)
      } else {
        if (isPlayerTurn.value) {
          boardDisabled.value = false
        } else {
          // CPU logic
          determineCpuCard((card: Card) => {
            // console.log('CPU card: ', card)
            if (card) {
              playCard(card, () => {
                finishTurn()
              })
            } else {
              pass(true)
            }
          })
        }
      }
    }
  )
}

function playCard(card: Card, callback: Function) {
  // console.log('playCard() card: ', card)
  boardDisabled.value = true

  // Board row indexes for each card type
  const abilityIndexes: Record<string, number> = {
    close: 0,
    ranged: 1,
    siege: 2
  }
  let boardArr
  let handArr = isPlayerTurn.value ? playerHand : opponentHand

  // Determine relevant board array
  if (card.type === 'special') {
    boardArr = specialDeadPile.value
  } else if (card.ability === 'spy') {
    if (isPlayerTurn.value) {
      boardArr = opponentBoardCards.value[abilityIndexes[card.type]]
    } else {
      boardArr = playerBoardCards.value[abilityIndexes[card.type]]
    }
  } else {
    if (isPlayerTurn.value) {
      boardArr = playerBoardCards.value[abilityIndexes[card.type]]
    } else {
      boardArr = opponentBoardCards.value[abilityIndexes[card.type]]
    }
  }

  // Carousel card animations
  card.animationName = 'shine'

  setTimeout(() => {
    card.animationName = 'white-fade-in'
    setTimeout(() => {
      card.animationName = undefined

      resetActiveCard(() => {
        // TODO: Decoy card
        // • Add visual highlight to board rows containing eligible cards for swapping
        // • Enable ONLY cards eligible for swapping
        // • Display card carousel containing ONLY cards eligible for swapping, with a "SWAP" and "CANCEL" button

        // Push card to relevant board array
        boardArr.push(card)

        // Remove card from hand
        for (let i = 0; i < handArr.value.length; i++) {
          if (handArr.value[i].id == card.id) {
            handArr.value.splice(i, 1)
          }
        }

        closeCardModal()

        // Board card animations
        card.animationName = 'white-fade-out'
        setTimeout(() => {
          card.animationName = 'shine'
          setTimeout(() => {
            card.animationName = undefined

            if (card.ability === 'spy') {
              // Draw 2 cards if card is a spy
              if (isPlayerTurn.value) {
                playerHand.value.push(...dealRandomCards(playerDeck.value, 2))
              } else {
                opponentHand.value.push(...dealRandomCards(opponentDeck.value, 2))
              }
            }

            if (callback) {
              callback()
            }
          }, 500)
        }, 400)
      })
    }, 400)
  }, 500)
}

function determineCpuCard(callback: Function) {
  let card = null
  let cpuIsWinning = opponentTotal.value > playerTotal.value
  let smallScoreDifference = Math.abs(playerTotal.value - opponentTotal.value) < 8
  let isFinalRound = playerHasRound.value && opponentHasRound.value
  let playerIsRoundUp = playerHasRound.value && !opponentHasRound.value

  // If round isn't yet won, or there's a small score difference...
  if (!(playerIsPassed.value && cpuIsWinning)) {
    // Play card if...
    // • It's the final round
    // • The player is a round up and hasn't passed yet
    // • The player is a round up, the player has passed, and the CPU is still losing the round
    // • At worst it's a draw (the CPU may be a round up) the CPU has more than 5 cards in hand, and the score difference is negligible
    if (
      isFinalRound ||
      (playerIsRoundUp && !playerIsPassed.value) ||
      (playerIsRoundUp && playerIsPassed.value && !cpuIsWinning) ||
      (!playerHasRound.value && (opponentHandCount.value > 5 || smallScoreDifference))
    ) {
      // TODO: Determine card based on assessment of game state, available card types, etc.
      card = opponentHand.value[Math.floor(Math.random() * opponentHand.value.length)] // Select random card - TEMP
    }
  }

  if (callback) {
    callback(card)
  }
}

function pass(isCpu?: boolean) {
  if (isCpu) {
    opponentIsPassed.value = true
  } else {
    boardDisabled.value = true
    playerIsPassed.value = true
  }
  // Switch turn to other player after pass
  isPlayerTurn.value = !isPlayerTurn.value

  displayAlertBanner(
    isCpu ? 'Opponent Has Passed' : 'You Have Passed',
    undefined,
    'fa-flag',
    () => {
      finishTurn()
    }
  )
}

function finishTurn() {
  // If both players have passed, determine winner
  if (playerIsPassed.value && opponentIsPassed.value) {
    determineRoundWinner()
  } else {
    // If neither player has passed, switch turn
    if (!(playerIsPassed.value || opponentIsPassed.value)) {
      isPlayerTurn.value = !isPlayerTurn.value
    }
    startTurn()
  }
}

function determineRoundWinner() {
  let isPlayerWin = false
  let isDraw = false

  // Determine highest scorer
  if (playerTotal.value === opponentTotal.value) {
    isDraw = true
  } else {
    if (playerTotal.value > opponentTotal.value) {
      isPlayerWin = true
    }
  }

  // Declare match is a draw (if draw and each player has already won a round)
  if (isDraw && playerHasRound && opponentHasRound) {
    // End match as draw (show match summary dialog... "Play Again" / "Main Menu")
    modalAvatar.value = null
    modalButtons.value = ['Play Again']
    modalIcon.value = null
    modalTitle.value = 'Match Drawn'

    modal.value.show().then(() => {
      setupGame(() => {
        setTimeout(() => {
          startTurn()
        }, 500)
      })
    })
  }
  // Declare match winner (match isn't a draw and the round winner has already won a round)
  else if (
    !isDraw &&
    ((isPlayerWin && playerHasRound.value) || (!isPlayerWin && opponentHasRound.value))
  ) {
    // End match as a win
    // TODO: show match summary dialog / match stats... "Play Again" / "Main Menu" / "View Board"

    modalAvatar.value = isPlayerWin ? playerLeaderCard.image : opponentLeaderCard.image
    modalButtons.value = ['Play Again']
    modalIcon.value = null
    modalTitle.value = isPlayerWin ? 'You Win The Match!!!' : 'Opponent Wins The Match'

    modal.value.show().then(() => {
      setupGame(() => {
        setTimeout(() => {
          startTurn()
        }, 500)
      })
    })
  }
  // No match winner yet... set relevant round flag to true (or both if draw)
  else {
    let alertTitle = ''
    let alertAvatar

    if (isDraw) {
      playerHasRound.value = true
      opponentHasRound.value = true
      alertTitle = 'Round Drawn'
    } else if (isPlayerWin) {
      playerHasRound.value = true
      alertTitle = 'You Win The Round!'
      alertAvatar = playerLeaderCard.image
    } else {
      opponentHasRound.value = true
      alertTitle = 'Opponent Wins The Round'
      alertAvatar = opponentLeaderCard.image
    }

    displayAlertBanner(alertTitle, alertAvatar, undefined, () => {
      setupRound()
    })
  }
}

function setupRound() {
  roundNumber.value++

  // Swap lead player from previous round
  isPlayerRound.value = !isPlayerRound.value
  isPlayerTurn.value = isPlayerRound.value

  // Reset necessary round-specific values
  playerIsPassed.value = false
  opponentIsPassed.value = false

  // Move each player's cards from board rows to dead pile
  for (let i = 0; i < playerBoardCards.value.length; i++) {
    playerDeadPile.value = playerDeadPile.value.concat(playerBoardCards.value[i])
    playerBoardCards.value[i] = []
  }
  for (let i = 0; i < opponentBoardCards.value.length; i++) {
    opponentDeadPile.value = opponentDeadPile.value.concat(opponentBoardCards.value[i])
    opponentBoardCards.value[i] = []
  }

  startTurn()
}

// METHODS - Events

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
  activeCardRow.value = playerBoardCards.value[rowIndex]
  slideIndex.value = index + 1
  showSlide()
  cardModal.value = true
}

function opponentBoardCardClick(index: number, rowIndex: number) {
  activeCardRow.value = opponentBoardCards.value[rowIndex]
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
    playCard(activeCardRow.value[slideIndex.value - 1], () => {
      finishTurn()
    })
  } else {
    // Player is redrawing a card before the game, or swapping a decoy card, etc.
  }
}

// METHODS - Helpers

function displayAlertBanner(title: string, avatar?: string, icon?: string, callback?: Function) {
  alertBannerTitle.value = title || ''
  alertBannerAvatar.value = avatar || null
  alertBannerIcon.value = icon || null
  alertBannerModel.value = true

  setTimeout(() => {
    alertBannerModel.value = false

    setTimeout(() => {
      alertBannerTitle.value = ''
      alertBannerAvatar.value = null
      alertBannerIcon.value = null

      if (callback) {
        callback()
      }
    }, 200)
  }, 1400)
}

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
      <div v-if="loading" class="loader">Loading...</div>
    </transition>

    <Modal
      v-model="modalModel"
      :avatar="modalAvatar"
      :buttons="modalButtons"
      :desktop="isDesktop"
      :icon="modalIcon"
      ref="modal"
      :title="modalTitle"
    ></Modal>

    <AlertBanner
      v-model="alertBannerModel"
      :avatar="alertBannerAvatar"
      :desktop="isDesktop"
      :icon="alertBannerIcon"
      :title="alertBannerTitle"
    ></AlertBanner>

    <div class="scroll-container">
      <CardModal v-if="cardModal" class="quick-fade">
        <div v-if="!carouselIsHidden" class="card-carousel">
          <div class="slides">
            <CarouselCard
              v-for="(card, i) in activeCardRow"
              :ability="card.ability"
              :ability-icon="card.abilityIcon"
              :animation-name="card.animationName"
              class="slide fade-in"
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
          <button
            class="prev-btn no-mobile-highlight"
            :class="{ disabled: boardDisabled }"
            :disabled="boardDisabled"
            role="button"
            tabindex="2"
            @click="boardDisabled ? null : changeSlide(-1)"
            @keyup.enter="boardDisabled ? null : changeSlide(-1)"
            @keyup.space="boardDisabled ? null : changeSlide(-1)"
          >
            <v-icon name="hi-chevron-left" class="icon" :scale="isDesktop ? 1.5 : 1" />
          </button>
          <button
            class="next-btn no-mobile-highlight"
            :class="{ disabled: boardDisabled }"
            :disabled="boardDisabled"
            role="button"
            tabindex="2"
            @click="boardDisabled ? null : changeSlide(1)"
            @keyup.enter="boardDisabled ? null : changeSlide(1)"
            @keyup.space="boardDisabled ? null : changeSlide(1)"
          >
            <v-icon name="hi-chevron-right" class="icon" :scale="isDesktop ? 1.5 : 1" />
          </button>
        </div>

        <button
          v-if="playerHandIsActive"
          class="btn large primary no-mobile-highlight"
          :disabled="boardDisabled"
          tabindex="2"
          type="button"
          @click="confirmCardModal"
          @keyup.enter="confirmCardModal"
          @keyup.space="confirmCardModal"
        >
          PLAY CARD
        </button>
        <button
          class="btn large no-mobile-highlight"
          :disabled="boardDisabled"
          tabindex="2"
          type="button"
          @click="closeCardModal"
          @keyup.enter="closeCardModal"
          @keyup.space="closeCardModal"
        >
          {{ playerHandIsActive ? 'CANCEL' : 'CLOSE' }}
        </button>
      </CardModal>

      <div class="opponent-board">
        <div
          v-for="(row, i) in opponentBoardCards"
          class="card-row"
          :class="`card-row${i + 1}`"
          :key="`opponent-row-${i}`"
        >
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
              :animation-name="card.animationName"
              class="no-mobile-highlight"
              :class="{ active: card.active }"
              :default-value="card.defaultValue"
              :desktop="isDesktop"
              :disabled="boardDisabled"
              :faction="card.faction"
              :hero="card.hero"
              :image="card.image"
              :key="j"
              role="button"
              tabindex="4"
              :type-icon="card.typeIcon"
              :value="card.value"
              @boardcard-click="opponentBoardCardClick(j, i)"
              @boardcard-enter="opponentBoardCardClick(j, i)"
              @boardcard-space="opponentBoardCardClick(j, i)"
            />
          </div>
        </div>
      </div>

      <div class="game-details">
        <button
          class="btn pass-btn no-mobile-highlight"
          :class="{ disabled: boardDisabled }"
          :disabled="boardDisabled"
          type="button"
          @click="pass()"
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
              name="fa-flag"
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
                :aria-label="`Player Dead Pile (${playerDeadPile.length})`"
                class="dead-pile no-mobile-highlight"
                :class="{ disabled: boardDisabled }"
                role="button"
                @click="boardDisabled ? null : playerDeadPileClick()"
                @keyup.enter="boardDisabled ? null : playerDeadPileClick()"
                @keyup.space="boardDisabled ? null : playerDeadPileClick()"
              >
                <v-icon name="io-skull" class="icon" :scale="isDesktop ? 2 : 1" />
                {{ playerDeadPile.length }}
              </div>
            </div>
          </div>
        </div>

        <BoardCard
          v-if="recentSpecialCard"
          :ability="recentSpecialCard.ability"
          :ability-icon="recentSpecialCard.abilityIcon"
          :animation-name="recentSpecialCard.animationName"
          class="no-mobile-highlight"
          :class="{ active: recentSpecialCard.active }"
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
              name="fa-flag"
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
                :aria-label="`Opponent Dead Pile (${opponentDeadPile.length})`"
                class="dead-pile no-mobile-highlight"
                :class="{ disabled: boardDisabled }"
                role="button"
                @boardcard-click="boardDisabled ? null : opponentDeadPileClick()"
                @boardcard-enter="boardDisabled ? null : opponentDeadPileClick()"
                @boardcard-space="boardDisabled ? null : opponentDeadPileClick()"
              >
                <v-icon name="io-skull" class="icon" :scale="isDesktop ? 2 : 1" />
                {{ opponentDeadPile.length }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="player-board">
        <div
          v-for="(row, i) in playerBoardCards"
          class="card-row"
          :class="`card-row${i + 1}`"
          :key="`player-row-${i}`"
        >
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
              :animation-name="card.animationName"
              class="no-mobile-highlight"
              :class="{ active: card.active }"
              :default-value="card.defaultValue"
              :desktop="isDesktop"
              :disabled="boardDisabled"
              :faction="card.faction"
              :hero="card.hero"
              :image="card.image"
              :key="j"
              role="button"
              tabindex="3"
              :type-icon="card.typeIcon"
              :value="card.value"
              @boardcard-click="boardDisabled ? null : playerBoardCardClick(j, i)"
              @boardcard-enter="boardDisabled ? null : playerBoardCardClick(j, i)"
              @boardcard-space="boardDisabled ? null : playerBoardCardClick(j, i)"
            />
          </div>
        </div>

        <div class="card-row player-hand">
          <BoardCard
            v-for="(card, i) in playerHand"
            :ability="card.ability"
            :ability-icon="card.abilityIcon"
            class="no-mobile-highlight"
            :class="{ active: card.active }"
            :default-value="card.defaultValue"
            :desktop="isDesktop"
            :disabled="boardDisabled"
            :faction="card.faction"
            :hero="card.hero"
            :image="card.image"
            :key="i"
            role="button"
            tabindex="1"
            :type-icon="card.typeIcon"
            :value="card.value"
            @boardcard-click="handCardClick(i)"
            @boardcard-enter="handCardClick(i)"
            @boardcard-space="handCardClick(i)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
