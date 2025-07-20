<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { type Card, type CardCollection } from '@/types'
import CardCarousel from './../components/CardCarousel.vue'
import CardCarouselModal from '../components/CardCarouselModal.vue'
import SmallCard from '../components/SmallCard.vue'

const props = defineProps<{
  cardCollection: CardCollection
  desktop: boolean
  leaderCards: Card
  preMatch: boolean
}>()

let localCardCollection = ref()
let localLeaderCards = ref()
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
let drawerActive = ref(false)

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

const noDeckCards = computed((): boolean => {
  return (
    deckCards.value.close.length < 1 &&
    deckCards.value.ranged.length < 1 &&
    deckCards.value.siege.length < 1 &&
    deckCards.value.special.length < 1
  )
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

const noCollectionCards = computed((): boolean => {
  return (
    collectionCards.value.close.length < 1 &&
    collectionCards.value.ranged.length < 1 &&
    collectionCards.value.siege.length < 1 &&
    collectionCards.value.special.length < 1
  )
})

const totalDeckCards = computed((): number => {
  let total = 0

  if (localCardCollection.value) {
    total = localCardCollection.value[factionKeys.value[factionIndex.value]].deck.length
  }
  return total
})

const totalUnitCards = computed((): number => {
  let total = 0

  if (localCardCollection.value) {
    for (const card of localCardCollection.value[factionKeys.value[factionIndex.value]].deck) {
      if (card.value || card.value === 0) {
        total++
      }
    }
  }
  return total
})

const totalSpecialCards = computed((): number => {
  let total = 0

  if (localCardCollection.value) {
    for (const card of localCardCollection.value[factionKeys.value[factionIndex.value]].deck) {
      if (card.type === 'special') {
        total++
      }
    }
  }
  return total
})

const totalUnitStrength = computed((): number => {
  let total = 0

  if (localCardCollection.value) {
    for (const card of localCardCollection.value[factionKeys.value[factionIndex.value]].deck) {
      if (card.value) {
        total = total + card.value
      }
    }
  }
  return total
})

const invalidUnitTotal = computed((): boolean => {
  return totalUnitCards.value < 22
})

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'faction-selected', val: FactionAndCollection): void
  (e: 'save', val: CardCollection): void
}>()

onMounted(() => {
  localCardCollection.value = JSON.parse(JSON.stringify(props.cardCollection))
  localLeaderCards.value = JSON.parse(JSON.stringify(props.leaderCards))

  // Sort all cards by 'id'
  for (const faction in localCardCollection.value) {
    localCardCollection.value[faction].collection.sort(sortCardsById)
    localCardCollection.value[faction].deck.sort(sortCardsById)
  }

  deckContainer = document.querySelector('.deck-cards')
  collectionContainer = document.querySelector('.collection-drawer-cards')
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

  showCardModal(
    'Remove',
    `${capitaliseString(String(key))} ${key === 'special' ? 'Cards' : 'Combat'}`
  ).then((ok) => {
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

  showCardModal(
    'Add',
    `${capitaliseString(String(key))} ${key === 'special' ? 'Cards' : 'Combat'}`
  ).then((ok) => {
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
      <CardCarouselModal v-model="cardModal" class="quick-fade">
        <template v-slot:header>
          <div class="type card-stat-badge">
            <v-icon
              :name="activeCardRow[0].typeIcon || 'la-star-of-life-solid'"
              class="icon"
              :scale="desktop ? 1.5 : 0.8"
            />
          </div>
          <h2 v-if="cardModalTitle">{{ cardModalTitle }}</h2>
        </template>

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
        >
          {{ cardModalConfirmText }}
        </button>
        <button
          class="btn large"
          :disabled="cardModalDisabled"
          tabindex="2"
          type="button"
          @click="resolveCardModal(false)"
        >
          Close
        </button>
      </CardCarouselModal>

      <div class="deck-manager-header">
        <div class="header-container">
          <button
            aria-label="Previous"
            class="prev-btn"
            :class="{ disabled: invalidUnitTotal }"
            :disabled="deckManagerDisabled || invalidUnitTotal"
            @click="changeFaction(factionIndex - 1)"
          >
            <v-icon class="icon" name="fa-chevron-circle-left" role="button" />
          </button>

          <div class="heading">
            <div
              v-if="localCardCollection"
              class="flag-icon"
              :class="[factionKeys[factionIndex]]"
            ></div>
            <h1>{{ capitaliseString(factionKeys[factionIndex]) }}</h1>
          </div>

          <button
            aria-label="Next"
            class="next-btn"
            :class="{ disabled: invalidUnitTotal }"
            :disabled="deckManagerDisabled || invalidUnitTotal"
            @click="changeFaction(factionIndex + 1)"
          >
            <v-icon class="icon" name="fa-chevron-circle-right" role="button" />
          </button>
        </div>
      </div>

      <div class="deck-manager-main">
        <div class="deck-manager-deck">
          <div class="deck-manager-stats">
            <div class="deck-heading">
              <h2 class="deck-title">Deck</h2>
              <div class="stat-badge">{{ totalDeckCards }}</div>
            </div>

            <div class="deck-stat" :class="{ error: invalidUnitTotal }">
              <h3 class="deck-stat-title">Unit Cards</h3>
              <div v-if="invalidUnitTotal" class="invalid-total">
                <div class="total">{{ totalUnitCards }}</div>
                /22
              </div>
              <div v-else class="stat-badge">{{ totalUnitCards }}</div>
            </div>
            <!--          <div v-if="localLeaderCards" class="deck-manager-leader">-->
            <!--            <div-->
            <!--              class="avatar"-->
            <!--              :style="{-->
            <!--                backgroundImage: `url(${-->
            <!--                  localLeaderCards[factionKeys[factionIndex]].selected.imageUrl-->
            <!--                })`-->
            <!--              }"-->
            <!--            ></div>-->
            <!--          </div>-->
            <div class="deck-stat">
              <h3 class="deck-stat-title">Special Cards</h3>
              <div class="stat-badge">{{ totalSpecialCards }}</div>
            </div>
            <div class="deck-stat">
              <h3 class="deck-stat-title">Total Strength</h3>
              <div class="stat-badge">{{ totalUnitStrength }}</div>
            </div>
          </div>

          <div class="deck-cards">
            <div v-if="noDeckCards" class="no-cards">
              <p>Cards added to your deck will appear here.</p>
            </div>
            <template v-else>
              <template v-for="(cardArr, key) in deckCards" :key="key">
                <div v-if="cardArr.length > 0" class="combat-container">
                  <div class="deck-manager-type-heading">
                    <div class="type card-stat-badge">
                      <v-icon
                        class="icon"
                        :name="cardArr[0].typeIcon || 'la-star-of-life-solid'"
                        :scale="desktop ? 1.2 : 0.9"
                      />
                    </div>
                    <h3>
                      {{ capitaliseString(String(key)) }}
                      {{ key === 'special' ? 'Cards' : 'Combat' }}
                    </h3>
                  </div>

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
                </div>
              </template>
            </template>
          </div>
        </div>

        <div class="deck-manager-collection">
          <div
            v-show="drawerActive && !desktop"
            class="collection-drawer-screen"
            :class="{ active: drawerActive && !desktop }"
            @click="drawerActive = !drawerActive"
          ></div>

          <div class="collection-drawer" :class="{ active: drawerActive && !desktop }">
            <div
              :aria-label="desktop ? undefined : 'Toggle Drawer'"
              class="collection-drawer-toolbar"
              :role="desktop ? undefined : 'button'"
              tabindex="0"
              @click="drawerActive = !drawerActive"
              @keydown.enter="drawerActive = !drawerActive"
              @keydown.space="drawerActive = !drawerActive"
            >
              <div class="collection-heading">
                <h2 class="collection-title">Collection</h2>
                <div v-if="localCardCollection" class="stat-badge">
                  {{ localCardCollection[factionKeys[factionIndex]].collection.length }}
                </div>
              </div>

              <v-icon
                v-if="!desktop"
                class="arrow-icon"
                :name="drawerActive ? 'fa-chevron-down' : 'fa-chevron-up'"
                role="button"
              />
            </div>

            <div class="collection-drawer-cards">
              <div v-if="noCollectionCards" class="no-cards">
                <p>Unlocked cards will appear here.</p>
              </div>
              <template v-for="(cardArr, key) in collectionCards" :key="key">
                <template v-if="cardArr.length > 0">
                  <div class="combat-container">
                    <div class="deck-manager-type-heading">
                      <div class="type card-stat-badge">
                        <v-icon
                          class="icon"
                          :name="cardArr[0].typeIcon || 'la-star-of-life-solid'"
                          :scale="desktop ? 1.2 : 0.9"
                        />
                      </div>
                      <h3>
                        {{ capitaliseString(String(key)) }}
                        {{ key === 'special' ? 'Cards' : 'Combat' }}
                      </h3>
                    </div>

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
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="deck-manager-footer">
        <template v-if="preMatch">
          <button
            :class="{ disabled: invalidUnitTotal }"
            class="btn primary large"
            :disabled="deckManagerDisabled || invalidUnitTotal"
            @click="factionSelected"
          >
            Select
          </button>
          <button class="btn large" :disabled="deckManagerDisabled" @click="emit('cancel')">
            Back
          </button>
        </template>

        <template v-else>
          <button
            :class="{ disabled: invalidUnitTotal }"
            class="btn primary large"
            :disabled="deckManagerDisabled || invalidUnitTotal"
            @click="save"
          >
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
  -webkit-user-select: none;
  user-select: none;
}

.deck-manager .deck-manager-container {
  position: relative;
  width: 100%;
  min-width: 320px;
  height: 100%;
  max-height: 560px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.deck-manager .deck-manager-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.deck-manager .deck-manager-header .header-container {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  max-width: 420px;
}

.deck-manager .deck-manager-header .heading {
  display: flex;
  align-items: center;
  gap: 10px;
}

.deck-manager .deck-manager-header .prev-btn,
.deck-manager .deck-manager-header .next-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 999px;
  color: #ffffff;
  background: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.deck-manager .deck-manager-header .prev-btn .icon,
.deck-manager .deck-manager-header .next-btn .icon {
  width: 40px;
  height: 40px;
}

.deck-manager .deck-manager-header .prev-btn.disabled,
.deck-manager .deck-manager-header .next-btn.disabled {
  color: #444444;
  cursor: not-allowed;
}

.deck-manager .deck-manager-header .prev-btn .icon,
.deck-manager .deck-manager-header .next-btn .icon {
  transition: color 100ms ease-out;
}

.deck-manager .deck-manager-header .prev-btn:hover:not(.disabled) .icon,
.deck-manager .deck-manager-header .next-btn:hover:not(.disabled) .icon {
  color: #e7e7e7;
}

.deck-manager .deck-manager-header .flag-icon {
  width: 26px;
  height: 26px;
  border: 1px solid #ffffff;
  border-radius: 999px;
  background-position: center;
  background-size: cover;
}

.deck-manager .deck-manager-header .flag-icon.british {
  background-image: url('./../assets/images/british-flag.png');
}

.deck-manager .deck-manager-header .flag-icon.french {
  background-image: url('./../assets/images/french-flag.png');
}

.deck-manager .deck-manager-main {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  overflow: hidden;
  border-radius: 0 0 10px 10px;
}

.deck-manager .stat-badge {
  width: 25px;
  height: 25px;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 999px;
  font-size: 12px;
  font-weight: bold;
  color: #000000;
  background-color: #ffffff;
}

.deck-manager .deck-manager-deck {
  min-height: 0;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.deck-manager .deck-manager-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.deck-manager .deck-heading {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 5px;
}

.deck-manager .deck-stat-title {
  max-width: 46px;
  text-align: right;
  font-size: 10px;
  font-weight: bold;
}

.deck-manager .deck-stat {
  display: flex;
  align-items: center;
  gap: 5px;
}

.deck-manager .deck-stat.error {
  color: #ff2525;
}

.deck-manager .invalid-total {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
}

.deck-manager .invalid-total .total {
  font-size: 22px;
  line-height: 22px;
  font-weight: 900;
}

.deck-manager .deck-cards {
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}

.deck-manager .combat-container {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.13);
}

.deck-manager .deck-manager-collection {
  flex: 0 0 45px;
  box-shadow: 0 -10px 10px 0 rgba(0, 0, 0, 0.25);
}

.deck-manager .collection-drawer-screen {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #000000;
  opacity: 0;
  transition: opacity 0.2s linear;
}

.deck-manager .collection-drawer-screen.active {
  opacity: 0.5;
}

.deck-manager .collection-drawer {
  position: absolute;
  bottom: -305px;
  left: 0;
  right: 0;
  height: 350px;
  display: flex;
  flex-direction: column;
  border-radius: 10px 10px 0 0;
  background-color: #007661;
  box-shadow: 0 -10px 10px 0 rgba(0, 0, 0, 0.25);
  transition: bottom 0.2s cubic-bezier(0.82, 0.085, 0.395, 0.895);
  -webkit-tap-highlight-color: transparent;
}

.deck-manager .collection-drawer.active {
  bottom: 0;
}

.deck-manager .collection-drawer-toolbar {
  padding: 0 10px;
  display: flex;
  flex: 0 0 45px;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 100ms ease-out;
}

.deck-manager .collection-drawer-toolbar .collection-heading {
  display: flex;
  align-items: center;
  gap: 5px;
}

.deck-manager .collection-drawer-toolbar .arrow-icon {
  width: 30px;
  height: 30px;
}

.deck-manager .collection-drawer-cards {
  padding: 0 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}

.deck-manager .no-cards {
  text-align: center;
  color: #ffffff;
}

.deck-manager .no-cards p {
  padding: 30px;
}

.deck-manager .deck-manager-type-heading {
  display: flex;
  align-items: center;
  gap: 6px;
}

.deck-manager .deck-manager-type-heading .card-stat-badge {
  width: 22px;
  height: 22px;
  position: unset;
}

.deck-manager .deck-manager-card-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/*.deck-manager .deck-manager-leader {
  position: relative;
  height: 100%;
  width: 60px;
}

.deck-manager .deck-manager-leader .avatar {
  z-index: 1000;
  position: absolute;
  top: -5px;
  left: 0;
  width: 60px;
  height: 60px;
  border: 5px solid #000000;
  box-sizing: border-box;
  border-radius: 999px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}*/

.deck-manager .deck-cards::-webkit-scrollbar,
.deck-manager .collection-drawer-cards::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 5px;
}

.deck-manager .deck-cards::-webkit-scrollbar-thumb,
.deck-manager .collection-drawer-cards::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.5);
  -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
}

.deck-manager .deck-manager-footer {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.deck-manager .card-modal .card-modal-header .card-stat-badge {
  width: 25px;
  height: 25px;
  position: unset;
}

/* Narrow Mobile Screen Styles */

@media (max-width: 359px) and (orientation: portrait) {
  .deck-manager .deck-manager-deck {
    padding: 0;
  }

  .deck-manager .deck-manager-stats {
    gap: 8px;
  }
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
  .deck-manager .deck-manager-container {
    max-height: 880px;
    gap: 20px;
  }

  .deck-manager .deck-manager-header .header-container {
    max-width: 500px;
  }

  .deck-manager .deck-manager-header .heading {
    gap: 15px;
  }

  .deck-manager .deck-manager-header .flag-icon {
    width: 36px;
    height: 36px;
  }

  .deck-manager .deck-manager-header .prev-btn,
  .deck-manager .deck-manager-header .next-btn {
    width: 50px;
    height: 50px;
  }

  .deck-manager .deck-manager-header .prev-btn .icon,
  .deck-manager .deck-manager-header .next-btn .icon {
    width: 50px;
    height: 50px;
  }

  .deck-manager .deck-manager-main {
    padding: 0 20px;
    flex-direction: row;
    gap: 20px;
  }

  .deck-manager .stat-badge {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }

  .deck-manager .deck-manager-stats {
    gap: 20px;
  }

  .deck-manager .deck-heading {
    gap: 8px;
  }

  .deck-manager .deck-stat {
    flex-direction: column-reverse;
    gap: 7px;
  }

  .deck-manager .deck-stat-title {
    max-width: none;
    text-align: center;
    font-size: 13px;
  }

  .deck-manager .invalid-total {
    height: 30px;
    font-size: 18px;
  }

  .deck-manager .invalid-total .total {
    font-size: 30px;
  }

  .deck-manager .deck-manager-deck,
  .deck-manager .deck-manager-collection {
    padding: 0;
    flex: 1;
  }

  .deck-manager .deck-manager-deck {
    gap: 20px;
  }

  .deck-manager .deck-cards {
    padding-bottom: 0;
    border-radius: 10px;
  }

  .deck-manager .collection-drawer {
    position: relative;
    bottom: auto;
    left: auto;
    right: auto;
    height: 100%;
    border-radius: 10px;
  }

  .deck-manager .collection-drawer-toolbar {
    padding: 15px 20px;
    flex-basis: auto;
    cursor: default;
  }

  .deck-manager .collection-drawer-toolbar .collection-heading {
    gap: 8px;
  }

  .deck-manager .collection-drawer-cards {
    padding: 0 20px 20px;
  }

  .deck-manager .deck-manager-type-heading {
    gap: 12px;
  }

  .deck-manager .deck-manager-type-heading .card-stat-badge {
    width: 30px;
    height: 30px;
  }

  /*.deck-manager .deck-manager-leader {
    width: 100px;
  }

  .deck-manager .deck-manager-leader .avatar {
    top: -10px;
    width: 100px;
    height: 100px;
    border: 8px solid #000000;
  }*/

  .deck-manager .card-modal .card-modal-header .card-stat-badge {
    width: 40px;
    height: 40px;
  }

  .deck-manager .deck-manager-footer {
    gap: 20px;
  }
}
</style>
