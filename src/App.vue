<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import Card from './components/Card.vue'
</script>

<template>
  <div class="game-container">
    <div class="scroll-container">
      <div class="opponent-board">
        <div class="card-row">
          <div class="row-info">info</div>

          <div class="card-container">
            <Card v-for="i in 12" :value="i" />
          </div>
        </div>
        <div class="card-row">
          <div class="row-info">info</div>

          <div class="card-container">
            <Card v-for="i in 2" :value="i" />
          </div>
        </div>
        <div class="card-row">
          <div class="row-info">info</div>

          <div class="card-container">
            <Card v-for="i in 3" :value="i" />
          </div>
        </div>
      </div>

      <div class="game-info">game-info</div>

      <div class="player-board">
        <div class="card-row">
          <div class="row-info">info</div>

          <div class="card-container">
            <Card v-for="i in 15" :value="i" />
          </div>
        </div>
        <div class="card-row">
          <div class="row-info">info</div>

          <div class="card-container">
            <Card v-for="i in 1" :value="i" />
          </div>
        </div>
        <div class="card-row">
          <div class="row-info">info</div>

          <div class="card-container">
            <Card v-for="i in 3" :value="i" />
          </div>
        </div>

        <div class="card-row player-hand">
          <Card v-for="i in 20" :value="i" />
        </div>
      </div>
    </div>
  </div>
</template>
