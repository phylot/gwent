<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { type Card, type CardCollection } from '@/types'
import CardCarousel from './../components/CardCarousel.vue'
import CardModal from './../components/CardModal.vue'
import SmallCard from '../components/SmallCard.vue'

const props = defineProps<{
  cardCollection: CardCollection
  desktop: boolean
  leaderCards: Card
  preMatch: boolean
}>()

let localCardCollection = ref()
let factionKeys = ref(Object.keys(props.cardCollection))
let factionIndex = ref(0)
let activeCardRow = ref<Card[]>([])
let activeDeckRowKey = ref()
let activeCollectionRowKey = ref()
let slideIndex = ref(0)
let cardModal = ref(false)
let cardModalTitle = ref()
let cardModalConfirmText = ref()
let cardModalDisabled = ref(true)
let resolveCardModal = ref()
let deckManagerDisabled = ref(false)
let deckContainer: HTMLElement | null = null
let collectionContainer: HTMLElement | null = null

interface ManageCardCollection {
  [key: string]: Card[]
}

interface FactionAndCollection {
  faction: string
  collection: CardCollection
}

const deckCards = computed((): ManageCardCollection => {
  let cards: ManageCardCollection = {
    close: [],
    ranged: [],
    siege: [],
    special: []
  }

  if (localCardCollection.value) {
    localCardCollection.value[factionKeys.value[factionIndex.value]].deck.forEach((card: Card) => {
      cards[card.type].push(card)
    })
  }
  return cards
})

const collectionCards = computed((): ManageCardCollection => {
  let cards: ManageCardCollection = {
    close: [],
    ranged: [],
    siege: [],
    special: []
  }

  if (localCardCollection.value) {
    localCardCollection.value[factionKeys.value[factionIndex.value]].collection.forEach(
      (card: Card) => {
        cards[card.type].push(card)
      }
    )
  }
  return cards
})

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'cancel'): void
  (e: 'faction-selected', val: FactionAndCollection): void
  (e: 'save', val: CardCollection): void
}>()

onMounted(() => {
  localCardCollection.value = JSON.parse(JSON.stringify(props.cardCollection))

  // Sort all cards by 'id'
  for (const faction in localCardCollection.value) {
    localCardCollection.value[faction].collection.sort(sortCardsById)
    localCardCollection.value[faction].deck.sort(sortCardsById)
  }

  deckContainer = document.querySelector('.deck-manager-deck')
  collectionContainer = document.querySelector('.deck-manager-collection')
})

function changeFaction(index: number) {
  if (index < 0) {
    factionIndex.value = factionKeys.value.length - 1
  } else if (index > factionKeys.value.length - 1) {
    factionIndex.value = 0
  } else {
    factionIndex.value = index
  }
  // Scroll both deck and collection containers to top
  if (deckContainer && collectionContainer) {
    deckContainer.scrollTop = 0
    collectionContainer.scrollTop = 0
  }
}

function deckCardClick(card: Card, key: string | number, index: number) {
  slideIndex.value = index
  activeCardRow.value = deckCards.value[key]
  activeDeckRowKey.value = key

  showCardModal('Remove', `${capitaliseString(String(key))} Combat`).then((ok) => {
    cardModalDisabled.value = true
    if (ok) {
      moveCardToCollection(card, () => {
        closeCardModal()
      })
    } else {
      closeCardModal()
    }
  })
}

function collectionCardClick(card: Card, key: string | number, index: number) {
  slideIndex.value = index
  activeCardRow.value = collectionCards.value[key]
  activeCollectionRowKey.value = key

  showCardModal('Add', `${capitaliseString(String(key))} Combat`).then((ok) => {
    if (ok) {
      moveCardToDeck(card, () => {
        closeCardModal()
      })
    } else {
      closeCardModal()
    }
  })
}

function showCardModal(confirmText?: string, titleText?: string) {
  deckManagerDisabled.value = true

  return new Promise((resolve) => {
    cardModalConfirmText.value = confirmText
    cardModalTitle.value = titleText
    resolveCardModal.value = resolve
    cardModalDisabled.value = false
    cardModal.value = true
  })
}

function closeCardModal() {
  cardModalDisabled.value = true
  activeDeckRowKey.value = null
  activeCollectionRowKey.value = null
  cardModal.value = false
  deckManagerDisabled.value = false
}

function moveCardToDeck(card: Card, callback: Function) {
  const selectedCard = localCardCollection.value[
    factionKeys.value[factionIndex.value]
  ].collection.find((element: Card) => element.id === card.id)
  const selectedCardIndex = localCardCollection.value[
    factionKeys.value[factionIndex.value]
  ].collection.findIndex((element: Card) => element.id === card.id)

  // Push selected card to card collection
  localCardCollection.value[factionKeys.value[factionIndex.value]].deck.push(selectedCard)
  localCardCollection.value[factionKeys.value[factionIndex.value]].collection.splice(
    selectedCardIndex,
    1
  )

  // Re-sort card collection
  localCardCollection.value[factionKeys.value[factionIndex.value]].collection.sort(sortCardsById)
  localCardCollection.value[factionKeys.value[factionIndex.value]].deck.sort(sortCardsById)

  callback()
}

function moveCardToCollection(card: Card, callback: Function) {
  const selectedCard = localCardCollection.value[factionKeys.value[factionIndex.value]].deck.find(
    (element: Card) => element.id === card.id
  )
  const selectedCardIndex = localCardCollection.value[
    factionKeys.value[factionIndex.value]
  ].deck.findIndex((element: Card) => element.id === card.id)

  // Push selected card to card collection
  localCardCollection.value[factionKeys.value[factionIndex.value]].collection.push(selectedCard)
  localCardCollection.value[factionKeys.value[factionIndex.value]].deck.splice(selectedCardIndex, 1)

  // Re-sort card collection
  localCardCollection.value[factionKeys.value[factionIndex.value]].collection.sort(sortCardsById)
  localCardCollection.value[factionKeys.value[factionIndex.value]].deck.sort(sortCardsById)

  callback()
}

function save() {
  emit('save', localCardCollection.value)
}

function factionSelected() {
  emit('faction-selected', {
    faction: factionKeys.value[factionIndex.value],
    collection: localCardCollection.value
  })
}

function sortCardsById(a: Card, b: Card) {
  return (Number(a.id) || 0) - (Number(b.id) || 0)
}

function capitaliseString(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
</script>

<template>
  <div class="deck-manager">
    <div class="deck-manager-container">
      <CardModal v-model="cardModal" class="quick-fade">
        <h2 v-if="cardModalTitle">{{ cardModalTitle }}</h2>

        <CardCarousel
          v-model="slideIndex"
          :cards="activeCardRow"
          :desktop="props.desktop"
          :disabled="cardModalDisabled"
        ></CardCarousel>

        <button
          class="btn large primary"
          :disabled="cardModalDisabled"
          tabindex="2"
          type="button"
          @click="resolveCardModal(true)"
          @keyup.enter="resolveCardModal(true)"
          @keyup.space="resolveCardModal(true)"
        >
          {{ cardModalConfirmText }}
        </button>
        <button
          class="btn large"
          :disabled="cardModalDisabled"
          tabindex="2"
          type="button"
          @click="resolveCardModal(false)"
          @keyup.enter="resolveCardModal(false)"
          @keyup.space="resolveCardModal(false)"
        >
          Close
        </button>
      </CardModal>

      <div class="deck-manager-heading">
        <button
          class="btn"
          :disabled="deckManagerDisabled"
          @click="changeFaction(factionIndex - 1)"
        >
          Prev
        </button>
        <h1>{{ capitaliseString(factionKeys[factionIndex]) }}</h1>
        <button
          class="btn"
          :disabled="deckManagerDisabled"
          @click="changeFaction(factionIndex + 1)"
        >
          Next
        </button>
      </div>

      <div class="deck-manager-deck">
        <h2 v-if="localCardCollection">
          Deck ({{ localCardCollection[factionKeys[factionIndex]].deck.length }})
        </h2>

        <template v-for="(cardArr, key) in deckCards" :key="key">
          <template v-if="cardArr.length > 0">
            <h3>
              {{ capitaliseString(String(key)) }} {{ key === 'special' ? 'Cards' : 'Combat' }}
            </h3>

            <div class="deck-manager-card-row">
              <SmallCard
                v-for="(card, i) in cardArr"
                :ability-icon="card.abilityIcon"
                :active="card.active"
                :animation-name="card.animationName"
                :class="{ active: key === activeDeckRowKey && i === slideIndex }"
                :default-value="card.defaultValue"
                :desktop="props.desktop"
                :disabled="deckManagerDisabled"
                :faction="card.faction"
                :hero="card.hero"
                :image-url="card.imageUrl"
                :key="i"
                role="button"
                tabindex="0"
                :type-icon="card.typeIcon"
                :value="card.value"
                @smallcard-click="deckCardClick(card, key, i)"
                @smallcard-enter="deckCardClick(card, key, i)"
                @smallcard-space="deckCardClick(card, key, i)"
              />
            </div>
          </template>
        </template>
      </div>

      <div class="deck-manager-stats"></div>

      <div class="deck-manager-collection">
        <h2 v-if="localCardCollection">
          Card Collection ({{ localCardCollection[factionKeys[factionIndex]].collection.length }})
        </h2>

        <template v-for="(cardArr, key) in collectionCards" :key="key">
          <template v-if="cardArr.length > 0">
            <h3>
              {{ capitaliseString(String(key)) }} {{ key === 'special' ? 'Cards' : 'Combat' }}
            </h3>

            <div class="deck-manager-card-row">
              <SmallCard
                v-for="(card, i) in cardArr"
                :ability-icon="card.abilityIcon"
                :active="card.active"
                :animation-name="card.animationName"
                :class="{ active: key === activeCollectionRowKey && i === slideIndex }"
                :default-value="card.defaultValue"
                :desktop="props.desktop"
                :disabled="deckManagerDisabled"
                :faction="card.faction"
                :hero="card.hero"
                :image-url="card.imageUrl"
                :key="i"
                role="button"
                tabindex="0"
                :type-icon="card.typeIcon"
                :value="card.value"
                @smallcard-click="collectionCardClick(card, key, i)"
                @smallcard-enter="collectionCardClick(card, key, i)"
                @smallcard-space="collectionCardClick(card, key, i)"
              />
            </div>
          </template>
        </template>
      </div>

      <div class="btn-container">
        <template v-if="preMatch">
          <button
            class="btn primary large"
            :disabled="deckManagerDisabled"
            @click="factionSelected"
          >
            Select
          </button>
          <button class="btn large" :disabled="deckManagerDisabled" @click="emit('back')">
            Back
          </button>
        </template>

        <template v-else>
          <button class="btn primary large" :disabled="deckManagerDisabled" @click="save">
            Save
          </button>
          <button class="btn large" :disabled="deckManagerDisabled" @click="emit('cancel')">
            Cancel
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
.deck-manager {
  width: 100%;
  height: 100%;
  min-width: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: scroll;
  color: #ffffff;
}

.deck-manager .deck-manager-container {
  position: relative;
  width: 90%;
  min-width: 320px;
  margin: auto;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  background-color: #242424;
}

.deck-manager .deck-manager-heading {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.deck-manager .deck-manager-heading h1 {
  width: 130px;
  text-align: center;
}

.deck-manager .deck-manager-deck,
.deck-manager .deck-manager-collection {
  height: 160px;
  padding: 10px 0 10px 10px;
  overflow-y: scroll;
  border-top: 1px solid #353535;
  border-bottom: 1px solid #686868;
  background: linear-gradient(#000000, #373738);
}

.deck-manager .deck-manager-deck h2,
.deck-manager .deck-manager-collection h2 {
  padding-bottom: 10px;
  text-align: center;
}

.deck-manager .deck-manager-card-row {
  margin: 10px 0;
  display: flex;
  flex-wrap: wrap;
}

.deck-manager .deck-manager-stats {
  height: 50px;
}

.deck-manager .deck-manager-deck::-webkit-scrollbar,
.deck-manager .deck-manager-collection::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 7px;
}

.deck-manager .deck-manager-deck::-webkit-scrollbar-thumb,
.deck-manager .deck-manager-collection::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.5);
  -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
}

.deck-manager .deck-manager-deck .small-card,
.deck-manager .deck-manager-collection .small-card {
  margin-right: 10px;
  margin-bottom: 10px;
}

.deck-manager .btn-container {
  padding: 10px;
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
}

/* Desktop Styles */

@media (min-width: 1200px) and (min-height: 880px) and (orientation: landscape) {
  .deck-manager-container {
    width: 80%;
    max-width: 1600px;
  }
}

/* Desktop / Tablet Styles */

@media (min-height: 880px) and (orientation: landscape),
  (min-width: 768px) and (min-height: 1024px) and (orientation: portrait) {
  .deck-manager .deck-manager-heading h1 {
    width: 250px;
  }

  .deck-manager .deck-manager-deck,
  .deck-manager .deck-manager-collection {
    height: 350px;
  }
}
</style>
