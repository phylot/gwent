<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
// import { RouterLink, RouterView } from 'vue-router'
import confetti from 'canvas-confetti'
import { Howl } from 'howler'
import { type Card, type CardCollection } from '@/types'
import DeckManagerView from './views/DeckManagerView.vue'
import GameBoardView from './views/GameBoardView.vue'
import MainMenuView from './views/MainMenuView.vue'
import AwardBadge from './components/AwardBadge.vue'
import CardUnlockModal from './components/CardUnlockModal.vue'
import StandardModal from './components/StandardModal.vue'
import { defaultCards, defaultLeaderCards, unlockableCards } from './data/cards'
import { defaultAwards } from './data/awards'

// GLOBAL DATA

let cpuDifficulty = 0.3
let gameIsActive = ref(false)
let gameBoardDisabled = ref(false)
let mainMenuIsActive = ref(false)
let mainMenuDisabled = ref(false)
let deckManagerIsActive = ref(false)
let deckManagerIsPreMatch = ref(false)
let isDesktop = ref(false)
let loading = ref(true)
let showContinueBtn = ref(false)
let titleSequenceHasPlayed = ref(false)
let playerCardCollection = JSON.parse(JSON.stringify(defaultCards))
let playerLeaderCards = JSON.parse(JSON.stringify(defaultLeaderCards))
let opponentCardCollection = JSON.parse(JSON.stringify(defaultCards))
let opponentLeaderCards = JSON.parse(JSON.stringify(defaultLeaderCards))
let selectedPlayerDeck: Card[] = []
let selectedPlayerLeader: Card
let selectedOpponentDeck: Card[] = []
let selectedOpponentLeader: Card
let playerAwards = ref(JSON.parse(JSON.stringify(defaultAwards)))
let awardsModal = ref()
let playerWins: number = 0
let unlockedCard = ref<Card>()
let cardUnlockModal = ref()
let allCardsUnlocked = ref(false)
let themeSongSound: Howl
let themeSongFadeTimeout: ReturnType<typeof setTimeout>
let gwentSong: Howl
let coinSound: Howl
let roundStartSound: Howl
let turnSound: Howl
let selectCardSound: Howl
let swapCardSound: Howl
let drawCardSound: Howl
let playCardSound: Howl
let placeCardSound: Howl
let roundWinSound: Howl
let roundLoseSound: Howl
let roundDrawSound: Howl
let matchWinSound: Howl
let matchLoseSound: Howl
let matchDrawSound: Howl
let doubleSound: Howl
let heroSound: Howl
let musterSound: Howl
let scorchSound: Howl
let statIncreaseSound: Howl
let zeldaSound: Howl

// COMPUTED DATA

const awardsCount = computed((): number => {
  let count = 0
  for (const awardKey in playerAwards.value) {
    if (playerAwards.value[awardKey].active) {
      count++
    }
  }
  return count
})

interface FactionAndCollection {
  faction: string
  collection: CardCollection
}

// GLOBAL HOOKS

onMounted(() => {
  loading.value = true
  onResize()
  window.addEventListener('resize', onResize)
  preload()
})

// GLOBAL METHODS

function onResize() {
  let width = window.innerWidth
  let height = window.innerHeight
  let isLandscape = width > height

  isDesktop.value =
    (height >= 880 && isLandscape) || (width >= 768 && height >= 1024 && !isLandscape)
}

async function preload() {
  await preloadSounds()
  await loadLocalStorage()

  // Preload card collections
  for (const faction in playerCardCollection) {
    for (const key in playerCardCollection[faction]) {
      playerCardCollection[faction][key] = await preloadCards(playerCardCollection[faction][key])
    }
  }
  for (const faction in opponentCardCollection) {
    for (const key in opponentCardCollection[faction]) {
      opponentCardCollection[faction][key] = await preloadCards(
        opponentCardCollection[faction][key]
      )
    }
  }

  // Preload leader cards
  for (const faction in playerLeaderCards) {
    playerLeaderCards[faction].collection = await preloadCards(
      playerLeaderCards[faction].collection
    )
    playerLeaderCards[faction].selected = await preloadCards([playerLeaderCards[faction].selected])
    playerLeaderCards[faction].selected = playerLeaderCards[faction].selected[0]
  }
  for (const faction in opponentLeaderCards) {
    opponentLeaderCards[faction].collection = await preloadCards(
      opponentLeaderCards[faction].collection
    )
    opponentLeaderCards[faction].selected = await preloadCards([
      opponentLeaderCards[faction].selected
    ])
    opponentLeaderCards[faction].selected = opponentLeaderCards[faction].selected[0]
  }

  // Preload faction flag images
  await loadImage(new URL(`./assets/images/british-flag.png`, import.meta.url).href)
  await loadImage(new URL(`./assets/images/french-flag.png`, import.meta.url).href)

  // Preload title screen background image
  await loadImage(new URL(`./assets/images/main-menu-bg.jpg`, import.meta.url).href)
  showContinueBtn.value = true
}

async function preloadSounds() {
  try {
    const [
      themeSong,
      coin,
      roundStart,
      turn,
      selectCard,
      swapCard,
      drawCard,
      playCard,
      placeCard,
      roundWin,
      roundLose,
      roundDraw,
      matchWin,
      matchLose,
      matchDraw,
      double,
      hero,
      muster,
      scorch,
      statIncrease,
      zelda
    ] = await Promise.all([
      createHowl('sharpe-theme.ogg', 1),
      createHowl('coin.wav', 5),
      createHowl('round-start.wav', 1),
      createHowl('turn.wav', 2.5),
      createHowl('select-card.mp3', 0.2),
      createHowl('swap-card.wav', 2),
      createHowl('draw-card.wav', 1),
      createHowl('play-card.wav', 1),
      createHowl('place-card.wav', 1),
      createHowl('round-win.wav', 1),
      createHowl('round-lose.wav', 1),
      createHowl('round-draw.wav', 1),
      createHowl('match-win.mp3', 1),
      createHowl('match-lose.wav', 1),
      createHowl('match-draw.wav', 1),
      createHowl('double.wav', 1.5),
      createHowl('hero.wav', 1),
      createHowl('muster.wav', 2),
      createHowl('scorch.wav', 1),
      createHowl('stat-increase.wav', 0.5),
      createHowl('zelda-secret.mp3', 4),
      preloadGameMusic()
    ])

    themeSongSound = themeSong
    coinSound = coin
    roundStartSound = roundStart
    turnSound = turn
    selectCardSound = selectCard
    swapCardSound = swapCard
    drawCardSound = drawCard
    playCardSound = playCard
    placeCardSound = placeCard
    roundWinSound = roundWin
    roundLoseSound = roundLose
    roundDrawSound = roundDraw
    matchWinSound = matchWin
    matchLoseSound = matchLose
    matchDrawSound = matchDraw
    doubleSound = double
    heroSound = hero
    musterSound = muster
    scorchSound = scorch
    statIncreaseSound = statIncrease
    zeldaSound = zelda
  } catch {
    console.error('Error preloading sounds')
  }
}

function createHowl(fileName: string, volume: number) {
  return new Promise<Howl>((resolve, reject) => {
    const newSound = new Howl({
      src: [new URL(`./assets/audio/${fileName}`, import.meta.url).href],
      volume: volume,
      preload: true,
      onload: () => {
        resolve(newSound)
      },
      onloaderror: () => {
        console.error('Failed to load sound: ', fileName)
        reject()
      }
    })
  })
}

// TODO: Expand into music player
function preloadGameMusic() {
  return new Promise<void>((resolve) => {
    gwentSong = new Howl({
      src: [new URL(`./assets/audio/astoryyouwontbelieve.mp3`, import.meta.url).href],
      loop: true,
      volume: 1,
      onload: () => {
        resolve()
      },
      onloaderror: () => {
        console.error('Failed to load game music')
        resolve()
      }
    })
  })
}

function playSound(name: string) {
  switch (name) {
    case 'coin':
      coinSound.play()
      break
    case 'roundstart':
      roundStartSound.play()
      break
    case 'turn':
      turnSound.play()
      break
    case 'selectcard':
      selectCardSound.play()
      break
    case 'swapcard':
      swapCardSound.play()
      break
    case 'drawcard':
      drawCardSound.play()
      break
    case 'playcard':
      playCardSound.play()
      break
    case 'placecard':
      placeCardSound.play()
      break
    case 'roundwin':
      roundWinSound.play()
      break
    case 'roundlose':
      roundLoseSound.play()
      break
    case 'rounddraw':
      roundDrawSound.play()
      break
    case 'matchwin':
      matchWinSound.play()
      break
    case 'matchlose':
      matchLoseSound.play()
      break
    case 'matchdraw':
      matchDrawSound.play()
      break
    case 'double':
      doubleSound.play()
      break
    case 'hero':
      heroSound.play()
      break
    case 'muster':
      musterSound.play()
      break
    case 'scorch':
      scorchSound.play()
      break
    case 'statincrease':
      statIncreaseSound.play()
      break
    default:
      console.error('Unknown sound: ', name)
  }
}

function loadLocalStorage() {
  return new Promise<void>((resolve) => {
    // Read card collections from localStorage
    let retrievedPlayerCards: string | null = localStorage.getItem('playerCards')
    if (retrievedPlayerCards) {
      playerCardCollection = JSON.parse(retrievedPlayerCards)
    }
    let retrievedPlayerLeaderCards: string | null = localStorage.getItem('playerLeaderCards')
    if (retrievedPlayerLeaderCards) {
      playerLeaderCards = JSON.parse(retrievedPlayerLeaderCards)
    }
    let retrievedOpponentCards: string | null = localStorage.getItem('opponentCards')
    if (retrievedOpponentCards) {
      opponentCardCollection = JSON.parse(retrievedOpponentCards)
    }
    let retrievedOpponentLeaderCards: string | null = localStorage.getItem('opponentLeaderCards')
    if (retrievedOpponentLeaderCards) {
      opponentLeaderCards = JSON.parse(retrievedOpponentLeaderCards)
    }

    // Read awards from localStorage
    let retrievedAwards: string | null = localStorage.getItem('awards')
    if (retrievedAwards) {
      playerAwards.value = JSON.parse(retrievedAwards)
    }

    // Read total player wins from localStorage
    let retrievedWins: string | null = localStorage.getItem('playerWins')
    if (retrievedWins) {
      playerWins = JSON.parse(retrievedWins)
    }

    // Read all cards unlocked flag from localStorage
    let retrievedAllCardsBool: string | null = localStorage.getItem('allCardsUnlocked')
    if (retrievedAllCardsBool) {
      allCardsUnlocked.value = JSON.parse(retrievedAllCardsBool)
    }

    resolve()
  })
}

async function preloadCards(cards: Card[]) {
  let imageCount = cards?.length || 0
  let imagesLoaded = 0

  if (imageCount > 0) {
    for (let i = 0; i < imageCount; i++) {
      cards[i].imageUrl = new URL(`./assets/images/${cards[i].image}`, import.meta.url).href
      await loadImage(cards[i].imageUrl!)
      imagesLoaded++
      if (imagesLoaded == imageCount) {
        return cards
      }
    }
  } else {
    return cards
  }
}

function loadImage(imageUrl: string) {
  return new Promise<void>((resolve) => {
    let img = new Image()
    img.onload = () => {
      resolve()
    }
    img.onerror = (err) => {
      console.error('Failed to load image: ', imageUrl, err)
      resolve()
    }
    img.src = imageUrl
  })
}

function showMainMenu() {
  loading.value = false
  showContinueBtn.value = false
  gameIsActive.value = false

  gwentSong.fade(gwentSong.volume(), 0, 2000)

  clearTimeout(themeSongFadeTimeout)
  themeSongSound.stop()
  themeSongSound.volume(1)
  themeSongSound.play()

  setTimeout(
    () => {
      mainMenuIsActive.value = true

      themeSongFadeTimeout = setTimeout(() => {
        if (!gameIsActive.value) {
          themeSongSound.fade(themeSongSound.volume(), 0, 12000)
        }
      }, 48000)
    },
    titleSequenceHasPlayed.value ? 0 : 1500
  )
}

function showDeckManager(preMatch: boolean) {
  mainMenuIsActive.value = false
  gameIsActive.value = false
  deckManagerIsPreMatch.value = preMatch
  clearTimeout(themeSongFadeTimeout)
  themeSongSound.fade(themeSongSound.volume(), 0, 4000)
  gwentSong.fade(gwentSong.volume(), 0, 4000)

  // Timeout to allow main menu to fade out
  setTimeout(() => {
    deckManagerIsActive.value = true
  }, 1000)
}

function cancelDeckManager() {
  deckManagerIsActive.value = false

  // Timeout to allow theme song to fade out
  setTimeout(() => {
    showMainMenu()
  }, 1200)
}

function deckManagerSave(collection: CardCollection) {
  playerCardCollection = collection
  deckManagerIsActive.value = false
  themeSongSound.fade(themeSongSound.volume(), 0, 1200)

  saveCardsToStorage(() => {
    // Timeout to allow theme song to fade out
    setTimeout(() => {
      showMainMenu()
    }, 1200)
  })
}

function showAwards() {
  mainMenuDisabled.value = true
  awardsModal.value.show().then(() => {
    mainMenuDisabled.value = false
  })
}

function play() {
  doubleSound.play()
  clearTimeout(themeSongFadeTimeout)
  mainMenuIsActive.value = false

  // Timeout to allow Main Menu to fade out
  setTimeout(() => {
    showDeckManager(true)
  }, 1000)
}

function setupGameAndStart(deckSelection: FactionAndCollection) {
  let opponentFaction: string = deckSelection.faction === 'british' ? 'french' : 'british'
  loading.value = true
  deckManagerIsActive.value = false
  playerCardCollection = deckSelection.collection

  gwentSong.stop()
  gwentSong.volume(1)
  gwentSong.play()

  saveCardsToStorage(() => {
    // Set decks and leaders based on player's faction choice
    selectedPlayerDeck = playerCardCollection[deckSelection.faction].deck
    selectedPlayerLeader = playerLeaderCards[deckSelection.faction].selected

    selectedOpponentDeck = opponentCardCollection[opponentFaction].deck
    selectedOpponentLeader = opponentLeaderCards[opponentFaction].selected

    // Timeout to allow loader to fade in
    setTimeout(() => {
      gameIsActive.value = true
    }, 200)
  })
}

function skip() {
  themeSongSound.stop()
  themeSongSound.seek(18)
  themeSongSound.play()
}

function saveCardsToStorage(callback?: Function) {
  localStorage.setItem('playerCards', JSON.stringify(playerCardCollection))
  localStorage.setItem('playerLeaderCards', JSON.stringify(playerLeaderCards))
  localStorage.setItem('opponentCards', JSON.stringify(opponentCardCollection))
  localStorage.setItem('opponentLeaderCards', JSON.stringify(opponentLeaderCards))

  if (callback) {
    callback()
  }
}

function saveAwardsToStorage(awardKeys: string[]) {
  for (const awardKey of awardKeys) {
    playerAwards.value[awardKey].active = true
  }
  localStorage.setItem('awards', JSON.stringify(playerAwards.value))
}

function loadingChange(val: boolean) {
  loading.value = val
}

async function determineCardUnlock() {
  playerWins++
  localStorage.setItem('playerWins', JSON.stringify(playerWins))

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    zIndex: 9500
  })

  if (!allCardsUnlocked.value) {
    // If there's an unlockable card match...
    if (unlockableCards[playerWins]) {
      // Disable GameBoardView
      gameBoardDisabled.value = true

      let card = unlockableCards[playerWins]

      // Preload unlocked card
      let preloadedCard = await preloadCards([card])
      if (preloadedCard) {
        card = preloadedCard[0]
      }

      // Copy card to player's collection
      playerCardCollection[card.faction].collection.push(card)

      // Determine if a card should be removed from the opponent's deck
      for (let i = 0; i < opponentCardCollection[card.faction].deck.length; i++) {
        let opponentDeckCard = opponentCardCollection[card.faction].deck[i]

        // If there's a deck card with an 'id' that matches the unlocked card's 'replacedById', move the deck card to the collection
        if (opponentDeckCard.replacedById === card.id) {
          // Move replaced card from opponent's deck to their collection
          opponentCardCollection[card.faction].collection.push(opponentDeckCard)
          opponentCardCollection[card.faction].deck.splice(i, 1)
        }
      }

      // Add the unlocked card to opponent's deck
      opponentCardCollection[card.faction].deck.push(card)

      // Set global reactive unlocked card
      unlockedCard.value = card

      setTimeout(() => {
        cardUnlockModal.value.show().then((res: boolean) => {
          if (res) {
            showDeckManager(false)
          }
          gameBoardDisabled.value = false
        })
      }, 1000)

      // Determine if all cards are now unlocked
      const objKeysArr = Object.getOwnPropertyNames(unlockableCards)
      const finalKey = objKeysArr[objKeysArr.length - 1]

      if (playerWins === Number(finalKey)) {
        allCardsUnlocked.value = true
        localStorage.setItem('allCardsUnlocked', JSON.stringify(allCardsUnlocked.value))
        // Unlock 'Card Master' award
        saveAwardsToStorage(['cardmaster'])
      }

      // Save player / opponent card collections to localStorage
      saveCardsToStorage()
    }
  }
}

async function unlockAllCards() {
  // Move all cards that have a 'replacedById' from player / opponent 'deck' to 'collection'
  for (const factionKey in playerCardCollection) {
    for (let i = 0; i < playerCardCollection[factionKey].deck.length; i++) {
      const deckCard = playerCardCollection[factionKey].deck[i]

      if (deckCard.replacedById) {
        playerCardCollection[factionKey].collection.push(deckCard)
        playerCardCollection[factionKey].deck.splice(i, 1)
        i--
      }
    }
  }

  for (const factionKey in opponentCardCollection) {
    for (let i = 0; i < opponentCardCollection[factionKey].deck.length; i++) {
      const deckCard = opponentCardCollection[factionKey].deck[i]

      if (deckCard.replacedById) {
        opponentCardCollection[factionKey].collection.push(deckCard)
        opponentCardCollection[factionKey].deck.splice(i, 1)
        i--
      }
    }
  }

  // Copy unlockable cards to each player's collection or deck
  for (const key in unlockableCards) {
    // Only copy cards that haven't yet been unlocked
    if (Number(key) > playerWins) {
      let unlockedCard = unlockableCards[key]

      // Preload unlocked card
      let preloadedCard = await preloadCards([unlockedCard])
      if (preloadedCard) {
        unlockedCard = preloadedCard[0]
      }

      // If the unlocked card is usually replaced in the deck, move it straight to the card collection
      if (unlockedCard.replacedById) {
        playerCardCollection[unlockedCard.faction].collection.push(unlockedCard)
        opponentCardCollection[unlockedCard.faction].collection.push(unlockedCard)
      } else {
        playerCardCollection[unlockedCard.faction].deck.push(unlockedCard)
        opponentCardCollection[unlockedCard.faction].deck.push(unlockedCard)
      }
    }
  }

  saveCardsToStorage()

  // Unlock 'Card Master' award
  saveAwardsToStorage(['cardmaster'])

  // Flag all cards as unlocked
  allCardsUnlocked.value = true
  localStorage.setItem('allCardsUnlocked', JSON.stringify(allCardsUnlocked.value))

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  })

  // Zelda unlock sound effect
  zeldaSound.play()
}
</script>

<template>
  <transition name="fast-fade">
    <div v-if="loading" class="loader" role="alert">
      <template v-if="showContinueBtn">
        <div class="save-warning">
          <v-icon
            animation="pulse"
            class="icon"
            name="fa-regular-save"
            :scale="isDesktop ? 1.8 : 1.4"
            speed="fast"
          />WARNING: Your progress is saved to this device
        </div>

        <button class="btn large" @click="showMainMenu">Continue</button>
      </template>
      <template v-else
        ><v-icon
          animation="spin"
          class="icon"
          name="la-spinner-solid"
          :scale="isDesktop ? 1.8 : 1.4"
        />Loading</template
      >
    </div>
  </transition>

  <CardUnlockModal
    :card="unlockedCard"
    :desktop="isDesktop"
    ref="cardUnlockModal"
  ></CardUnlockModal>

  <StandardModal
    :buttons="['Close']"
    :desktop="isDesktop"
    no-primary
    ref="awardsModal"
    :title="`Awards (${awardsCount}/${Object.keys(playerAwards).length})`"
  >
    <div class="awards-gallery">
      <div class="awards-grid">
        <div v-for="(award, key) in playerAwards" class="award-container" :key="key">
          <AwardBadge
            :active="award.active"
            :desktop="isDesktop"
            :icon="award.icon"
            :name="award.name"
            :type="String(key)"
          ></AwardBadge>
          <p v-html="award.description" class="description"></p>
        </div>
      </div>
    </div>
  </StandardModal>

  <transition name="slow-fade">
    <MainMenuView
      v-if="mainMenuIsActive"
      :awards-count="awardsCount"
      :disabled="mainMenuDisabled"
      :disable-logo-click="allCardsUnlocked"
      :show-menu="titleSequenceHasPlayed"
      @loading-change="loadingChange"
      @awards="showAwards"
      @manage-deck="showDeckManager"
      @play="play"
      @play-sound="playSound"
      @skip="skip"
      @title-sequence-end="titleSequenceHasPlayed = true"
      @unlock-all-cards="unlockAllCards"
    ></MainMenuView>
  </transition>

  <transition name="fast-fade">
    <DeckManagerView
      v-if="deckManagerIsActive"
      :card-collection="playerCardCollection"
      :desktop="isDesktop"
      :leader-cards="playerLeaderCards"
      :pre-match="deckManagerIsPreMatch"
      @cancel="cancelDeckManager"
      @faction-selected="setupGameAndStart"
      @save="deckManagerSave"
    ></DeckManagerView>
  </transition>

  <transition name="fast-fade">
    <GameBoardView
      v-if="gameIsActive"
      :cpu-difficulty="cpuDifficulty"
      :desktop="isDesktop"
      :disabled="gameBoardDisabled"
      :opponent-cards="selectedOpponentDeck"
      :opponent-leader-card="selectedOpponentLeader"
      :player-cards="selectedPlayerDeck"
      :player-leader-card="selectedPlayerLeader"
      @loading-change="loadingChange"
      @player-win="determineCardUnlock"
      @play-sound="playSound"
      @save-awards="saveAwardsToStorage"
      @show-menu="showMainMenu"
    ></GameBoardView>
  </transition>
</template>
