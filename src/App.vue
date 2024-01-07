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

let loading = ref(false)
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
let playerIsLead = ref(false)
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

  // TODO: Call this from main menu "New Game" or "Continue" click
  startNewGame()
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

function startNewGame() {
  loading.value = true

  setupGame(() => {
    loading.value = false

    displayAlertBanner(
      isPlayerTurn.value ? 'You Go First' : 'Opponent Goes First',
      undefined,
      'gi-crown-coin',
      () => {
        // TODO: Swap cards dialog + logic
        // • return promise (to delay/prevent below callback)
        // • Dialog actions are "SWAP" and "DONE"
        // • Add title attribute to CardModal slot

        displayAlertBanner(`Round ${roundNumber.value}`, undefined, undefined, () => {
          startTurn()
        })
      }
    )
  })
}

function setupGame(callback: Function) {
  playerDeck.value = JSON.parse(JSON.stringify(allPlayerCards))
  opponentDeck.value = JSON.parse(JSON.stringify(allOpponentCards))

  preloadCardImages(playerDeck.value, () => {
    preloadCardImages(opponentDeck.value, () => {
      // Generate a random hand of 10 cards for each player
      playerHand.value = dealRandomCards(playerDeck.value, 10)
      opponentHand.value = dealRandomCards(opponentDeck.value, 10)

      // console.log("setupGame() playerDeck: ", JSON.parse(JSON.stringify(playerDeck.value)))
      // console.log('setupGame() playerHand: ', JSON.parse(JSON.stringify(playerHand.value)))
      // console.log("setupGame() opponentDeck: ", JSON.parse(JSON.stringify(opponentDeck.value)))
      // console.log('setupGame() opponentHand: ', JSON.parse(JSON.stringify(opponentHand.value)))

      playerBoardCards.value = [[], [], []]
      opponentBoardCards.value = [[], [], []]
      playerDeadPile.value = []
      opponentDeadPile.value = []

      boardDisabled.value = true
      roundNumber.value = 1
      playerHasRound.value = false
      opponentHasRound.value = false
      playerIsPassed.value = false
      opponentIsPassed.value = false

      modalAvatar.value = null
      modalButtons.value = null
      modalIcon.value = null
      modalTitle.value = ''

      // Decide lead player / first turn
      playerIsLead.value = isPlayerTurn.value = getChanceOutcome(0.5)

      if (callback) {
        callback()
      }
    })
  })
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

function startTurn(skipTurnBanner?: boolean) {
  if (skipTurnBanner) {
    determineMove()
  } else {
    displayAlertBanner(
      isPlayerTurn.value ? 'Your Turn' : "Opponent's Turn",
      isPlayerTurn.value ? playerLeader.value.image : opponentLeader.value.image,
      undefined,
      () => {
        determineMove()
      }
    )
  }
}

function determineMove() {
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

function playCard(card: Card, callback: Function) {
  boardDisabled.value = true

  // Board row indexes for each card type
  const abilityIndexes: Record<string, number> = {
    close: 0,
    ranged: 1,
    siege: 2
  }
  let boardArr = isPlayerTurn.value
    ? playerBoardCards.value[abilityIndexes[card.type]]
    : opponentBoardCards.value[abilityIndexes[card.type]]
  let boardArrIndex = 0
  let handArr = isPlayerTurn.value ? playerHand : opponentHand

  // Determine relevant board array
  if (card.type === 'special') {
    boardArr = specialDeadPile.value
  } else if (card.ability === 'spy') {
    boardArr = isPlayerTurn.value
      ? opponentBoardCards.value[abilityIndexes[card.type]]
      : playerBoardCards.value[abilityIndexes[card.type]]
  } else {
    // Determine the specific array position for 'bond' cards, so they're placed adjacent to one another
    if (card.ability === 'bond') {
      let bondFound = false
      for (let i = 0; i < boardArr.length; i++) {
        if (boardArr[i].ability === 'bond') {
          bondFound = true
        } else {
          if (bondFound) {
            boardArrIndex = i
            break
          }
        }
      }
    }
  }

  // Carousel card animations
  card.animationName = 'shine'

  setTimeout(() => {
    card.animationName = 'white-fade-in'
    setTimeout(() => {
      card.animationName = undefined

      resetActiveCard(() => {
        // Insert card into relevant board array at specific index
        if (boardArrIndex) {
          boardArr.splice(boardArrIndex, 0, card)
        }
        // Push card to relevant board array
        else {
          boardArr.push(card)
        }

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

            performAbility(card, () => {
              if (callback) {
                callback()
              }
            })
          }, 500)
        }, 400)
      })
    }, 400)
  }, 500)
}

function determineCpuCard(callback: Function) {
  let card = null
  let cpuIsWinning = opponentTotal.value > playerTotal.value

  // If the player hasn't passed and the CPU isn't winning
  if (!(playerIsPassed.value && cpuIsWinning)) {
    // Find any spy cards
    let spyCards = opponentHand.value.filter((card) => card.ability === 'spy')
    if (spyCards.length > 0) {
      // Find the lowest value spy card
      spyCards.sort(compareCardValues)
      card = spyCards[0]
    }
    // No spy cards... decide card
    else {
      // TODO: Special card decision logic
      let cpuStandardCards = opponentHand.value.filter((card) => card.type !== 'special')

      // If it's a must win round
      if (playerHasRound.value) {
        // Sort cards lowest to highest
        cpuStandardCards.sort(compareCardValues)
        // Play lowest value card
        card = cpuStandardCards[0]
      }
      // Decide whether to play card or not
      else {
        // If the CPU decided to beat the player's current total, determine the total value of the CPU's remaining hand cards
        let runningCpuTotal = opponentTotal.value
        let remainingTotal = 0
        let handIndex = 0
        // let canWin = false

        // Sort cards lowest to highest
        cpuStandardCards.sort(compareCardValues)

        // Determine the upper index of CPU hand cards required to beat the player, and if a win is possible this round
        for (let i = 0; i < cpuStandardCards.length; i++) {
          if (runningCpuTotal <= playerTotal.value) {
            runningCpuTotal = runningCpuTotal + cpuStandardCards[i].defaultValue
            handIndex++
          } else {
            break
          }
        }

        // If a win is possible this round, determine the total value of the remaining CPU hand cards, and if that's likely enough to win a subsequent round with
        if (runningCpuTotal > playerTotal.value) {
          // Determine the total value of the CPU's remaining hand cards
          while (handIndex < cpuStandardCards.length) {
            remainingTotal = remainingTotal + cpuStandardCards[handIndex].defaultValue
            handIndex++
          }

          // If there's theoretically enough points left to win another round
          if (remainingTotal > 20) {
            // Play lowest value card
            card = cpuStandardCards[0]
          }
        }
      }
    }
  }

  if (callback) {
    callback(card)
  }
}

async function performAbility(card: Card, callback: Function) {
  // Perform card ability
  if (card.ability === 'spy') {
    await performSpy()
  }

  if (card.ability === 'close_scorch' || card.ability === 'ranged_scorch') {
    await performRowScorch(card)
  }

  // TODO: Decoy card
  // • Add visual highlight to board rows containing eligible cards for swapping
  // • Enable ONLY cards eligible for swapping
  // • Display card carousel containing ONLY cards eligible for swapping, with a "SWAP" and "CANCEL" button

  if (callback) {
    callback()
  }
}

function performSpy() {
  return new Promise<void>((resolve) => {
    // Draw 2 cards if card is a spy
    if (isPlayerTurn.value) {
      playerHand.value.push(...dealRandomCards(playerDeck.value, 2))
    } else {
      opponentHand.value.push(...dealRandomCards(opponentDeck.value, 2))
    }

    // TODO: Apply shine animations to drawn cards
    resolve()
  })
}

function performRowScorch(card: Card) {
  return new Promise<void>((resolve) => {
    let cardRowIndex = card.ability === 'close_scorch' ? 0 : 1
    let cardRow = isPlayerTurn.value
      ? opponentBoardCards.value[cardRowIndex]
      : playerBoardCards.value[cardRowIndex]
    let cardRowTotal = isPlayerTurn.value
      ? rowTotals.value.opponent[cardRowIndex]
      : rowTotals.value.player[cardRowIndex]

    // If cards are present in the relevant board card row, and they total 10 or above
    if (cardRow.length > 0 && cardRowTotal > 9) {
      // Find highest value of all non-hero card(s)
      const nonHeroCards = cardRow.filter((card) => !card.hero)
      const maxValue = Math.max(...nonHeroCards.map((o) => o.value), 0)

      // Apply Scorch animation to highest value non-hero cards
      for (let i = 0; i < cardRow.length; i++) {
        if (cardRow[i].value === maxValue && !cardRow[i].hero) {
          cardRow[i].animationName = 'scorch'
        }
      }

      setTimeout(() => {
        // Move scorched cards from board to dead pile
        let deadPile = isPlayerTurn.value ? opponentDeadPile : playerDeadPile

        for (let i = 0; i < cardRow.length; i++) {
          if (cardRow[i].value === maxValue && !cardRow[i].hero) {
            cardRow[i].animationName = undefined
            deadPile.value.push(cardRow[i])
            cardRow.splice(i, 1)
            i--
          }
        }
        resolve()
      }, 1000)
    } else {
      resolve()
    }
  })
}

function pass(isCpu?: boolean) {
  if (isCpu) {
    opponentIsPassed.value = true
  } else {
    boardDisabled.value = true
    playerIsPassed.value = true
  }

  displayAlertBanner(
    isCpu ? 'Opponent Has Passed' : 'You Have Passed',
    undefined,
    'fa-flag',
    () => {
      finishTurn(true)
    }
  )
}

function finishTurn(passedThisTurn?: boolean) {
  // If both players have passed, determine winner
  if (playerIsPassed.value && opponentIsPassed.value) {
    determineRoundWinner()
  } else {
    let skipTurnBanner = false

    // If neither player has passed, or a player passed this turn, switch turn
    if (!(playerIsPassed.value || opponentIsPassed.value) || passedThisTurn) {
      isPlayerTurn.value = !isPlayerTurn.value
    } else {
      // If a player didn't pass this turn, but a player has already passed, assume it's a player's subsequent turn, so skip the turn banner
      skipTurnBanner = true
    }

    startTurn(skipTurnBanner)
  }
}

function determineRoundWinner() {
  let isPlayerRoundWin = false
  let isOpponentRoundWin = false
  let isDraw = false
  let isPlayerMatchWin = false
  let isOpponentMatchWin = false
  let isMatchDraw = false

  // Determine highest round scorer
  if (playerTotal.value === opponentTotal.value) {
    isDraw = true
  } else {
    if (playerTotal.value > opponentTotal.value) {
      isPlayerRoundWin = true
    } else {
      isOpponentRoundWin = true
    }
  }

  // MATCH END CONDITION - End match as a draw (round is a draw and each player has already won a round)
  if (isDraw && playerHasRound.value && opponentHasRound.value) {
    isMatchDraw = true
  }
  // MATCH END CONDITION - Round winner has already won a round
  else if (
    (isPlayerRoundWin && playerHasRound.value) ||
    (isOpponentRoundWin && opponentHasRound.value)
  ) {
    isPlayerRoundWin ? (isPlayerMatchWin = true) : (isOpponentMatchWin = true)
  }
  // MATCH END CONDITION - Round is a draw and ONE player has already won a round
  else if (isDraw && (playerHasRound.value || opponentHasRound.value)) {
    playerHasRound.value ? (isPlayerMatchWin = true) : (isOpponentMatchWin = true)
  }
  // MATCH END CONDITION - Neither player has any cards left after round 1
  else if (
    playerHand.value.length === 0 &&
    opponentHand.value.length === 0 &&
    roundNumber.value === 1
  ) {
    if (isDraw) {
      isMatchDraw = true
    } else {
      isPlayerRoundWin ? (isPlayerMatchWin = true) : (isOpponentMatchWin = true)
    }
  }

  // Match is won or drawn
  if (isPlayerMatchWin || isOpponentMatchWin || isMatchDraw) {
    // TODO: show match summary dialog / match stats... "Play Again" / "Main Menu" / "View Board"

    if (isMatchDraw) {
      modalTitle.value = 'Match Drawn'
    } else {
      modalAvatar.value = isPlayerMatchWin ? playerLeader.value.image : opponentLeader.value.image
      modalTitle.value = isPlayerMatchWin ? 'You Win The Match!!!' : 'Opponent Wins The Match'
    }
    modalButtons.value = ['Play Again']
    modalIcon.value = null

    modal.value.show().then(() => {
      startNewGame()
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
    } else if (isPlayerRoundWin) {
      playerHasRound.value = true
      alertTitle = 'You Win The Round!'
      alertAvatar = playerLeader.value.image
    } else {
      opponentHasRound.value = true
      alertTitle = 'Opponent Wins The Round'
      alertAvatar = opponentLeader.value.image
    }

    displayAlertBanner(alertTitle, alertAvatar, undefined, () => {
      // Otherwise, start next round
      setupRound(isDraw, isPlayerRoundWin, () => {
        displayAlertBanner(`Round ${roundNumber.value}`, undefined, undefined, () => {
          startTurn()
        })
      })
    })
  }
}

function setupRound(isDraw: boolean, isPlayerRoundWin: boolean, callback: Function) {
  roundNumber.value++

  // If previous round was draw, swap lead player from previous round
  if (isDraw) {
    playerIsLead.value = !playerIsLead.value
    isPlayerTurn.value = playerIsLead.value
  }
  // Otherwise, previous round winner goes first
  else {
    isPlayerTurn.value = isPlayerRoundWin
  }

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

  if (callback) {
    callback()
  }
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

function compareCardValues(a: Card, b: Card) {
  return a.defaultValue - b.defaultValue
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
