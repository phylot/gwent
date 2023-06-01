<script setup lang="ts">
// import { reactive } from 'vue'
// import { RouterLink, RouterView } from 'vue-router'
import BoardCard from './components/BoardCard.vue'
</script>

<template>
  <div class="game-container">
    <div class="scroll-container">
      <div class="opponent-board">
        <div class="card-row">
          <div class="row-stats">
            <div class="total-counter">999</div>
          </div>

          <div class="card-container">
            <BoardCard v-for="i in 12" :value="i" />
          </div>
        </div>
        <div class="card-row">
          <div class="row-stats">
            <div class="total-counter">999</div>
          </div>

          <div class="card-container">
            <BoardCard v-for="i in 2" :value="i" />
          </div>
        </div>
        <div class="card-row">
          <div class="row-stats">
            <div class="total-counter">999</div>
          </div>

          <div class="card-container">
            <BoardCard v-for="i in 3" :value="i" />
          </div>
        </div>
      </div>

      <div class="game-stats">
        <div class="player-stats">
          <div class="total-counter player-total">999</div>
        </div>
        <!-- TODO: Display last card in specialCards array, ELSE display placeholder -->
        <BoardCard />
        <div class="opponent-stats">
          <div class="total-counter opponent-total">76</div>
        </div>
      </div>

      <div class="player-board">
        <div class="card-row">
          <div class="row-stats">
            <div class="total-counter">999</div>
          </div>

          <div class="card-container">
            <BoardCard v-for="i in 15" :value="i" />
          </div>
        </div>
        <div class="card-row">
          <div class="row-stats">
            <div class="total-counter">999</div>
          </div>

          <div class="card-container">
            <BoardCard v-for="i in 1" :value="i" />
          </div>
        </div>
        <div class="card-row">
          <div class="row-stats">
            <div class="total-counter">999</div>
          </div>

          <div class="card-container">
            <BoardCard v-for="i in 3" :value="i" />
          </div>
        </div>

        <div class="card-row player-hand">
          <BoardCard v-for="i in 20" :value="i" />
        </div>
      </div>
    </div>
  </div>
</template>
