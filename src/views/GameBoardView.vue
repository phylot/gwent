<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { type Card, type RoundTotal, type RowFlag } from '@/types'

import { defaultRowFlags } from './../data/game-board'
import { defaultAwards } from './../data/awards'
import AlertBanner from './../components/AlertBanner.vue'
import AwardBadge from './../components/AwardBadge.vue'
import BeanPopup from './../components/BeanPopup.vue'
import CardCarousel from './../components/CardCarousel.vue'
import CardModal from './../components/CardModal.vue'
import CardPreview from './../components/CardPreview.vue'
import OverlayScreen from './../components/OverlayScreen.vue'
import SmallCard from './../components/SmallCard.vue'
import StandardModal from './../components/StandardModal.vue'

// PROPS

const props = defineProps<{
  cpuDifficulty: number
  desktop: boolean
  disabled: boolean
  opponentCards: Card[]
  opponentLeaderCard: Card
  playerCards: Card[]
  playerLeaderCard: Card
}>()

// BOARD-RELATED DATA

const playerLeader = ref()
const playerLeaderDefault = ref()
const playerFlagUrl = ref()
const opponentLeader = ref()
const opponentLeaderDefault = ref()
const opponentFlagUrl = ref()
let playerDeck = ref<Card[]>([])
let playerDeckDefault = ref()
let opponentDeck = ref<Card[]>([])
let opponentDeckDefault = ref()
let playerHand = ref<Card[]>([])
let opponentHand = ref<Card[]>([])
let playerHandIsActive = ref(false)
let playerHandDisabled = ref(true)
let cardRedrawActive = ref(false)
let healActive = ref(false)
let playerBoardCards = ref<Card[][]>([[], [], []])
let opponentBoardCards = ref<Card[][]>([[], [], []])
let playerRowFlags = ref()
let playerRowFlagsDefault = ref()
let opponentRowFlags = ref()
let opponentRowFlagsDefault = ref()
let playerDiscardPile = ref<Card[]>([])
let opponentDiscardPile = ref<Card[]>([])
let discardPileActive = ref(false)
let specialDiscardPile = ref<Card[]>([])
let activeCardRow = ref<Card[]>([])
let resolveRowClick = ref()
let boardDisabled = ref(true)
let slideIndex = ref(0)
let cardModal = ref()
let cardModalModel = ref(false)
let cardModalConfirmText = ref()
let cardModalCancelText = ref()
let cardModalTitle = ref()
let cardModalIcon = ref()
let cardModalDisabled = ref(true)
let beanPopup = ref(false)

// Board row indexes for each card 'type'
const abilityIndexes: Record<string, number> = {
  close: 0,
  ranged: 1,
  siege: 2
}

// Game stats
let roundNumber = ref(1)
let playerIsLead = ref(false)
let isPlayerTurn = ref(false)
let playerIsPassed = ref(false)
let opponentIsPassed = ref(false)
let playerHasRound = ref(false)
let opponentHasRound = ref(false)
let playerRoundTotals = ref<Array<RoundTotal>>([])
let opponentRoundTotals = ref<Array<RoundTotal>>([])
let playerAwards = ref()
let opponentAwards = ref()

// Alert Banner
let alertBannerAvatar = ref()
let alertBannerIcon = ref()
let alertBannerModel = ref(false)
let alertBannerTitle = ref('')

// Modal
let modal = ref()
let modalAvatar = ref()
let modalButtons = ref()
let modalPersistent = ref()
let modalTitle = ref('')

// General Overlay Screen (currently used for board row highlights)
let overlayScreenModel = ref(false)

// Card Preview
let cardPreview = ref(false)
let previewCard = ref()
let cardPreviewIsPlayer = ref(false)

// COMPUTED DATA

const opponentTotal = computed((): number => {
  let total = 0
  for (let i = 0; i < opponentBoardCards.value.length; i++) {
    for (let j = 0; j < opponentBoardCards.value[i].length; j++) {
      total += opponentBoardCards.value[i][j].value || 0
    }
  }
  return total
})

const playerTotal = computed((): number => {
  let total = 0
  for (let i = 0; i < playerBoardCards.value.length; i++) {
    for (let j = 0; j < playerBoardCards.value[i].length; j++) {
      total += playerBoardCards.value[i][j].value || 0
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

const playerDiscardPileDisabled = computed(() => {
  return boardDisabled.value || playerDiscardPile.value.length < 1
})

const opponentDiscardPileDisabled = computed(() => {
  return boardDisabled.value || opponentDiscardPile.value.length < 1
})

// WATCHERS

watch(
  () => props.disabled,
  (val) => {
    setAllDisabled(val)
  }
)

// EVENTS

const emit = defineEmits<{
  (e: 'loading-change', val: boolean): void
  (e: 'player-win'): void
  (e: 'play-sound', val: string): void
  (e: 'save-awards', val: string[]): void
  (e: 'show-menu'): void
}>()

// HOOKS

onMounted(() => {
  setupGame(() => {
    startNewGame()
  })
})

// METHODS - Game Setup

async function setupGame(callback: Function) {
  // Generate card image URLs and preload images
  emit('loading-change', true)

  playerDeckDefault.value = JSON.parse(JSON.stringify(props.playerCards))
  opponentDeckDefault.value = JSON.parse(JSON.stringify(props.opponentCards))

  playerLeaderDefault.value = JSON.parse(JSON.stringify(props.playerLeaderCard))
  opponentLeaderDefault.value = JSON.parse(JSON.stringify(props.opponentLeaderCard))

  playerRowFlagsDefault.value = JSON.parse(JSON.stringify(defaultRowFlags))
  opponentRowFlagsDefault.value = JSON.parse(JSON.stringify(defaultRowFlags))

  playerFlagUrl.value = new URL(
    `../assets/images/${playerLeaderDefault.value.faction}-flag.png`,
    import.meta.url
  ).href
  opponentFlagUrl.value = new URL(
    `../assets/images/${opponentLeaderDefault.value.faction}-flag.png`,
    import.meta.url
  ).href

  await preloadImages([
    'bite-blood.png',
    'broadsword.svg',
    'catapult.svg',
    'crossbow.svg',
    'plague-cells.jpg',
    'scorch-flame.jpg',
    'sharpe-cutout.png'
  ])

  if (callback) {
    callback()
  }
}

function preloadImages(fileNames: string[]) {
  return new Promise<void>((resolve) => {
    let imageCount = fileNames?.length || 0
    let imagesLoaded = 0

    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        loadImage(new URL(`../assets/images/${fileNames[i]}`, import.meta.url).href, () => {
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
  img.onload = () => {
    if (callback) {
      callback()
    }
  }
  img.onerror = (err) => {
    console.error('loadImage ERROR: ', err)
  }
  img.src = imageUrl
}

function startNewGame() {
  setAllDisabled(true)
  emit('loading-change', true)

  // Set leader cards and decks to their default state
  playerLeader.value = JSON.parse(JSON.stringify(playerLeaderDefault.value))
  opponentLeader.value = JSON.parse(JSON.stringify(opponentLeaderDefault.value))
  playerDeck.value = JSON.parse(JSON.stringify(playerDeckDefault.value))
  opponentDeck.value = JSON.parse(JSON.stringify(opponentDeckDefault.value))

  // Generate a random hand of 10 cards for each player
  playerHand.value = dealRandomCards(playerDeck.value, 10).sort(sortCardsLowToHigh)
  opponentHand.value = dealRandomCards(opponentDeck.value, 10)

  // Empty all board rows and card piles
  playerBoardCards.value = [[], [], []]
  opponentBoardCards.value = [[], [], []]
  playerDiscardPile.value = []
  opponentDiscardPile.value = []
  specialDiscardPile.value = []

  // Reset row flags
  playerRowFlags.value = JSON.parse(JSON.stringify(playerRowFlagsDefault.value))
  opponentRowFlags.value = JSON.parse(JSON.stringify(opponentRowFlagsDefault.value))

  roundNumber.value = 1
  playerHasRound.value = false
  opponentHasRound.value = false
  playerIsPassed.value = false
  opponentIsPassed.value = false
  playerRoundTotals.value = []
  opponentRoundTotals.value = []

  // Reset awards
  playerAwards.value = JSON.parse(JSON.stringify(defaultAwards))
  opponentAwards.value = JSON.parse(JSON.stringify(defaultAwards))

  modalAvatar.value = null
  modalButtons.value = null
  modalPersistent.value = false
  modalTitle.value = ''

  // Decide lead player / first turn
  playerIsLead.value = isPlayerTurn.value = getChanceOutcome(0.5)

  emit('loading-change', false)
  emit('play-sound', 'coin')

  showAlertBanner(
    isPlayerTurn.value ? 'You go first' : 'Opponent goes first',
    undefined,
    'gi-crown-coin',
    () => {
      showCardRedrawModal(() => {
        playerHand.value.sort(sortCardsLowToHigh)
        cardRedrawActive.value = false
        emit('play-sound', 'roundstart')

        setTimeout(() => {
          showAlertBanner(`Round ${roundNumber.value} Start`, undefined, 'gi-sands-of-time', () => {
            startTurn()
          })
        }, 400)
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
  emit('play-sound', 'playcard')

  cardRedrawActive.value = true
  playerHandIsActive.value = true
  activeCardRow.value = playerHand.value
  cardModalDisabled.value = false
  playerHandDisabled.value = false

  showCardModal('Redraw', 'Done', 'Choose card to redraw (1 of 2)', 'gi-card-exchange').then(
    (ok) => {
      cardModalDisabled.value = true
      playerHandDisabled.value = true
      if (ok) {
        swapModalCard(() => {
          cardModalDisabled.value = false
          playerHandDisabled.value = false
          showCardModal(
            'Redraw',
            'Done',
            'Choose card to redraw (2 of 2)',
            'gi-card-exchange'
          ).then((ok) => {
            cardModalDisabled.value = true
            playerHandDisabled.value = true
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
        cardModalDisabled.value = true
        playerHandDisabled.value = true
        closeCardModal()
        callback()
      }
    }
  )
}

async function swapModalCard(callback: Function) {
  emit('play-sound', 'swapcard')
  await doCardDisappearAnimation(activeCardRow.value[slideIndex.value])

  // Make deep copy of swapped card and reset it
  let swappedCard = JSON.parse(JSON.stringify(activeCardRow.value[slideIndex.value]))
  resetCards([swappedCard])
  // Splice in new random card to player's hand
  playerHand.value.splice(slideIndex.value, 1, dealRandomCards(playerDeck.value, 1)[0])
  // Push swapped card back to deck
  playerDeck.value.push(swappedCard)

  emit('play-sound', 'drawcard')
  await doSwapAppearAnimation(activeCardRow.value[slideIndex.value])
  callback()
}

// METHODS - Game Loop

function startTurn(skipTurnBanner?: boolean) {
  if (skipTurnBanner) {
    determineMove()
  } else {
    emit('play-sound', 'turn')

    setTimeout(() => {
      showAlertBanner(
        isPlayerTurn.value ? 'Your turn!' : "Opponent's turn",
        isPlayerTurn.value ? playerFlagUrl.value : opponentFlagUrl.value,
        undefined,
        () => {
          determineMove()
        }
      )
    }, 200)
  }
}

function determineMove() {
  // If active player's hand is empty, pass
  if (
    (isPlayerTurn.value && playerHand.value.length < 1) ||
    (!isPlayerTurn.value && opponentHand.value.length < 1)
  ) {
    pass(!isPlayerTurn.value)
  } else {
    if (isPlayerTurn.value) {
      setAllDisabled(false)
    } else {
      // CPU logic
      determineCpuCard((card: Card) => {
        if (card) {
          playCard(card, false, () => {
            // If CPU hand is now empty, pass
            if (opponentHand.value.length < 1) {
              pass(true)
            } else {
              finishTurn()
            }
          })
        } else {
          pass(true)
        }
      })
    }
  }
}

async function playCard(card: Card, isHeal: boolean, callback?: Function) {
  setAllDisabled(true)

  if (!isPlayerTurn.value) {
    await showPreviewCard(card)
  } else {
    emit('play-sound', 'playcard')
  }

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
    // Determine the specific array position for 'bond' cards with the same 'bondName', so they're placed adjacent to one another
    if (card.ability === 'bond') {
      let bondNameFound = false
      for (let i = 0; i < boardArr.length; i++) {
        if (boardArr[i].bondName === card.bondName) {
          bondNameFound = true
        } else {
          if (bondNameFound) {
            boardArrIndex = i
            break
          }
        }
      }
    }
  }

  let awards = isPlayerTurn.value ? playerAwards.value : opponentAwards.value
  // Record spy cards for 'Spy Master' award
  if (card.ability === 'spy') {
    awards.spymaster.count++
  }
  // Record total cards played for 'Tactician' award
  awards.tactician.count++

  if (isPlayerTurn.value) {
    await doCardDisappearAnimation(card)
  }
  closeCardModal()
  emit('play-sound', 'placecard')

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

  await doCardAppearAnimation(card)

  await performAbility(card)

  if (callback) {
    callback()
  }
}

function determineCpuCard(callback?: Function) {
  const cpuIsWinning = opponentTotal.value > playerTotal.value
  let useRandomCard = !playerIsPassed.value && getChanceOutcome(props.cpuDifficulty)
  let card = null

  // If the player hasn't passed and the CPU isn't winning
  if (!(playerIsPassed.value && cpuIsWinning)) {
    if (useRandomCard) {
      // Select a random card...
      let handCopy = JSON.parse(JSON.stringify(opponentHand.value))

      for (let i = 0; i < handCopy.length; i++) {
        let randomIndex = Math.floor(Math.random() * handCopy.length)
        let randomCard = opponentHand.value[randomIndex]

        // If it's a scorch card, determine whether it should be played
        if (randomCard.ability === 'scorch') {
          if (cpuShouldScorch()) {
            card = randomCard
            break
          }
        } else {
          card = randomCard
          break
        }
        // Remove ineligible card from hand until an eligible card is chosen
        handCopy.splice(randomIndex, 1)
        i--
      }
    }

    // If it's decided not to use a random card, use structured decision logic instead
    if (!useRandomCard) {
      // TODO: Expand to include thief cards
      // Find any spy cards
      let spyCards = opponentHand.value.filter((card) => card.ability === 'spy')
      if (spyCards.length > 0) {
        // Find the lowest value spy card
        spyCards.sort(sortCardsLowToHigh)
        card = spyCards[0]
      }
      // No spy cards... decide card
      else {
        let cpuStandardCards = opponentHand.value.filter((card) => card.type !== 'special')

        // If it's a must win round
        if (playerHasRound.value) {
          // If standard cards are available
          if (cpuStandardCards.length > 0) {
            // TODO: Up-front check for scorch and 'heal' opportunities (check dead pile for spies)
            // TODO: Calculate most efficient order to play cards (check for existing 'bond' cards, etc.)
            // Sort cards lowest to highest
            cpuStandardCards.sort(sortCardsLowToHigh)
            // Play the lowest value card
            card = cpuStandardCards[0]
          }
          // No standard cards... Play the next non-standard card ('card' may remain 'null', if no beneficial card available)
          else {
            for (let i = 0; i < opponentHand.value.length; i++) {
              // Only play scorch if it's beneficial
              if (opponentHand.value[i].ability === 'scorch') {
                if (cpuShouldScorch()) {
                  card = opponentHand.value[i]
                  break
                }
              } else {
                card = opponentHand.value[i]
                break
              }
            }
          }
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
              runningCpuTotal = runningCpuTotal + (cpuStandardCards[i].defaultValue || 0)
              handIndex++
            } else {
              break
            }
          }

          // If a win is possible this round, determine the total value of the remaining CPU hand cards, and if that's likely enough to win a subsequent round with
          if (runningCpuTotal > playerTotal.value) {
            // Determine the total value of the CPU's remaining hand cards
            while (handIndex < cpuStandardCards.length) {
              remainingTotal = remainingTotal + (cpuStandardCards[handIndex].defaultValue || 0)
              handIndex++
            }

            // If there's theoretically enough points left to win another round
            if (remainingTotal > 20) {
              // Play the lowest value card
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

function cpuShouldScorch() {
  let highestCardValue = 0
  let cpuScorchCount = 0
  let playerScorchCount = 0

  // For each player
  for (let i = 0; i < 2; i++) {
    // Find highest value of all non-hero card(s)
    let boardCardArrays = i < 1 ? playerBoardCards.value : opponentBoardCards.value
    for (const cardRow of boardCardArrays) {
      const applicableCards = cardRow.filter((card) => !card.hero && card.type !== 'special')
      const maxValue = Math.max(...applicableCards.map((o) => o.value ?? 0), 0)
      highestCardValue = maxValue > highestCardValue ? maxValue : highestCardValue
    }
  }

  // For each player
  for (let i = 0; i < 2; i++) {
    // Count how many cards will be scorched per player
    let boardCardArrays = i < 1 ? playerBoardCards.value : opponentBoardCards.value

    for (const cardRow of boardCardArrays) {
      for (const card of cardRow) {
        if (card.value === highestCardValue && !card.hero && card.type !== 'special') {
          i < 1 ? playerScorchCount++ : cpuScorchCount++
        }
      }
    }
  }
  return playerScorchCount > cpuScorchCount
}

async function performAbility(card: Card) {
  return new Promise<void>(async (resolve) => {
    if (card.ability === 'boost') {
      card.effectIcon = card.abilityIcon
    }

    if (card.ability === 'bite') {
      card.effectIcon = card.abilityIcon
      await performBite()
    }

    if (card.ability === 'double') {
      card.effectIcon = card.abilityIcon
      await performDouble()
    }

    if (card.ability === 'heal') {
      await performHeal(card)
    }

    if (card.ability === 'muster') {
      await performMuster(card)
    }

    if (card.ability === 'plague') {
      await performPlague(card)
    }

    if (
      card.ability === 'close_scorch' ||
      card.ability === 'ranged_scorch' ||
      card.ability === 'siege_scorch'
    ) {
      await performRowScorch(card)
    }

    if (card.ability === 'scorch') {
      await performScorch(card)
    }

    if (card.ability === 'spy') {
      card.effectIcon = card.abilityIcon
      await performSpy()
    }

    if (card.ability === 'thief') {
      card.effectIcon = card.abilityIcon
      await performThief()
    }

    await calculateRows(card)

    // TODO: Decoy card
    // • Add visual highlight to board rows containing eligible cards for swapping
    // • Enable ONLY cards eligible for swapping
    // • Display card carousel containing ONLY cards eligible for swapping, with a "SWAP" and "CANCEL" button

    resolve()
  })
}

function performBite() {
  return new Promise<void>((resolve) => {
    let boardCardArrays = isPlayerTurn.value ? opponentBoardCards.value : playerBoardCards.value
    let applicableCards: Card[] = []

    // Find all applicable cards (no hero, special, or bitten cards)
    for (const cardRow of boardCardArrays) {
      const foundCards = cardRow.filter(
        (card) => !card.hero && card.type !== 'special' && !card.bitten
      )
      applicableCards = [...applicableCards, ...foundCards]
    }

    if (applicableCards.length > 0) {
      // Select random card
      let randomIndex = Math.floor(Math.random() * applicableCards.length)
      let randomCard = applicableCards[randomIndex]

      randomCard.bitten = true
      randomCard.animationName = 'bite'
      randomCard.effectIcon = 'gi-fangs'

      emit('play-sound', 'bite')
      setTimeout(() => {
        randomCard.animationName = undefined
        resolve()
      }, 1000)
    } else {
      resolve()
    }
  })
}

function performDouble() {
  let viableRowFound = false

  return new Promise<void>((resolve) => {
    // If it's the player's turn, enable 'Row Select' mode
    if (isPlayerTurn.value) {
      overlayScreenModel.value = true
      // Highlight each applicable player row
      for (let i = 0; i < playerRowFlags.value.length; i++) {
        if (!playerRowFlags.value[i].double) {
          viableRowFound = true
          playerRowFlags.value[i].rowSelect = true
        }
      }

      // TODO: Disable player hand, or trap focus on rows (can be accessed by keyboard)

      if (viableRowFound) {
        return new Promise<number>((resolveClick) => {
          resolveRowClick.value = resolveClick
        }).then((rowIndex) => {
          playerRowFlags.value[rowIndex].highlight = true
          // Disable row select for all rows
          for (const rowFlag of playerRowFlags.value) {
            rowFlag.rowSelect = false
          }
          setTimeout(() => {
            playerRowFlags.value[rowIndex].double = true
            emit('play-sound', 'double')

            setTimeout(() => {
              playerRowFlags.value[rowIndex].highlight = false
              overlayScreenModel.value = false
              resolve()
            }, 500)
          }, 500)
        })
      } else {
        resolve()
      }
    }
    // Is CPU turn
    else {
      performCpuDouble(() => {
        setTimeout(() => {
          resolve()
        }, 1000)
      })
    }
  })
}

function performCpuDouble(callback?: Function) {
  let rowIndex = null
  let highestRowTotal = 0

  // Work out which row has the highest value (excluding hero cards)
  for (let i = 0; i < opponentRowFlags.value.length; i++) {
    if (!opponentRowFlags.value[i].double) {
      let rowTotal = 0
      for (const card of opponentBoardCards.value[i]) {
        if (card.value && !card.hero) {
          rowTotal += card.value
        }
      }
      if (rowTotal >= highestRowTotal) {
        highestRowTotal = rowTotal
        rowIndex = i
      }
    }
  }

  if (rowIndex !== null) {
    opponentRowFlags.value[rowIndex].double = true
    emit('play-sound', 'double')
  }

  if (callback) {
    callback()
  }
}

function performHeal(card: Card) {
  return new Promise<void>((resolve) => {
    // Create array containing only viable cards (no hero or special)
    let discardPile = isPlayerTurn.value ? playerDiscardPile : opponentDiscardPile
    let validHealCards = discardPile.value.filter(
      (discardCard) => !discardCard.hero && discardCard.type !== 'special'
    )

    if (validHealCards.length > 0) {
      // Display effect icon if valid heal card found
      card.effectIcon = card.abilityIcon

      if (isPlayerTurn.value) {
        healActive.value = true
        activeCardRow.value = validHealCards
        slideIndex.value = 0
        cardModalDisabled.value = false

        showCardModal('Play Card', 'Cancel', 'Choose card to revive', 'gi-heart-plus').then(
          (ok) => {
            cardModalDisabled.value = true

            if (ok) {
              let healedCardId = activeCardRow.value[slideIndex.value].id
              let healedCard = playerDiscardPile.value.find((o) => o.id === healedCardId) as Card

              playCard(healedCard, true, () => {
                healActive.value = false
                resolve()
              })
            } else {
              // Player cancels heal, turn continues
              closeCardModal()
              healActive.value = false
              resolve()
            }
          }
        )
      } else {
        // Is opponent's turn... Play best valid discard pile card
        determineCpuHealCard(validHealCards, (card: Card) => {
          playCard(card, true, () => {
            resolve()
          })
        })
      }
    } else {
      resolve()
    }
  })
}

function determineCpuHealCard(arr: Card[], callback?: Function) {
  let card
  let spyCards = arr.filter((card) => card.ability === 'spy') // Find any spy cards

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

function performMuster(card: Card) {
  return new Promise<void>((resolve) => {
    let deck = isPlayerTurn.value ? playerDeck.value : opponentDeck.value
    let boardCards = isPlayerTurn.value ? playerBoardCards : opponentBoardCards
    let cardsFound = false

    // TODO: Expand to muster hand cards as well as deck cards
    for (let i = 0; i < deck.length; i++) {
      let deckCard = deck[i]
      let boardArrIndex = 0

      // Find deck cards of the same muster name as played card, move them to the relevant board row, and remove found cards from deck
      if (deckCard.musterName === card.musterName) {
        cardsFound = true

        // Find any existing board cards of 'muster' or 'bond' cards of the same bond type in the relevant board row
        let abilityMatchFound = false
        for (let i = 0; i < boardCards.value[abilityIndexes[deckCard.type]].length; i++) {
          if (
            // boardCards.value[abilityIndexes[deckCard.type]][i].musterName === deckCard.musterName ||
            boardCards.value[abilityIndexes[deckCard.type]][i].bondName === deckCard.bondName
          ) {
            abilityMatchFound = true
          } else {
            if (abilityMatchFound) {
              boardArrIndex = i
              break
            }
          }
        }

        // If existing bond cards found, place deck card into board row array next to any existing matching cards
        if (boardArrIndex) {
          boardCards.value[abilityIndexes[deckCard.type]].splice(boardArrIndex, 0, deckCard)
        }
        // Otherwise, add deck card to the end of the board row array
        else {
          boardCards.value[abilityIndexes[deckCard.type]].push(deckCard)
        }
        deck.splice(i, 1)
        doCardAppearAnimation(deckCard)
        i--
      }
    }
    if (cardsFound) {
      card.effectIcon = card.abilityIcon
      emit('play-sound', 'muster')
      emit('play-sound', 'placecard')
    }
    // If cards found, allow time for animations
    setTimeout(
      () => {
        if (cardsFound && card.musterName === 'calvet') {
          beanPopup.value = true
          emit('play-sound', 'fatbastard')
          setTimeout(() => {
            beanPopup.value = false
          }, 1000)
        }

        resolve()
      },
      cardsFound ? 1500 : 0
    )
  })
}

function performPlague(card: Card) {
  return new Promise<void>((resolve) => {
    let lowestCardValue: number | null = null
    let plagueCount = 0

    // For each player
    for (let i = 0; i < 2; i++) {
      // Find the lowest value of all non-hero cards
      let boardCardArrays = i < 1 ? playerBoardCards.value : opponentBoardCards.value
      for (const cardRow of boardCardArrays) {
        const applicableCards = cardRow.filter((card) => !card.hero && card.type !== 'special')
        if (applicableCards.length === 0) continue

        const cardValues = applicableCards.map((o) => o.value ?? 0)
        const minValue = cardValues.length ? Math.min(...cardValues) : 0

        if (lowestCardValue === null) {
          lowestCardValue = minValue
        } else {
          lowestCardValue = Math.min(lowestCardValue, minValue)
        }
      }
    }

    // For each player
    for (let i = 0; i < 2; i++) {
      // Apply Plague animation / effect icon to the lowest value non-hero cards
      let boardCardArrays = i < 1 ? playerBoardCards.value : opponentBoardCards.value

      for (const cardRow of boardCardArrays) {
        for (const card of cardRow) {
          if (card.value === lowestCardValue && !card.hero && card.type !== 'special') {
            plagueCount++
            card.animationName = 'plague'
            card.effectIcon = 'fa-virus'
          }
        }
      }
    }

    if (plagueCount > 0) {
      card.effectIcon = card.abilityIcon
      emit('play-sound', 'plague')

      setTimeout(() => {
        // For each player
        for (let i = 0; i < 2; i++) {
          // Plague the highest value non-hero cards
          let boardCardArrays = i < 1 ? playerBoardCards.value : opponentBoardCards.value
          let discardPile = i < 1 ? playerDiscardPile : opponentDiscardPile

          for (const cardRow of boardCardArrays) {
            for (let i = 0; i < cardRow.length; i++) {
              if (
                cardRow[i].value === lowestCardValue &&
                !cardRow[i].hero &&
                cardRow[i].type !== 'special'
              ) {
                discardPile.value.push(cardRow[i])
                cardRow.splice(i, 1)
                i--
              }
            }
            resetCards(discardPile.value)
          }
        }
        resolve()
      }, 2000)
    } else {
      resolve()
    }
  })
}

function performRowScorch(card: Card) {
  return new Promise<void>((resolve) => {
    let cardRow = isPlayerTurn.value
      ? opponentBoardCards.value[abilityIndexes[card.type]]
      : playerBoardCards.value[abilityIndexes[card.type]]
    let cardRowTotal = isPlayerTurn.value
      ? rowTotals.value.opponent[abilityIndexes[card.type]]
      : rowTotals.value.player[abilityIndexes[card.type]]
    let scorchCount = 0

    // If cards are present in the relevant board card row, and they total 10 or above
    if (cardRow.length > 0 && cardRowTotal > 9) {
      // Find highest value of all non-hero cards
      const applicableCards = cardRow.filter((card) => !card.hero && card.type !== 'special')
      const maxValue = Math.max(...applicableCards.map((o) => o.value ?? 0), 0)

      for (const card of cardRow) {
        if (card.value === maxValue && !card.hero && card.type !== 'special') {
          scorchCount++
          card.animationName = 'scorch'
          card.effectIcon = 'io-skull'
        }
      }

      if (scorchCount > 0) {
        card.effectIcon = card.abilityIcon
        emit('play-sound', 'scorch')

        if (scorchCount > 2 || (scorchCount > 0 && getChanceOutcome(0.5))) {
          beanPopup.value = true
          emit('play-sound', 'toasty')
          setTimeout(() => {
            beanPopup.value = false
          }, 900)
        }

        setTimeout(() => {
          // Move scorched cards from board to discard pile
          let discardPile = isPlayerTurn.value ? opponentDiscardPile : playerDiscardPile

          for (let i = 0; i < cardRow.length; i++) {
            if (
              cardRow[i].value === maxValue &&
              !cardRow[i].hero &&
              cardRow[i].type !== 'special'
            ) {
              discardPile.value.push(cardRow[i])
              cardRow.splice(i, 1)
              i--

              // Record scorch for 'Tyrant' award
              isPlayerTurn.value
                ? playerAwards.value.tyrant.count++
                : opponentAwards.value.tyrant.count++
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

function performScorch(card: Card) {
  return new Promise<void>((resolve) => {
    let highestCardValue = 0
    let scorchCount = 0

    // For each player
    for (let i = 0; i < 2; i++) {
      // Find the highest value of all non-hero cards
      let boardCardArrays = i < 1 ? playerBoardCards.value : opponentBoardCards.value
      for (const cardRow of boardCardArrays) {
        const applicableCards = cardRow.filter((card) => !card.hero && card.type !== 'special')
        const maxValue = Math.max(...applicableCards.map((o) => o.value ?? 0), 0)
        highestCardValue = maxValue > highestCardValue ? maxValue : highestCardValue
      }
    }

    // For each player
    for (let i = 0; i < 2; i++) {
      // Apply Scorch animation / effect icon to the highest value non-hero cards
      let boardCardArrays = i < 1 ? playerBoardCards.value : opponentBoardCards.value

      for (const cardRow of boardCardArrays) {
        for (const card of cardRow) {
          if (card.value === highestCardValue && !card.hero && card.type !== 'special') {
            scorchCount++
            card.animationName = 'scorch'
            card.effectIcon = 'io-skull'
          }
        }
      }
    }

    if (scorchCount > 0) {
      card.effectIcon = card.abilityIcon
      emit('play-sound', 'scorch')

      if (scorchCount > 2 || (scorchCount > 0 && getChanceOutcome(0.5))) {
        beanPopup.value = true
        emit('play-sound', 'toasty')
        setTimeout(() => {
          beanPopup.value = false
        }, 900)
      }

      setTimeout(() => {
        // For each player
        for (let i = 0; i < 2; i++) {
          // Scorch the highest value non-hero cards
          let boardCardArrays = i < 1 ? playerBoardCards.value : opponentBoardCards.value
          let discardPile = i < 1 ? playerDiscardPile : opponentDiscardPile

          for (const cardRow of boardCardArrays) {
            for (let i = 0; i < cardRow.length; i++) {
              if (
                cardRow[i].value === highestCardValue &&
                !cardRow[i].hero &&
                cardRow[i].type !== 'special'
              ) {
                discardPile.value.push(cardRow[i])
                cardRow.splice(i, 1)
                i--
                // Record scorch for 'Tyrant' award
                isPlayerTurn.value
                  ? playerAwards.value.tyrant.count++
                  : opponentAwards.value.tyrant.count++
              }
            }
            resetCards(discardPile.value)
          }
        }
        resolve()
      }, 2000)
    } else {
      resolve()
    }
  })
}

function performSpy() {
  return new Promise<void>(async (resolve) => {
    let hand = isPlayerTurn.value ? playerHand : opponentHand
    let deck = isPlayerTurn.value ? playerDeck : opponentDeck

    if (isPlayerTurn.value) {
      let randomCardsArr = dealRandomCards(deck.value, 2)

      await showPreviewCard(randomCardsArr[0], isPlayerTurn.value)
      hand.value.push(randomCardsArr[0])
      hand.value.sort(sortCardsLowToHigh)

      await showPreviewCard(randomCardsArr[1], isPlayerTurn.value)
      hand.value.push(randomCardsArr[1])
      hand.value.sort(sortCardsLowToHigh)

      resolve()
    } else {
      emit('play-sound', 'drawcard')
      hand.value.push(...dealRandomCards(deck.value, 2))
      // Timeout to allow effect icon to animate
      setTimeout(() => {
        resolve()
      }, 1000)
    }
  })
}

function performThief() {
  return new Promise<void>(async (resolve) => {
    let hand = isPlayerTurn.value ? playerHand : opponentHand
    let deck = isPlayerTurn.value ? opponentDeck : playerDeck

    if (isPlayerTurn.value) {
      let randomCardArr = dealRandomCards(deck.value, 1)

      await showPreviewCard(randomCardArr[0], isPlayerTurn.value)
      hand.value.push(randomCardArr[0])
      hand.value.sort(sortCardsLowToHigh)

      resolve()
    } else {
      emit('play-sound', 'drawcard')
      hand.value.push(...dealRandomCards(deck.value, 1))
      // Timeout to allow effect icon to animate
      setTimeout(() => {
        resolve()
      }, 1000)
    }
  })
}

async function calculateRows(card: Card) {
  let statsIncreased = false

  for (let i = 0; i < 2; i++) {
    let boardCardArrays = i < 1 ? playerBoardCards.value : opponentBoardCards.value
    let rowFlags = i < 1 ? playerRowFlags.value : opponentRowFlags.value

    for (let j = 0; j < boardCardArrays.length; j++) {
      const statHasIncreased = await calculateRow(boardCardArrays[j], rowFlags[j], card)
      if (statHasIncreased) {
        statsIncreased = true
      }
    }
  }

  if (statsIncreased) {
    emit('play-sound', 'statincrease')
  }

  await new Promise<void>((resolve) => {
    setTimeout(
      () => {
        // Reset value increased flag / effect icon flag for all board cards
        for (let i = 0; i < 2; i++) {
          let boardCardArrays = i < 1 ? playerBoardCards.value : opponentBoardCards.value

          for (let j = 0; j < boardCardArrays.length; j++) {
            for (let k = 0; k < boardCardArrays[j].length; k++) {
              boardCardArrays[j][k].valueIncreased = false
              boardCardArrays[j][k].effectIcon = undefined
            }
          }
        }
        resolve()
      },
      statsIncreased || card?.ability === 'boost' ? 1500 : 500
    )
  })
}

async function calculateRow(rowArr: Card[], rowFlag: RowFlag, card: Card) {
  try {
    let statHasIncreased = false

    // Record the initial state of the row array
    const initialRowArr = JSON.parse(JSON.stringify(rowArr))

    // Reset each card's value before recalculating row
    for (const card of rowArr) {
      // Set bitten cards to a base value of 0
      if (card.bitten) {
        card.value = 0
      } else {
        card.value = card.defaultValue
      }
    }

    // TODO: Weather cards
    await calculateBond(rowArr)
    await calculateBoost(rowArr)
    await calculateDouble(rowArr, rowFlag)

    // Compare new value of each card to its initial value, and apply any necessary flags to cards
    for (let i = 0; i < rowArr.length; i++) {
      if ((rowArr[i].value ?? 0) > (initialRowArr[i]?.value ?? 0)) {
        rowArr[i].valueIncreased = true
        statHasIncreased = true

        // If the increased card is a bond card, and the played / mustered card is a bond card of the same bond name, set the effect icon
        if (
          rowArr[i].ability === 'bond' &&
          (card.ability === 'bond' ||
            (rowArr[i].musterName && rowArr[i].musterName === card.musterName))
        ) {
          let bondCount = 0
          for (let j = 0; j < rowArr.length; j++) {
            if (rowArr[i].bondName === rowArr[j].bondName) {
              bondCount++
            }
          }
          if (bondCount > 1) {
            rowArr[i].effectIcon = rowArr[i].abilityIcon
          }
        }
      }
    }

    return statHasIncreased
  } catch (err) {
    console.error('Error calculating row: ', err)
  }
}

function calculateBond(rowArr: Card[]) {
  return new Promise<void>((resolve) => {
    let bondNames = []

    // Loop through and save each UNIQUE bondName to an array
    for (const card of rowArr) {
      if (card.ability === 'bond' && bondNames.indexOf(card.bondName) === -1) {
        bondNames.push(card.bondName)
      }
    }

    // For each bond name
    for (const bondName of bondNames) {
      let bondIndexes = []
      let multiplier = 0

      // For each bondName, save the index of each card with the corresponding bondName to bondIndexes and increment multiplier
      for (let i = 0; i < rowArr.length; i++) {
        if (rowArr[i].bondName === bondName) {
          bondIndexes.push(i)
          multiplier++
        }
      }
      // Set the new value of each card
      for (const bondIndex of bondIndexes) {
        rowArr[bondIndex].value = (rowArr[bondIndex].value || 0) * multiplier
      }
    }
    resolve()
  })
}

function calculateBoost(rowArr: Card[]) {
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
        rowArr[i].value = (rowArr[i].value || 0) + boostValue
      }
    }
    resolve()
  })
}

function calculateDouble(rowArr: Card[], rowFlag: RowFlag) {
  return new Promise<void>((resolve) => {
    if (rowFlag.double) {
      for (const card of rowArr) {
        if (card.value && !card.hero) {
          card.value = card.value * 2
        }
      }
    }
    resolve()
  })
}

function pass(isCpu?: boolean) {
  if (isCpu) {
    opponentIsPassed.value = true
  } else {
    setAllDisabled(true)
    playerIsPassed.value = true
  }

  showAlertBanner(isCpu ? 'Opponent has passed' : 'You have passed', undefined, 'fa-flag', () => {
    finishTurn(true)
  })
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
  let unlockedAwards = []

  // Determine highest scorer this round
  if (playerTotal.value === opponentTotal.value) {
    isDraw = true
  } else {
    if (playerTotal.value > opponentTotal.value) {
      isPlayerRoundWin = true
    } else {
      isOpponentRoundWin = true
    }
  }

  // Record player round totals
  playerRoundTotals.value.push({
    isWin: isPlayerRoundWin,
    value: playerTotal.value
  })
  opponentRoundTotals.value.push({
    isWin: isOpponentRoundWin,
    value: opponentTotal.value
  })

  // Record round scores for 'Field Marshal' award
  if (playerTotal.value > playerAwards.value.fieldmarshal.count) {
    playerAwards.value.fieldmarshal.count = playerTotal.value
  }
  if (opponentTotal.value > opponentAwards.value.fieldmarshal.count) {
    opponentAwards.value.fieldmarshal.count = opponentTotal.value
  }
  // Record siege row totals for 'Heavyweight' award
  if (rowTotals.value.player[2] > playerAwards.value.heavyweight.count) {
    playerAwards.value.heavyweight.count = rowTotals.value.player[2]
  }
  if (rowTotals.value.opponent[2] > opponentAwards.value.heavyweight.count) {
    opponentAwards.value.heavyweight.count = rowTotals.value.opponent[2]
  }

  // MATCH END CONDITION 1 - DRAW - Round is a draw and each player has already won a round
  if (isDraw && playerHasRound.value && opponentHasRound.value) {
    isMatchDraw = true
  }
  // MATCH END CONDITION 2 - WIN - Round is a draw and ONE player has already won a round
  else if (isDraw && (playerHasRound.value || opponentHasRound.value)) {
    playerHasRound.value ? (isPlayerMatchWin = true) : (isOpponentMatchWin = true)
  }
  // MATCH END CONDITION 3 - WIN - Round winner has already won a round
  else if (
    (isPlayerRoundWin && playerHasRound.value) ||
    (isOpponentRoundWin && opponentHasRound.value)
  ) {
    isPlayerRoundWin ? (isPlayerMatchWin = true) : (isOpponentMatchWin = true)
  }
  // MATCH END CONDITION 4 - NO CARDS
  else if (playerHand.value.length === 0 && opponentHand.value.length === 0) {
    // If the match never went beyond round 1, work out if the match was won or drawn
    if (roundNumber.value === 1) {
      if (isDraw) {
        isMatchDraw = true
      } else {
        isPlayerRoundWin ? (isPlayerMatchWin = true) : (isOpponentMatchWin = true)
      }
    }
    // Round winner hasn't already won a round (MATCH END CONDITION 3) and this round wasn't a draw (MATCH END CONDITION 1 & 2)... Bother players must have 1 round each and no cards left
    else {
      isMatchDraw = true
    }
  }

  // Match is won or drawn
  if (isPlayerMatchWin || isOpponentMatchWin || isMatchDraw) {
    // Determine awards
    for (let i = 0; i < 2; i++) {
      let awards = i < 1 ? playerAwards.value : opponentAwards.value

      for (const awardKey in awards) {
        if (awards[awardKey].count >= awards[awardKey].targetCount && awardKey !== 'tactician') {
          awards[awardKey].active = true
          if (i < 1) {
            unlockedAwards.push(awardKey)
          }
        }
      }
    }

    if (isMatchDraw) {
      modalTitle.value = 'Match Drawn'
      emit('play-sound', 'matchdraw')
    } else {
      if (isPlayerMatchWin) {
        emit('player-win') // Emit a player win to App.vue for card unlock purposes
        emit('play-sound', 'matchwin')
      } else {
        emit('play-sound', 'matchlose')
      }

      // Determine 'Tactician' award
      let tacticianAward = isPlayerMatchWin
        ? playerAwards.value.tactician
        : opponentAwards.value.tactician
      if (tacticianAward.count <= tacticianAward.targetCount) {
        tacticianAward.active = true
        if (isPlayerMatchWin) {
          unlockedAwards.push('tactician')
        }
      }

      modalAvatar.value = isPlayerMatchWin ? playerFlagUrl.value : opponentFlagUrl.value
      modalTitle.value = isPlayerMatchWin ? 'You Win!!!' : 'Opponent Wins'
    }

    // Save any unlocked awards
    emit('save-awards', unlockedAwards)

    modalButtons.value = ['Play Again', 'Main Menu']
    modalPersistent.value = true
    modal.value.show().then((i: number) => {
      if (i === 1) {
        startNewGame()
      }
      if (i === 2) {
        emit('show-menu')
      }
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
      emit('play-sound', 'rounddraw')
    } else if (isPlayerRoundWin) {
      playerHasRound.value = true
      alertTitle = 'You won the round!'
      alertIcon = 'oi-star-fill'
      emit('play-sound', 'roundwin')
    } else {
      opponentHasRound.value = true
      alertTitle = 'Your opponent won the round'
      alertIcon = 'gi-broken-shield'
      emit('play-sound', 'roundlose')
    }

    showAlertBanner(alertTitle, undefined, alertIcon, () => {
      // Otherwise, start next round
      setupRound(isDraw, isPlayerRoundWin, () => {
        emit('play-sound', 'roundstart')

        setTimeout(() => {
          showAlertBanner(`Round ${roundNumber.value} Start`, undefined, 'gi-sands-of-time', () => {
            startTurn()
          })
        }, 400)
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

  // Move each special card to the relevant player's discard pile
  for (let i = 0; i < specialDiscardPile.value.length; i++) {
    let discardPile =
      specialDiscardPile.value[i].faction === props.playerLeaderCard.faction
        ? playerDiscardPile
        : opponentDiscardPile
    discardPile.value.push(specialDiscardPile.value[i])
    specialDiscardPile.value.splice(i, 1)
    i--
  }

  resetCards(playerDiscardPile.value)
  resetCards(opponentDiscardPile.value)
  playerDiscardPile.value.sort(sortCardsLowToHigh)
  opponentDiscardPile.value.sort(sortCardsLowToHigh)

  // Reset row flags
  playerRowFlags.value = JSON.parse(JSON.stringify(playerRowFlagsDefault.value))
  opponentRowFlags.value = JSON.parse(JSON.stringify(opponentRowFlagsDefault.value))

  if (callback) {
    callback()
  }
}

// METHODS - Events

function rowClick(rowIndex: number) {
  resolveRowClick.value(rowIndex)
}

async function handCardClick(index: number) {
  emit('play-sound', 'selectcard')

  // If redrawing cards before the game
  if (cardRedrawActive.value) {
    slideIndex.value = index
  } else {
    // If the clicked hand card is already active, close the card carousel
    if (playerHandIsActive.value && index === slideIndex.value) {
      closeCardModal()
      boardDisabled.value = false
    } else {
      playerHandIsActive.value = true
      activeCardRow.value = playerHand.value
      slideIndex.value = index

      showCardModal('Play Card', 'Cancel', 'Player Hand', 'gi-card-play').then((ok) => {
        if (ok) {
          activeCardRow.value[slideIndex.value].active = false
          playCard(activeCardRow.value[slideIndex.value], false, () => {
            // If player hand is now empty, pass
            if (playerHand.value.length < 1) {
              pass()
            } else {
              finishTurn()
            }
          })
        } else {
          closeCardModal()
          boardDisabled.value = false
        }
      })
    }
  }
}

function boardCardClick(index: number, rowIndex: number, isPlayer?: boolean) {
  const playerName = isPlayer ? 'Player' : 'Opponent'
  let title = `${playerName} Close Combat`
  let icon = 'gi-broadsword'

  emit('play-sound', 'selectcard')
  if (rowIndex > 0) {
    title = rowIndex === 1 ? `${playerName} Ranged Combat` : `${playerName} Siege Combat`
    icon = rowIndex === 1 ? 'gi-crossbow' : 'gi-catapult'
  }
  activeCardRow.value = isPlayer
    ? playerBoardCards.value[rowIndex]
    : opponentBoardCards.value[rowIndex]
  slideIndex.value = index
  showCardModal(undefined, 'Close', title, icon).then(() => {
    closeCardModal()
    boardDisabled.value = false
  })
}

function discardPileClick(isPlayer?: boolean) {
  discardPileActive.value = true
  let title = isPlayer ? 'Player Discard Pile' : 'Opponent Discard Pile'
  activeCardRow.value = isPlayer ? playerDiscardPile.value : opponentDiscardPile.value
  slideIndex.value = 0
  showCardModal(undefined, 'Close', title, 'fa-skull-crossbones').then(() => {
    closeCardModal()
    discardPileActive.value = false
    boardDisabled.value = false
  })
}

function showCardModal(confirmText?: string, cancelText?: string, title?: string, icon?: string) {
  boardDisabled.value = true
  cardModalConfirmText.value = confirmText
  cardModalCancelText.value = cancelText
  cardModalTitle.value = title
  cardModalIcon.value = icon

  return new Promise((resolve) => {
    cardModal.value.show().then((ok: boolean) => {
      resolve(ok)
    })
  })
}

function closeCardModal() {
  cardModalModel.value = false
  cardModalConfirmText.value = null
  cardModalCancelText.value = null
  cardModalTitle.value = null
  slideIndex.value = 0
  playerHandIsActive.value = false
}

function showPauseModal() {
  setAllDisabled(true)
  modalAvatar.value = null
  modalButtons.value = ['Resume', 'Quit']
  modalPersistent.value = false
  modalTitle.value = 'Paused'

  modal.value.show().then((i: number) => {
    setAllDisabled(false)
    if (i === 2) {
      emit('show-menu')
    }
  })
}

function showAlertBanner(title: string, avatar?: string, icon?: string, callback?: Function) {
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

function showPreviewCard(card: Card, isPlayer?: boolean) {
  return new Promise<void>((resolve) => {
    previewCard.value = card
    cardPreviewIsPlayer.value = !!isPlayer
    cardPreview.value = true
    emit('play-sound', 'drawcard')

    setTimeout(() => {
      cardPreview.value = false
      setTimeout(() => {
        previewCard.value = null
        resolve()
      }, 300) // Timeout completes 200ms earlier than 'PreviewCard' animation for overlap with board card fade in
    }, 800)
  })
}

// METHODS - Helpers

function doCardAppearAnimation(card: Card) {
  return new Promise<void>((resolve) => {
    card.appearAnimation = true

    if (card.hero) {
      setTimeout(() => {
        emit('play-sound', 'hero')
      }, 500)
    }

    setTimeout(
      () => {
        card.appearAnimation = false
        resolve()
      },
      card.hero ? 1500 : 500
    )
  })
}

function doCardDisappearAnimation(card: Card) {
  return new Promise<void>((resolve) => {
    card.animationName = 'white-fade-in'
    setTimeout(() => {
      card.animationName = undefined
      resolve()
    }, 400)
  })
}

function doSwapAppearAnimation(card: Card) {
  return new Promise<void>((resolve) => {
    card.animationName = 'white-fade-out'
    setTimeout(() => {
      card.animationName = 'shine'
      setTimeout(() => {
        card.animationName = undefined
        resolve()
      }, 500)
    }, 400)
  })
}

function resetCards(arr: Card[]) {
  for (const card of arr) {
    card.active = false
    card.animationName = undefined
    card.bitten = false
    card.effectIcon = undefined
    card.value = card.defaultValue
  }
}

function setAllDisabled(bool: boolean) {
  boardDisabled.value = bool
  playerHandDisabled.value = bool
  cardModalDisabled.value = bool
}

function getRowTotal(arr: Card[]) {
  let total = 0
  for (let i = 0; i < arr.length; i++) {
    total += arr[i].value || 0
  }
  return total
}

function getChanceOutcome(percentage: number) {
  return Math.random() < percentage
}

function sortCardsLowToHigh(a: Card, b: Card) {
  const aVal = a.value ?? -Infinity
  const bVal = b.value ?? -Infinity
  return aVal - bVal || a.name.localeCompare(b.name)
}

function sortCardsHighToLow(a: Card, b: Card) {
  const aVal = a.value ?? -Infinity
  const bVal = b.value ?? -Infinity
  return bVal - aVal || b.name.localeCompare(a.name)
}
</script>

<template>
  <div class="game-board" :class="{ desktop: desktop }">
    <StandardModal
      :avatar="modalAvatar"
      :buttons="modalButtons"
      :desktop="props.desktop"
      :disabled="props.disabled"
      :persistent="modalPersistent"
      ref="modal"
      :title="modalTitle"
    >
      <div v-if="playerRoundTotals.length > 0" class="match-stats player">
        <h2 class="title">Player</h2>
        <div
          v-for="(total, i) in playerRoundTotals"
          class="round-total"
          :class="{ win: total.isWin }"
          :key="i"
        >
          <v-icon v-if="total.isWin" class="round-icon" name="oi-star-fill" />
          {{ total.value }}
        </div>
        <template v-for="(award, key) in playerAwards" :key="key">
          <AwardBadge
            v-if="award.active"
            active
            :desktop="props.desktop"
            :icon="award.icon"
            :name="award.name"
            reverse
            :type="String(key)"
          ></AwardBadge>
        </template>
      </div>
      <div v-if="playerRoundTotals.length > 0" class="match-stats opponent">
        <h2 class="title">Opponent</h2>
        <div
          v-for="(total, i) in opponentRoundTotals"
          class="round-total"
          :class="{ win: total.isWin }"
          :key="i"
        >
          <v-icon v-if="total.isWin" class="round-icon" name="oi-star-fill" />
          {{ total.value }}
        </div>
        <template v-for="(award, key) in opponentAwards" :key="key">
          <AwardBadge
            v-if="award.active"
            active
            :desktop="props.desktop"
            :icon="award.icon"
            :name="award.name"
            :type="String(key)"
          ></AwardBadge>
        </template>
      </div>
    </StandardModal>

    <AlertBanner
      v-model="alertBannerModel"
      :avatar="alertBannerAvatar"
      :desktop="props.desktop"
      :icon="alertBannerIcon"
      :title="alertBannerTitle"
    ></AlertBanner>

    <OverlayScreen v-model="overlayScreenModel"></OverlayScreen>

    <div class="game-container">
      <div class="board-container">
        <CardPreview
          v-model="cardPreview"
          :card="previewCard"
          :desktop="props.desktop"
          :player="cardPreviewIsPlayer"
        ></CardPreview>

        <CardModal
          v-model="cardModalModel"
          :cancel-text="cardModalCancelText"
          class="quick-fade"
          :class="{ 'cover-player-hand': healActive }"
          :confirm-text="cardModalConfirmText"
          :desktop="props.desktop"
          :disabled="cardModalDisabled"
          :persistent="cardRedrawActive || healActive"
          ref="cardModal"
        >
          <template v-if="cardModalTitle" v-slot:header>
            <v-icon
              v-if="cardRedrawActive || healActive || playerHandIsActive || discardPileActive"
              class="card-modal-header-icon"
              :name="cardModalIcon"
            />
            <div v-else class="combat-type-badge">
              <v-icon class="icon" :name="cardModalIcon" />
            </div>
            <h2 class="card-modal-header-title">{{ cardModalTitle }}</h2>
          </template>

          <CardCarousel
            v-model="slideIndex"
            :cards="activeCardRow"
            :desktop="props.desktop"
            :disabled="cardModalDisabled"
            @btn-click="emit('play-sound', 'selectcard')"
          ></CardCarousel>
        </CardModal>

        <div
          v-for="(rowFlag, i) in opponentRowFlags"
          class="card-row opponent-row"
          :class="[
            `card-row${i + 1}`,
            { 'row-select': rowFlag.rowSelect },
            { highlight: rowFlag.highlight }
          ]"
          :key="`opponent-row-${i}`"
          @click="rowFlag.rowSelect ? rowClick(i) : null"
        >
          <div class="card-row-wrap">
            <div class="row-stats">
              <div class="board-score-badge opponent">{{ rowTotals.opponent[i] }}</div>
              <div v-if="rowFlag.double" class="ability-badge">
                <v-icon class="icon ability-icon" :name="rowFlag.doubleIcon" />
              </div>
              <div v-if="rowFlag.weather" class="ability-badge">
                <v-icon class="icon ability-icon" :name="rowFlag.weatherIcon" />
              </div>
            </div>

            <div class="card-container">
              <SmallCard
                v-for="(card, j) in opponentBoardCards[i]"
                :ability-icon="card.abilityIcon"
                :active="card.active"
                :animation-name="card.animationName"
                :appear-animation="card.appearAnimation"
                :bitten="card.bitten"
                :default-value="card.defaultValue"
                :desktop="props.desktop"
                :disabled="boardDisabled"
                :effect-icon="card.effectIcon"
                :hero="card.hero"
                :image-url="card.imageUrl"
                :key="j"
                :name="card.name"
                overlap
                role="button"
                :tabindex="boardDisabled ? '-1' : '4'"
                :type-icon="card.typeIcon"
                :value="card.value"
                :value-increased="card.valueIncreased"
                @card-click="boardCardClick(j, i)"
                @card-enter="boardCardClick(j, i)"
                @card-space="boardCardClick(j, i)"
              />
            </div>
          </div>
        </div>

        <div class="game-details">
          <div class="pass-btn-wrap">
            <button
              class="pass-btn"
              :class="{ disabled: boardDisabled }"
              :disabled="boardDisabled"
              :tabindex="boardDisabled ? '-1' : '7'"
              title="Pass"
              type="button"
              @click="pass()"
            >
              <span class="pass-btn-text">Pass</span>
            </button>
          </div>

          <div class="player-details">
            <div class="avatar">
              <v-icon
                v-if="playerIsPassed"
                animation="float"
                class="icon pass-icon"
                name="fa-flag"
              />
              <div
                v-if="playerLeader"
                class="flag"
                :class="{ active: isPlayerTurn }"
                :title="
                  playerLeader.faction.charAt(0).toUpperCase() + playerLeader.faction.slice(1)
                "
                :style="{ backgroundImage: `url(${playerFlagUrl})` }"
              >
                <v-icon
                  v-if="isPlayerTurn"
                  animation="float"
                  class="icon turn-icon"
                  name="fa-map-marker"
                  speed="fast"
                />
              </div>

              <div class="avatar-details">
                <h2 class="title">Player</h2>
                <div class="round-counter">
                  <v-icon v-if="playerHasRound" class="icon round-icon" name="oi-star-fill" />
                  <v-icon v-else class="icon round-icon-placeholder" name="oi-star" />
                  <v-icon class="icon round-icon-placeholder" name="oi-star" />
                </div>
              </div>
            </div>
            <div class="stats">
              <div class="board-score-badge player">{{ playerTotal }}</div>

              <div class="hand-total" :title="`Player Hand (${playerHandCount})`">
                <v-icon class="icon hand-count-icon" name="oi-stack" />
                {{ playerHandCount }}
              </div>
              <button
                :aria-label="`Player Discard Pile (${playerDiscardPile.length})`"
                class="discard-pile-btn"
                :class="{ disabled: playerDiscardPileDisabled }"
                :disabled="playerDiscardPileDisabled"
                :tabindex="boardDisabled || playerDiscardPileDisabled ? '-1' : '6'"
                :title="`Player Discard Pile (${playerDiscardPile.length})`"
                type="button"
                @click="playerDiscardPileDisabled ? null : discardPileClick(true)"
                @keyup.enter="playerDiscardPileDisabled ? null : discardPileClick(true)"
                @keyup.space="playerDiscardPileDisabled ? null : discardPileClick(true)"
              >
                <v-icon class="icon discard-icon" name="fa-skull-crossbones" />
                <span class="discard-count">{{ playerDiscardPile.length }}</span>
              </button>
            </div>
          </div>

          <SmallCard
            v-if="recentSpecialCard"
            :ability-icon="recentSpecialCard.abilityIcon"
            :active="recentSpecialCard.active"
            :animation-name="recentSpecialCard.animationName"
            :appear-animation="recentSpecialCard.appearAnimation"
            :desktop="props.desktop"
            disabled
            :effect-icon="recentSpecialCard.effectIcon"
            :hero="recentSpecialCard.hero"
            :image-url="recentSpecialCard.imageUrl"
            :name="recentSpecialCard.name"
            :tabindex="boardDisabled ? '-1' : '5'"
            :type-icon="recentSpecialCard.typeIcon"
          />
          <SmallCard v-else :desktop="props.desktop" disabled />

          <div class="opponent-details">
            <div class="avatar">
              <v-icon
                v-if="opponentIsPassed"
                animation="float"
                class="icon pass-icon"
                name="fa-flag"
              />
              <div
                v-if="opponentLeader"
                class="flag"
                :class="{ active: !isPlayerTurn }"
                :style="{ backgroundImage: `url(${opponentFlagUrl})` }"
                :title="
                  opponentLeader.faction.charAt(0).toUpperCase() + opponentLeader.faction.slice(1)
                "
              >
                <v-icon
                  v-if="!isPlayerTurn"
                  animation="float"
                  class="icon turn-icon"
                  name="fa-map-marker"
                  speed="fast"
                />
              </div>

              <div class="avatar-details">
                <h2 class="title">Opponent</h2>
                <div class="round-counter">
                  <v-icon v-if="opponentHasRound" class="icon round-icon" name="oi-star-fill" />
                  <v-icon v-else class="icon round-icon-placeholder" name="oi-star" />
                  <v-icon class="icon round-icon-placeholder" name="oi-star" />
                </div>
              </div>
            </div>
            <div class="stats">
              <div class="board-score-badge opponent">{{ opponentTotal }}</div>

              <div class="hand-total" :title="`Opponent Hand (${opponentHandCount})`">
                <v-icon class="icon hand-count-icon" name="oi-stack" />
                {{ opponentHandCount }}
              </div>
              <button
                :aria-label="`Opponent Discard Pile (${opponentDiscardPile.length})`"
                class="discard-pile-btn"
                :class="{ disabled: opponentDiscardPileDisabled }"
                :disabled="opponentDiscardPileDisabled"
                :tabindex="boardDisabled || opponentDiscardPileDisabled ? '-1' : '6'"
                :title="`Opponent Discard Pile (${opponentDiscardPile.length})`"
                type="button"
                @click="opponentDiscardPileDisabled ? null : discardPileClick()"
                @keyup.enter="opponentDiscardPileDisabled ? null : discardPileClick()"
                @keyup.space="opponentDiscardPileDisabled ? null : discardPileClick()"
              >
                <v-icon class="icon discard-icon" name="fa-skull-crossbones" />
                <span class="discard-count">{{ opponentDiscardPile.length }}</span>
              </button>
            </div>
          </div>
        </div>

        <div
          v-for="(rowFlag, i) in playerRowFlags"
          class="card-row player-row"
          :class="[
            `card-row${i + 1}`,
            { 'row-select': rowFlag.rowSelect },
            { highlight: rowFlag.highlight }
          ]"
          :key="`player-row-${i}`"
          @click="rowFlag.rowSelect ? rowClick(i) : null"
        >
          <v-icon
            v-if="rowFlag.rowSelect"
            animation="pulse"
            class="icon row-select-icon"
            name="md-touchapp-round"
          />

          <div class="card-row-wrap">
            <div class="row-stats">
              <div class="board-score-badge player">{{ rowTotals.player[i] }}</div>
              <div v-if="rowFlag.double" class="ability-badge">
                <v-icon class="icon ability-icon" :name="rowFlag.doubleIcon" />
              </div>
              <div v-if="rowFlag.weather" class="ability-badge">
                <v-icon class="icon ability-icon" :name="rowFlag.weatherIcon" />
              </div>
            </div>

            <div class="card-container">
              <SmallCard
                v-for="(card, j) in playerBoardCards[i]"
                :ability-icon="card.abilityIcon"
                :active="card.active"
                :animation-name="card.animationName"
                :appear-animation="card.appearAnimation"
                :bitten="card.bitten"
                :default-value="card.defaultValue"
                :desktop="props.desktop"
                :disabled="boardDisabled"
                :effect-icon="card.effectIcon"
                :hero="card.hero"
                :image-url="card.imageUrl"
                :key="j"
                overlap
                :name="card.name"
                role="button"
                :tabindex="boardDisabled ? '-1' : '3'"
                :type-icon="card.typeIcon"
                :value="card.value"
                :value-increased="card.valueIncreased"
                @card-click="boardCardClick(j, i, true)"
                @card-enter="boardCardClick(j, i, true)"
                @card-space="boardCardClick(j, i, true)"
              />
            </div>
          </div>
        </div>

        <div
          class="card-row player-hand"
          :class="{ active: playerHandIsActive || cardRedrawActive }"
        >
          <SmallCard
            v-for="(card, i) in playerHand"
            :ability-icon="card.abilityIcon"
            :active="card.active"
            :bitten="card.bitten"
            :class="{ active: playerHandIsActive && i === slideIndex }"
            :default-value="card.defaultValue"
            :desktop="props.desktop"
            :disabled="playerHandDisabled"
            :hero="card.hero"
            :image-url="card.imageUrl"
            :key="i"
            :name="card.name"
            overlap
            role="button"
            :tabindex="playerHandDisabled ? '-1' : '1'"
            :type-icon="card.typeIcon"
            :value="card.value"
            @card-click="handCardClick(i)"
            @card-enter="handCardClick(i)"
            @card-space="handCardClick(i)"
          />
        </div>
      </div>
    </div>

    <button
      class="pause-menu-btn"
      :class="{ disabled: boardDisabled && playerHandDisabled && cardModalDisabled }"
      :disabled="boardDisabled && playerHandDisabled && cardModalDisabled"
      type="button"
      @click="showPauseModal"
    >
      <v-icon class="icon" name="la-cog-solid" />
    </button>

    <BeanPopup v-model="beanPopup" :desktop="props.desktop"></BeanPopup>
  </div>
</template>
