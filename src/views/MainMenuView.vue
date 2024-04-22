<script setup lang="ts">
import { onMounted, ref } from 'vue'

let beanVisible = ref(false)
let logoVisible = ref(false)
let playButtonVisible = ref(false)
let skipButtonVisible = ref(false)
let isSkipped = ref(false)
let mainMenuVisible = ref(false)
let beanTimeout1: ReturnType<typeof setTimeout>
let beanTimeout2: ReturnType<typeof setTimeout>
let logoTimeout: ReturnType<typeof setTimeout>
let playButtonTimeout: ReturnType<typeof setTimeout>
let titleSequenceIsFinished: boolean = false

// EVENTS

const emit = defineEmits<{
  (e: 'awards'): void
  (e: 'manage-deck'): void
  (e: 'play'): void
  (e: 'skip'): void
}>()

// HOOKS

onMounted(() => {
  // Title sequence
  beanTimeout1 = setTimeout(() => {
    beanVisible.value = true
    beanTimeout2 = setTimeout(() => {
      beanVisible.value = false
      logoTimeout = setTimeout(() => {
        titleSequenceIsFinished = true
        skipButtonVisible.value = false
        logoVisible.value = true
        playButtonTimeout = setTimeout(() => {
          playButtonVisible.value = true
        }, 1500)
      }, 4600)
    }, 3500)
  }, 9000)
})

function viewClick() {
  if (!isSkipped.value && !skipButtonVisible.value && !titleSequenceIsFinished) {
    skipButtonVisible.value = true
    setTimeout(() => {
      skipButtonVisible.value = false
    }, 4000)
  }
}

function skip() {
  clearTimeout(beanTimeout1)
  clearTimeout(beanTimeout2)
  clearTimeout(logoTimeout)
  clearTimeout(playButtonTimeout)

  titleSequenceIsFinished = true
  isSkipped.value = true
  beanVisible.value = false
  skipButtonVisible.value = false
  logoVisible.value = true
  playButtonVisible.value = true
  emit('skip')
}

function showMainMenu() {
  logoVisible.value = false
  setTimeout(() => {
    mainMenuVisible.value = true
  }, 500)
}
</script>

<template>
  <div class="main-menu" :class="{ animate: !isSkipped }" @click="viewClick">
    <transition :name="isSkipped ? 'none' : 'fade'">
      <h1 v-if="beanVisible" class="bean">SEAN BEAN</h1>
    </transition>

    <transition name="fade">
      <div v-if="logoVisible" class="logo-container">
        <h1 class="logo">
          <span class="lineOne">Sharpe's</span><span class="lineTwo"><span>GWENT</span></span>
        </h1>

        <transition name="fade">
          <button
            v-if="playButtonVisible"
            class="btn large primary no-mobile-highlight play-btn"
            type="button"
            @click="showMainMenu"
          >
            PLAY
          </button>
        </transition>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="mainMenuVisible" class="menu-container">
        <h1 class="logo menu-heading">
          <span class="lineOne">Sharpe's</span><span class="lineTwo"><span>GWENT</span></span>
        </h1>
        <button class="btn large primary no-mobile-highlight" type="button" @click="$emit('play')">
          QUICK MATCH
        </button>
        <button class="btn large no-mobile-highlight disabled" disabled type="button" @click="emit('manage-deck')">
          MANAGE DECK
        </button>
        <button class="btn large no-mobile-highlight disabled" disabled type="button" @click="emit('awards')">
          AWARDS (0)
        </button>
      </div>
    </transition>

    <transition name="fade">
      <button
        v-if="skipButtonVisible"
        class="btn large no-mobile-highlight skip-btn"
        type="button"
        @click="skip"
      >
        SKIP
      </button>
    </transition>
  </div>
</template>

<style>
/* TODO: Move to /assets/styles/main-menu.css */

.main-menu {
  position: absolute;
  width: 100%;
  min-width: 320px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: scroll;
  color: #ffffff;
  background-repeat: no-repeat;
  background-image: url('./../assets/images/main-menu-bg.jpg');
}

.main-menu.animate {
  animation: menuBgPan 30s;
}

/* Main menu background animation */

@media (orientation: portrait) {
  .main-menu {
    background-size: auto 100%;
    background-position-x: 80%;
    background-position-y: 0;
  }

  @keyframes menuBgPan {
    0% {
      background-size: auto 150%;
      background-position-x: 0;
      background-position-y: 100%;
    }
    100% {
      background-size: auto 100%;
      background-position-x: 80%;
      background-position-y: 0;
    }
  }
}

@media (orientation: landscape) {
  .main-menu {
    background-size: 150%;
    background-position-x: 100%;
    background-position-y: 0;
  }

  @keyframes menuBgPan {
    0% {
      background-size: 250% auto;
      background-position-x: 0;
      background-position-y: 100%;
    }
    100% {
      background-size: 150% auto;
      background-position-x: 100%;
      background-position-y: 0;
    }
  }
}

.main-menu .logo-container,
.main-menu .menu-container {
  position: relative;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-menu .logo-container {
  min-width: 320px;
  height: 300px;
}

.main-menu .logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-shadow: 4px 4px #000000;
}

.main-menu .logo.menu-heading {
  margin-bottom: 20px;
}

.main-menu .logo .lineOne {
  font-family: 'LouisaCP';
  font-size: 70px;
  margin-bottom: -18px;
}

.main-menu .logo.menu-heading .lineOne {
  font-size: 48px;
  margin-bottom: -14px;
}

.main-menu .logo .lineTwo {
  font-family: 'UniversalSerif';
  font-size: 50px;
  font-weight: 100;
  letter-spacing: 18px;
  text-indent: 10px;
  line-height: 59px;
  text-align: center;
  border-top: 3px solid #ffffff;
  border-bottom: 3px solid #ffffff;
}

.main-menu .logo.menu-heading .lineTwo {
  font-size: 30px;
  letter-spacing: 10px;
  text-indent: 7px;
  line-height: 38px;
}

.main-menu .logo .lineTwo span {
  margin: 0 -16px;
}

.main-menu .logo.menu-heading .lineTwo span {
  margin: 0 -9px;
}

.main-menu .bean {
  font-family: 'UniversalSerif';
  font-size: 32px;
  font-weight: 100;
  letter-spacing: 4px;
  text-shadow: 2px 2px #000000;
}

.main-menu .btn.play-btn {
  margin: 60px;
}

.main-menu .btn.skip-btn {
  position: fixed;
  bottom: 20px;
}

.main-menu .menu-container {
  padding: 15px 20px;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.8);
}

.main-menu .menu-container .btn {
  width: 100%;
}
/* Desktop / Tablet Styles */

@media (min-height: 880px) and (orientation: landscape),
  (min-width: 768px) and (min-height: 1024px) and (orientation: portrait) {
  .main-menu .logo-container {
    width: auto;
    height: 486px;
  }

  .main-menu .logo {
    text-shadow: 6px 6px #000000;
  }

  .main-menu .logo .lineOne {
    font-size: 170px;
    margin-bottom: -47px;
  }

  .main-menu .logo .lineTwo {
    font-size: 130px;
    letter-spacing: 40px;
    text-indent: 23px;
    line-height: 130px;
    border-top: 8px solid #ffffff;
    border-bottom: 8px solid #ffffff;
  }

  .main-menu .logo.menu-heading .lineTwo {
    border-top: 3px solid #ffffff;
    border-bottom: 3px solid #ffffff;
  }

  .main-menu .logo .lineTwo span {
    margin: 0 -35px;
  }

  .main-menu .bean {
    font-size: 60px;
    letter-spacing: 7px;
    text-shadow: 4px 4px #000000;
  }

  .main-menu .btn.play-btn {
    margin: 90px;
  }
}
</style>
