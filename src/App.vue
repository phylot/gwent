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
const playerLeader = ref()
const playerLeaderDefault = ref()
const opponentLeader = ref()
const opponentLeaderDefault = ref()
let playerDeck = ref()
let playerDeckDefault = ref()
let opponentDeck = ref()
let opponentDeckDefault = ref()
let playerHand = ref(emptyCardArray)
let opponentHand = ref(emptyCardArray)
let cardRedrawActive = ref(false)
let playerBoardCards = ref(emptyPlayerBoardArrays)
let opponentBoardCards = ref(emptyOpponentBoardArrays)
let playerBuffs = ref(emptyPlayerBuffsArrays)
let opponentBuffs = ref(emptyOpponentBuffsArrays)
let playerDiscardPile = ref(emptyCardArray)
let opponentDiscardPile = ref(emptyCardArray)
let specialDiscardPile = ref(emptyCardArray)
let playerHandIsActive = ref(false)
let activeCardRow = ref(emptyCardArray)
let slideIndex = ref(0)
let cardModal = ref(false)
let cardModalConfirmText = ref()
let cardModalCancelText = ref()
let cardModalTitle = ref()
let resolveCardModal = ref()
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

// Board row indexes for each card 'type'
const abilityIndexes: Record<string, number> = {
  close: 0,
  ranged: 1,
  siege: 2
}

// CPU
let cpuDifficulty = 0.3

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
  if (specialDiscardPile.value.length > 0) {
    card = specialDiscardPile.value[specialDiscardPile.value.length - 1]
  }
  return card
})

// HOOKS

onMounted(() => {
  onResize()
  window.addEventListener('resize', onResize)

  // TODO: Call this from main menu "New Game" or "Continue" click
  setupGame(() => {
    startNewGame()
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

async function setupGame(callback: Function) {
  // Generate card image URLs and preload images
  loading.value = true

  playerLeaderDefault.value = await preloadCards([JSON.parse(JSON.stringify(playerLeaderCard))])
  playerLeaderDefault.value = playerLeaderDefault.value[0]
  opponentLeaderDefault.value = await preloadCards([JSON.parse(JSON.stringify(opponentLeaderCard))])
  opponentLeaderDefault.value = opponentLeaderDefault.value[0]

  playerDeckDefault.value = await preloadCards(JSON.parse(JSON.stringify(allPlayerCards)))
  opponentDeckDefault.value = await preloadCards(JSON.parse(JSON.stringify(allOpponentCards)))

  await preloadAssets(['broadsword.svg', 'catapult.svg', 'crossbow.svg', 'scorch-flame.jpg'])

  if (callback) {
    callback()
  }
}

function preloadCards(cards: Card[]) {
  return new Promise((resolve) => {
    let imageCount = cards?.length || 0
    let imagesLoaded = 0

    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        cards[i].imageUrl = new URL(`./assets/images/${cards[i].image}`, import.meta.url).href
        loadImage(cards[i].imageUrl!, () => {
          imagesLoaded++
          if (imagesLoaded == imageCount) {
            resolve(cards)
          }
        })
      }
    } else {
      resolve(cards)
    }
  })
}

function preloadAssets(assets: string[]) {
  return new Promise<void>((resolve) => {
    let imageCount = assets?.length || 0
    let imagesLoaded = 0

    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        loadImage(new URL(`./assets/images/${assets[i]}`, import.meta.url).href, () => {
          imagesLoaded++
          if (imagesLoaded == imageCount) {
            resolve()
          }
        })
      }
    } else {
      resolve()
    }
  })
}

function loadImage(imageUrl: string, callback: Function) {
  let img = new Image()
  img.onload = function () {
    if (callback) {
      callback()
    }
  }
  img.onerror = function (err) {
    console.log('loadImage ERROR: ', err)
  }
  img.src = imageUrl
}

function startNewGame() {
  boardDisabled.value = true
  loading.value = true

  // Set leader cards and decks to their default state
  playerLeader.value = JSON.parse(JSON.stringify(playerLeaderDefault.value))
  opponentLeader.value = JSON.parse(JSON.stringify(opponentLeaderDefault.value))
  playerDeck.value = JSON.parse(JSON.stringify(playerDeckDefault.value))
  opponentDeck.value = JSON.parse(JSON.stringify(opponentDeckDefault.value))

  // Generate a random hand of 10 cards for each player
  playerHand.value = dealRandomCards(playerDeck.value, 10)
  opponentHand.value = dealRandomCards(opponentDeck.value, 10)

  // console.log('startNewGame() playerLeader: ', JSON.parse(JSON.stringify(playerLeader.value)))
  // console.log('startNewGame() opponentLeader: ', JSON.parse(JSON.stringify(opponentLeader.value)))
  // console.log('startNewGame() playerDeck: ', JSON.parse(JSON.stringify(playerDeck.value)))
  // console.log('startNewGame() playerHand: ', JSON.parse(JSON.stringify(playerHand.value)))
  // console.log('startNewGame() opponentDeck: ', JSON.parse(JSON.stringify(opponentDeck.value)))
  // console.log('startNewGame() opponentHand: ', JSON.parse(JSON.stringify(opponentHand.value)))

  // Empty all board rows and card piles
  playerBoardCards.value = [[], [], []]
  opponentBoardCards.value = [[], [], []]
  playerDiscardPile.value = []
  opponentDiscardPile.value = []
  specialDiscardPile.value = []

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

  loading.value = false

  displayAlertBanner(
    isPlayerTurn.value ? 'You go first' : 'Opponent goes first',
    undefined,
    'gi-crown-coin',
    () => {
      showCardRedrawModal(() => {
        cardRedrawActive.value = false

        displayAlertBanner(
          `Round ${roundNumber.value} Start`,
          undefined,
          'gi-sands-of-time',
          () => {
            startTurn()
          }
        )
      })
    }
  )
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

function showCardRedrawModal(callback: Function) {
  cardRedrawActive.value = true

  resetActiveModalCard(() => {
    activeCardRow.value = playerHand.value
    slideIndex.value = 0
    boardDisabled.value = false

    showCardModal('REDRAW', 'DONE', 'Choose card to redraw (1 of 2)').then((ok) => {
      boardDisabled.value = true
      if (ok) {
        swapModalCard(() => {
          boardDisabled.value = false

          showCardModal('REDRAW', 'DONE', 'Choose card to redraw (2 of 2)').then((ok) => {
            boardDisabled.value = true
            if (ok) {
              swapModalCard(() => {
                closeCardModal()
                callback()
              })
            } else {
              closeCardModal()
              callback()
            }
          })
        })
      } else {
        closeCardModal()
        callback()
      }
    })
  })
}

function swapModalCard(callback: Function) {
  doCardDisappearAnimation(activeCardRow.value[slideIndex.value], () => {
    // Make deep copy of swapped card and reset it
    let swappedCard = JSON.parse(JSON.stringify(activeCardRow.value[slideIndex.value]))
    resetCards([swappedCard])
    // Splice in new random card to player's hand
    playerHand.value.splice(slideIndex.value, 1, dealRandomCards(playerDeck.value, 1)[0])
    // Push swapped card back to deck
    playerDeck.value.push(swappedCard)
    showSlide()
    doCardAppearAnimation(activeCardRow.value[slideIndex.value], () => {
      callback()
    })
  })
}

// METHODS - Game Loop

function startTurn(skipTurnBanner?: boolean) {
  if (skipTurnBanner) {
    determineMove()
  } else {
    displayAlertBanner(
      isPlayerTurn.value ? 'Your turn!' : "Opponent's turn",
      isPlayerTurn.value ? playerLeader.value.imageUrl : opponentLeader.value.imageUrl,
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
      determineCpuCard(undefined, (card: Card) => {
        if (card) {
          playCard(card, false, () => {
            finishTurn()
          })
        } else {
          pass(true)
        }
      })
    }
  }
}

function playCard(card: Card, isHeal: boolean, callback?: Function) {
  boardDisabled.value = true

  // If no card array specified, assume card array is player or opponent hand
  let handArr = isHeal
    ? isPlayerTurn.value
      ? playerDiscardPile
      : opponentDiscardPile
    : isPlayerTurn.value
    ? playerHand
    : opponentHand
  let boardArr = isPlayerTurn.value
    ? playerBoardCards.value[abilityIndexes[card.type]]
    : opponentBoardCards.value[abilityIndexes[card.type]]
  let boardArrIndex = 0

  // Determine relevant board array
  if (card.type === 'special') {
    boardArr = specialDiscardPile.value
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

  doCardDisappearAnimation(card, () => {
    resetActiveModalCard(() => {
      // Insert card into relevant board array at specific index
      if (boardArrIndex) {
        boardArr.splice(boardArrIndex, 0, card)
      }
      // Push card to relevant board array
      else {
        boardArr.push(card)
      }

      // Remove card from hand (or discard pile)
      for (let i = 0; i < handArr.value.length; i++) {
        if (handArr.value[i].id == card.id) {
          handArr.value.splice(i, 1)
        }
      }

      closeCardModal()

      doCardAppearAnimation(card, () => {
        performAbility(card, boardArr, () => {
          if (callback) {
            callback()
          }
        })
      })
    })
  })
}

function determineCpuCard(arr?: Card[], callback?: Function) {
  // If no card array specified, assume card array is opponent's hand
  let cardArr = arr || opponentHand.value
  let card = null
  let cpuIsWinning = opponentTotal.value > playerTotal.value

  // If the player hasn't passed and the CPU isn't winning
  if (!(playerIsPassed.value && cpuIsWinning)) {
    // Play a random card "by mistake" based on difficulty setting, but if the player has passed, play a spy or lowest value card
    if (getChanceOutcome(cpuDifficulty) && !playerIsPassed.value) {
      card = cardArr[Math.floor(Math.random() * cardArr.length)]
    } else {
      // Find any spy cards
      let spyCards = cardArr.filter((card) => card.ability === 'spy')
      if (spyCards.length > 0) {
        // Find the lowest value spy card
        spyCards.sort(sortCardsLowToHigh)
        card = spyCards[0]
      }
      // No spy cards... decide card
      else {
        // TODO: Special card decision logic
        let cpuStandardCards = cardArr.filter((card) => card.type !== 'special')

        // If it's a must win round
        if (playerHasRound.value) {
          // Sort cards lowest to highest
          cpuStandardCards.sort(sortCardsLowToHigh)
          // Play lowest value card
          card = cpuStandardCards[0]
        }
        // Decide whether to play card or not
        else {
          // If the CPU decided to beat the player's current total, determine the total value of the CPU's remaining hand cards
          let runningCpuTotal = opponentTotal.value
          let remainingTotal = 0
          let handIndex = 0

          // Sort cards lowest to highest
          cpuStandardCards.sort(sortCardsLowToHigh)

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
  }

  if (callback) {
    callback(card)
  }
}

async function performAbility(card: Card, rowArr: Card[], callback: Function) {
  // Perform card ability

  if (card.ability === 'heal') {
    await performHeal()
  }

  if (card.ability === 'close_scorch' || card.ability === 'ranged_scorch') {
    await performRowScorch(card)
  }

  if (card.ability === 'muster') {
    await performMuster(card)
  }

  if (card.ability === 'spy') {
    await performSpy()
  }

  // TODO: Decoy card
  // • Add visual highlight to board rows containing eligible cards for swapping
  // • Enable ONLY cards eligible for swapping
  // • Display card carousel containing ONLY cards eligible for swapping, with a "SWAP" and "CANCEL" button

  // Recalculate card values
  // TODO: If full scorch, reuse this function on all 6 board rows instead
  await calculateRow(rowArr)

  if (callback) {
    callback()
  }
}

function performBond(rowArr: Card[]) {
  return new Promise<void>((resolve) => {
    let bondIndexes = []
    let multiplier = 0

    // Loop through row array and save the index of each bond card and calculate multiplier amount
    for (let i = 0; i < rowArr.length; i++) {
      if (rowArr[i].ability === 'bond') {
        bondIndexes.push(i)
        multiplier++
      }
    }

    // Set the new value of each bond card
    for (const bondIndex of bondIndexes) {
      rowArr[bondIndex].value = rowArr[bondIndex].defaultValue * multiplier
    }
    resolve()
  })
}

function performBoost(rowArr: Card[]) {
  return new Promise<void>((resolve) => {
    let boostCardCount = 0

    // Determine number of 'boost' cards in row
    for (let i = 0; i < rowArr.length; i++) {
      if (rowArr[i].ability === 'boost') {
        boostCardCount++
      }
    }

    // Loop through row array and add 1 to the value of eligible cards
    for (let i = 0; i < rowArr.length; i++) {
      if (!rowArr[i].hero) {
        let boostValue = rowArr[i].ability === 'boost' ? boostCardCount - 1 : boostCardCount
        rowArr[i].value = rowArr[i].value + boostValue
      }
    }
    resolve()
  })
}

function performHeal() {
  return new Promise<void>((resolve) => {
    // Create array containing only viable cards (no hero or special)
    let discardPile = isPlayerTurn.value ? playerDiscardPile.value : opponentDiscardPile.value
    let validHealCards = discardPile.filter((card) => !card.hero && card.type !== 'special')

    if (validHealCards.length > 0) {
      if (isPlayerTurn.value) {
        activeCardRow.value = validHealCards
        slideIndex.value = 0
        boardDisabled.value = false

        showCardModal('PLAY CARD', 'CANCEL', 'Choose card to revive').then((ok) => {
          if (ok) {
            let healedCardId = activeCardRow.value[slideIndex.value].id
            let healedCard = playerDiscardPile.value.find((o) => o.id === healedCardId) as Card

            playCard(healedCard, true, () => {
              finishTurn()
            })
          } else {
            // Player cancels heal, turn continues
            closeCardModal()
            resolve()
          }
        })
      } else {
        // Is opponent's turn... Play best valid discard pile card
        determineCpuHealCard(validHealCards, (card: Card) => {
          playCard(card, true, () => {
            finishTurn()
          })
        })
      }
    } else {
      finishTurn()
    }
  })
}

function determineCpuHealCard(arr: Card[], callback?: Function) {
  let card = null
  // Find any spy cards
  let spyCards = arr.filter((card) => card.ability === 'spy')
  if (spyCards.length > 0) {
    // Find the lowest value spy card
    spyCards.sort(sortCardsLowToHigh)
    card = spyCards[0]
  }
  // No spy cards... select highest value card
  else {
    arr.sort(sortCardsHighToLow)
    card = arr[0]
  }

  if (callback) {
    callback(card)
  }
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
    let scorchCardFound = false

    // If cards are present in the relevant board card row, and they total 10 or above
    if (cardRow.length > 0 && cardRowTotal > 9) {
      // Find highest value of all non-hero card(s)
      const nonHeroCards = cardRow.filter((card) => !card.hero)
      const maxValue = Math.max(...nonHeroCards.map((o) => o.value), 0)

      // Apply Scorch animation to highest value non-hero cards
      for (let i = 0; i < cardRow.length; i++) {
        if (cardRow[i].value === maxValue && !cardRow[i].hero) {
          scorchCardFound = true
          cardRow[i].animationName = 'scorch'
        }
      }

      if (scorchCardFound) {
        setTimeout(() => {
          // Move scorched cards from board to discard pile
          let discardPile = isPlayerTurn.value ? opponentDiscardPile : playerDiscardPile

          for (let i = 0; i < cardRow.length; i++) {
            if (cardRow[i].value === maxValue && !cardRow[i].hero) {
              discardPile.value.push(cardRow[i])
              cardRow.splice(i, 1)
              i--
            }
          }
          resetCards(discardPile.value)
          resolve()
        }, 2000)
      } else {
        resolve()
      }
    } else {
      resolve()
    }
  })
}

function performMuster(card: Card) {
  return new Promise<void>((resolve) => {
    let deck = isPlayerTurn.value ? playerDeck.value : opponentDeck.value
    let boardCards = isPlayerTurn.value ? playerBoardCards : opponentBoardCards
    let cardsFound = false

    for (let i = 0; i < deck.length; i++) {
      let deckCard = deck[i]
      // Find deck cards of the same muster name as played card, move them to the relevant board row, and remove found cards from deck
      if (deckCard.musterName === card.musterName) {
        cardsFound = true
        boardCards.value[abilityIndexes[deckCard.type]].push(deckCard)
        deck.splice(i, 1)
        doCardAppearAnimation(deckCard)
      }
    }
    // If cards found, allow time for animations
    setTimeout(
      () => {
        resolve()
      },
      cardsFound ? 1000 : 0
    )
  })
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

async function calculateRow(rowArr: Card[]) {
  // Reset card values to default before recalculating row
  for (const card of rowArr) {
    card.value = card.defaultValue
  }
  // TODO: Weather card first
  await performBond(rowArr)
  await performBoost(rowArr)

  return new Promise<void>((resolve) => {
    resolve()
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
    isCpu ? 'Opponent has passed' : 'You have passed',
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
      modalAvatar.value = isPlayerMatchWin
        ? playerLeader.value.imageUrl
        : opponentLeader.value.imageUrl
      modalTitle.value = isPlayerMatchWin ? 'You Win!!!' : 'Opponent Wins'
    }
    modalButtons.value = ['PLAY AGAIN']
    modalIcon.value = null

    modal.value.show().then(() => {
      startNewGame()
    })
  }
  // No match winner yet... set relevant round flag to true (or both if draw)
  else {
    let alertTitle = ''
    let alertIcon

    if (isDraw) {
      playerHasRound.value = true
      opponentHasRound.value = true
      alertTitle = 'Round Drawn'
    } else if (isPlayerRoundWin) {
      playerHasRound.value = true
      alertTitle = 'You won the round!'
      alertIcon = 'gi-round-star'
    } else {
      opponentHasRound.value = true
      alertTitle = 'Your opponent won the round'
      alertIcon = 'gi-broken-shield'
    }

    displayAlertBanner(alertTitle, undefined, alertIcon, () => {
      // Otherwise, start next round
      setupRound(isDraw, isPlayerRoundWin, () => {
        displayAlertBanner(
          `Round ${roundNumber.value} Start`,
          undefined,
          'gi-sands-of-time',
          () => {
            startTurn()
          }
        )
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

  // Move each player's cards from board rows to discard pile
  for (let i = 0; i < playerBoardCards.value.length; i++) {
    playerDiscardPile.value = playerDiscardPile.value.concat(playerBoardCards.value[i])
    playerBoardCards.value[i] = []
  }
  for (let i = 0; i < opponentBoardCards.value.length; i++) {
    opponentDiscardPile.value = opponentDiscardPile.value.concat(opponentBoardCards.value[i])
    opponentBoardCards.value[i] = []
  }

  resetCards(playerDiscardPile.value)
  resetCards(opponentDiscardPile.value)

  if (callback) {
    callback()
  }
}

// METHODS - Events

async function handCardClick(index: number) {
  // If redrawing cards before the game
  if (cardRedrawActive.value) {
    slideIndex.value = index
    showSlide()
  } else {
    // If the clicked card is already active, close the card carousel
    if (activeCardRow.value[index]?.active) {
      resetActiveModalCard(() => {
        closeCardModal()
      })
    } else {
      // If player hand isn't currently active, reload carousel component (hide then show it)
      if (!playerHandIsActive.value) {
        carouselIsHidden.value = true
      }
      await nextTick()
      carouselIsHidden.value = false

      resetActiveModalCard(() => {
        activeCardRow.value = playerHand.value
        playerHandIsActive.value = true
        slideIndex.value = index
        showCardModal('PLAY CARD', 'CANCEL').then((ok) => {
          if (ok) {
            playCard(activeCardRow.value[slideIndex.value], false, () => {
              finishTurn()
            })
          } else {
            closeCardModal()
          }
        })
      })
    }
  }
}

function playerBoardCardClick(index: number, rowIndex: number) {
  activeCardRow.value = playerBoardCards.value[rowIndex]
  slideIndex.value = index
  showCardModal(undefined, 'CLOSE').then(() => {
    closeCardModal()
  })
}

function opponentBoardCardClick(index: number, rowIndex: number) {
  activeCardRow.value = opponentBoardCards.value[rowIndex]
  slideIndex.value = index
  showCardModal(undefined, 'CLOSE').then(() => {
    closeCardModal()
  })
}

function discardPileClick(isPlayer?: boolean) {
  activeCardRow.value = isPlayer ? playerDiscardPile.value : opponentDiscardPile.value
  slideIndex.value = 0
  showCardModal(undefined, 'CLOSE').then(() => {
    closeCardModal()
  })
}

function showCardModal(confirmText?: string, cancelText?: string, titleText?: string) {
  return new Promise((resolve) => {
    cardModalConfirmText.value = confirmText
    cardModalCancelText.value = cancelText
    cardModalTitle.value = titleText
    resolveCardModal.value = resolve
    showSlide()
    cardModal.value = true
  })
}

function closeCardModal() {
  resetActiveModalCard(() => {
    playerHandIsActive.value = false
    cardModal.value = false
    cardModalConfirmText.value = null
    cardModalCancelText.value = null
    cardModalTitle.value = null
  })
}

function changeSlide(index: number) {
  showSlide((slideIndex.value += index))
}

function showSlide(index?: number) {
  if (index || index === 0) {
    if (index === activeCardRow.value.length) {
      slideIndex.value = 0
    }
    if (index < 0) {
      slideIndex.value = activeCardRow.value.length - 1
    }
  }

  resetActiveModalCard(() => {
    activeCardRow.value[slideIndex.value].active = true
  })
}

function resetActiveModalCard(callback: Function) {
  for (let i = 0; i < activeCardRow.value.length; i++) {
    activeCardRow.value[i].active = false
  }
  if (callback) {
    callback()
  }
}

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

// METHODS - Helpers

function doCardAppearAnimation(card: Card, callback?: Function) {
  card.animationName = 'white-fade-out'
  setTimeout(() => {
    card.animationName = 'shine'
    setTimeout(() => {
      card.animationName = undefined
      if (callback) {
        callback()
      }
    }, 500)
  }, 400)
}

function doCardDisappearAnimation(card: Card, callback?: Function) {
  card.animationName = 'shine'
  setTimeout(() => {
    card.animationName = 'white-fade-in'
    setTimeout(() => {
      card.animationName = undefined
      if (callback) {
        callback()
      }
    }, 400)
  }, 500)
}

function resetCards(arr: Card[]) {
  for (const card of arr) {
    card.active = false
    card.animationName = undefined
    card.value = card.defaultValue
  }
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

function sortCardsLowToHigh(a: Card, b: Card) {
  return a.defaultValue - b.defaultValue
}

function sortCardsHighToLow(a: Card, b: Card) {
  return b.defaultValue - a.defaultValue
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
        <h1 v-if="cardModalTitle">{{ cardModalTitle }}</h1>

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
              :image-url="card.imageUrl"
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
          >
            <v-icon name="hi-chevron-right" class="icon" :scale="isDesktop ? 1.5 : 1" />
          </button>
        </div>

        <button
          v-if="cardModalConfirmText"
          class="btn large primary no-mobile-highlight"
          :disabled="boardDisabled"
          tabindex="2"
          type="button"
          @click="resolveCardModal(true)"
          @keyup.enter="resolveCardModal(true)"
          @keyup.space="resolveCardModal(true)"
        >
          {{ cardModalConfirmText }}
        </button>
        <button
          v-if="cardModalCancelText"
          class="btn large no-mobile-highlight"
          :disabled="boardDisabled"
          tabindex="2"
          type="button"
          @click="resolveCardModal(false)"
          @keyup.enter="resolveCardModal(false)"
          @keyup.space="resolveCardModal(false)"
        >
          {{ cardModalCancelText }}
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
              :ability-icon="card.abilityIcon"
              :active="card.active"
              :animation-name="card.animationName"
              class="no-mobile-highlight"
              :default-value="card.defaultValue"
              :desktop="isDesktop"
              :disabled="boardDisabled"
              :faction="card.faction"
              :hero="card.hero"
              :image-url="card.imageUrl"
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
          title="Pass"
          type="button"
          @click="pass()"
        >
          <span>PASS</span>
        </button>
        <div v-if="playerLeader" class="player-details">
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
              :style="{ backgroundImage: `url(${playerLeader.imageUrl})` }"
            ></div>
            <div class="stat-badge player">{{ playerTotal }}</div>
          </div>
          <div class="details">
            <div class="name">
              <div class="title">{{ playerLeader.name }}</div>
              <div class="subtitle">
                {{ playerLeader.faction.charAt(0).toUpperCase() + playerLeader.faction.slice(1) }}
              </div>
            </div>
            <div class="stats">
              <div class="hand-total" :title="`Player Hand (${playerHandCount})`">
                <v-icon name="fa-layer-group" class="icon" :scale="isDesktop ? 2 : 1" />
                {{ playerHandCount }}
              </div>
              <div
                :aria-label="`Player Discard Pile (${playerDiscardPile.length})`"
                class="discard-pile no-mobile-highlight"
                :class="{ disabled: boardDisabled || playerDiscardPile.length < 1 }"
                role="button"
                :title="`Player Discard Pile (${playerDiscardPile.length})`"
                @click="
                  boardDisabled || playerDiscardPile.length < 1 ? null : discardPileClick(true)
                "
                @keyup.enter="
                  boardDisabled || playerDiscardPile.length < 1 ? null : discardPileClick(true)
                "
                @keyup.space="
                  boardDisabled || playerDiscardPile.length < 1 ? null : discardPileClick(true)
                "
              >
                <v-icon name="io-skull" class="icon" :scale="isDesktop ? 2 : 1" />
                {{ playerDiscardPile.length }}
              </div>
            </div>
          </div>
        </div>

        <BoardCard
          v-if="recentSpecialCard"
          :ability-icon="recentSpecialCard.abilityIcon"
          :active="recentSpecialCard.active"
          :animation-name="recentSpecialCard.animationName"
          class="no-mobile-highlight"
          :default-value="recentSpecialCard.value"
          :desktop="isDesktop"
          :disabled="boardDisabled"
          :faction="recentSpecialCard.faction"
          :hero="recentSpecialCard.hero"
          :image-url="recentSpecialCard.imageUrl"
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
              v-if="opponentLeader"
              class="avatar"
              :class="{ active: !isPlayerTurn }"
              :style="{ backgroundImage: `url(${opponentLeader.imageUrl})` }"
            ></div>
            <div class="stat-badge opponent">{{ opponentTotal }}</div>
          </div>
          <div v-if="opponentLeader" class="details">
            <div class="name">
              <div class="title">{{ opponentLeader.name }}</div>
              <div class="subtitle">
                {{
                  opponentLeader.faction.charAt(0).toUpperCase() + opponentLeader.faction.slice(1)
                }}
              </div>
            </div>
            <div class="stats">
              <div class="hand-total" :title="`Opponent Hand (${opponentHandCount})`">
                <v-icon name="fa-layer-group" class="icon" :scale="isDesktop ? 2 : 1" />
                {{ opponentHandCount }}
              </div>
              <div
                :aria-label="`Opponent Discard Pile (${opponentDiscardPile.length})`"
                class="discard-pile no-mobile-highlight"
                :class="{ disabled: boardDisabled || opponentDiscardPile.length < 1 }"
                role="button"
                :title="`Opponent Discard Pile (${opponentDiscardPile.length})`"
                @click="boardDisabled || opponentDiscardPile.length < 1 ? null : discardPileClick()"
                @keyup.enter="
                  boardDisabled || opponentDiscardPile.length < 1 ? null : discardPileClick()
                "
                @keyup.space="
                  boardDisabled || opponentDiscardPile.length < 1 ? null : discardPileClick()
                "
              >
                <v-icon name="io-skull" class="icon" :scale="isDesktop ? 2 : 1" />
                {{ opponentDiscardPile.length }}
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
              :ability-icon="card.abilityIcon"
              :active="card.active"
              :animation-name="card.animationName"
              class="no-mobile-highlight"
              :default-value="card.defaultValue"
              :desktop="isDesktop"
              :disabled="boardDisabled"
              :faction="card.faction"
              :hero="card.hero"
              :image-url="card.imageUrl"
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
            :ability-icon="card.abilityIcon"
            :active="card.active"
            class="no-mobile-highlight"
            :default-value="card.defaultValue"
            :desktop="isDesktop"
            :disabled="boardDisabled"
            :faction="card.faction"
            :hero="card.hero"
            :image-url="card.imageUrl"
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
