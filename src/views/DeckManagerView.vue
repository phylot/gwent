<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { type Card, type CardCollection } from '@/types'
import SmallCard from '../components/SmallCard.vue'

const props = defineProps<{
  cardCollection: CardCollection
  desktop: boolean
  leaderCards: Card
}>()

let localCardCollection = ref()
let factionKeys = ref(Object.keys(props.cardCollection))
let factionIndex = ref(0)

interface ManageCardCollection {
  [key: string]: Card[]
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
  (e: 'cancel'): void
  (e: 'save'): void
}>()

// HOOKS

onMounted(() => {
  localCardCollection.value = props.cardCollection
  console.log('MOUNTED localCardCollection.value: ', localCardCollection.value)

  // Sort all cards by 'id'
  for (const faction in localCardCollection.value) {
    localCardCollection.value[faction].collection.sort(sortCardsById)
    localCardCollection.value[faction].deck.sort(sortCardsById)
  }
  console.log('SORTED localCardCollection.value: ', localCardCollection.value)
})

function changeFaction(index: number) {
  if (index < 0) {
    factionIndex.value = factionKeys.value.length - 1
  } else if (index > factionKeys.value.length - 1) {
    factionIndex.value = 0
  } else {
    factionIndex.value = index
  }
}

function cardClick(card: Card) {
  // TODO: Push card to 'deck' and splice card from 'collection'
  // Re-sort card collection
  // localCardCollection.value[factionKeys.value[factionIndex.value]].collection.sort(sortCardsById)
  // localCardCollection.value[factionKeys.value[factionIndex.value]].deck.sort(sortCardsById)

  console.log('cardClick() card: ', card)
}

function save() {
  // TODO: Pass 'localCardCollection' to parent via event + set flag in App.vue to skip intro sequence, if already played
  emit('save')
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
      <div class="deck-manager-heading">
        <button class="btn" @click="changeFaction(factionIndex - 1)">Prev</button>
        <h1>{{ capitaliseString(factionKeys[factionIndex]) }}</h1>
        <button class="btn" @click="changeFaction(factionIndex + 1)">Next</button>
      </div>

      <div class="deck-manager-deck">
        <h2>Deck</h2>

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
                :default-value="card.defaultValue"
                :desktop="props.desktop"
                :faction="card.faction"
                :hero="card.hero"
                :image-url="card.imageUrl"
                :key="i"
                role="button"
                tabindex="0"
                :type-icon="card.typeIcon"
                :value="card.value"
                @smallcard-click="cardClick(card)"
                @smallcard-enter="cardClick(card)"
                @smallcard-space="cardClick(card)"
              />
            </div>
          </template>
        </template>
      </div>

      <div class="deck-manager-stats"></div>

      <div class="deck-manager-collection">
        <h2>Card Collection</h2>

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
                :default-value="card.defaultValue"
                :desktop="props.desktop"
                :faction="card.faction"
                :hero="card.hero"
                :image-url="card.imageUrl"
                :key="i"
                role="button"
                tabindex="0"
                :type-icon="card.typeIcon"
                :value="card.value"
                @smallcard-click="cardClick(card)"
                @smallcard-enter="cardClick(card)"
                @smallcard-space="cardClick(card)"
              />
            </div>
          </template>
        </template>
      </div>

      <div class="btn-container">
        <button class="btn primary large" @click="save">Save</button>
        <button class="btn large" @click="emit('cancel')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style>
.deck-manager {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: scroll;
  color: #ffffff;
}

.deck-manager .deck-manager-container {
  width: 90%;
  min-width: 320px;
  margin: auto;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  background-color: #151515;
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
  background-color: #151515;
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
