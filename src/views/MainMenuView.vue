<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
  awardsCount: number
  disabled?: boolean
  disableLogoClick: boolean
  showMenu: boolean
}>()

let beanVisible = ref(false)
let logoVisible = ref(false)
let playButtonVisible = ref(false)
let skipButtonVisible = ref(false)
let mainMenuVisible = ref(false)
let beanTimeout1: ReturnType<typeof setTimeout>
let beanTimeout2: ReturnType<typeof setTimeout>
let logoTimeout: ReturnType<typeof setTimeout>
let playButtonTimeout: ReturnType<typeof setTimeout>
let titleSequenceHasPlayed: boolean = false
let animationIsFinished = ref(false)
let logoClickCount = ref(0)
let lastLogoClickTime: number = 0
let logoClickTimeout: ReturnType<typeof setTimeout>

// EVENTS

const emit = defineEmits<{
  (e: 'awards'): void
  (e: 'manage-deck', preMatch: boolean): void
  (e: 'play'): void
  (e: 'skip'): void
  (e: 'title-sequence-end'): void
  (e: 'unlock-all-cards'): void
}>()

// HOOKS

onMounted(() => {
  if (props.showMenu) {
    animationIsFinished.value = true
    showMainMenu()
  } else {
    // Title sequence
    beanTimeout1 = setTimeout(() => {
      beanVisible.value = true
      beanTimeout2 = setTimeout(() => {
        beanVisible.value = false
        logoTimeout = setTimeout(() => {
          skipButtonVisible.value = false
          logoVisible.value = true
          titleSequenceHasPlayed = true
          emit('title-sequence-end')
          playButtonTimeout = setTimeout(() => {
            playButtonVisible.value = true
            animationIsFinished.value = true
          }, 1500)
        }, 4600)
      }, 3500)
    }, 9000)
  }
})

function viewClick() {
  if (!skipButtonVisible.value && !titleSequenceHasPlayed && !animationIsFinished.value) {
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

  animationIsFinished.value = true
  beanVisible.value = false
  skipButtonVisible.value = false
  logoVisible.value = true
  playButtonVisible.value = true
  titleSequenceHasPlayed = true
  emit('title-sequence-end')
  emit('skip')
}

function showMainMenu() {
  logoVisible.value = false
  setTimeout(() => {
    mainMenuVisible.value = true
  }, 500)
}

function logoClick() {
  if (!props.disableLogoClick) {
    // Cancel the click timeout every click
    clearTimeout(logoClickTimeout)

    const currentClickTime = Date.now()

    if (currentClickTime - lastLogoClickTime <= 1000) {
      logoClickCount.value++
    } else {
      logoClickCount.value = 0
    }
    lastLogoClickTime = currentClickTime

    if (logoClickCount.value > 19) {
      logoClickCount.value = 0
      emit('unlock-all-cards')
    }

    // Reset click timeout to 0 after 1 sec
    logoClickTimeout = setTimeout(() => {
      logoClickCount.value = 0
    }, 1000)
  }

}
</script>

<template>
  <div class="main-menu" :class="{ animate: !animationIsFinished }" @click="viewClick">
    <transition :name="animationIsFinished ? 'none' : 'fade'">
      <h1 v-if="beanVisible" class="bean">SEAN BEAN</h1>
    </transition>

    <transition name="fade">
      <div v-if="logoVisible" class="logo-container">
        <h1
          class="logo"
          :class="{
            'shake-small': logoClickCount > 4 && logoClickCount < 11,
            'shake-big': logoClickCount > 10 && logoClickCount < 20
          }"
          @click="logoClick"
        >
          <span class="lineOne">Sharpe's</span><span class="lineTwo">GWENT</span>
        </h1>

        <transition name="fade">
          <button
            v-if="playButtonVisible"
            class="btn large primary play-btn"
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
          <span class="lineOne">Sharpe's</span><span class="lineTwo">GWENT</span>
        </h1>
        <button class="btn large primary" :disabled="disabled" type="button" @click="emit('play')">
          Play
        </button>
        <button class="btn large" type="button" @click="emit('manage-deck', false)">
          Manage Deck
        </button>
        <button class="btn large" :disabled="disabled" type="button" @click="emit('awards')">
          Awards ({{ awardsCount }})
        </button>
      </div>
    </transition>

    <transition name="fade">
      <button
        v-if="skipButtonVisible"
        class="btn large skip-btn"
        :disabled="disabled"
        type="button"
        @click="skip"
      >
        Skip
      </button>
    </transition>
  </div>
</template>

<style>
.main-menu {
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
  animation-duration: 18.6s;
  animation-name: menuBgPan;
  animation-iteration-count: 1;
  animation-timing-function: ease-in-out;
}

/* Main menu background animation */

@media (orientation: portrait) {
  .main-menu {
    background-size: auto 100%;
    background-position-x: 80%;
    background-position-y: 0;
  }

  @keyframes menuBgPan {
    from {
      background-size: auto 150%;
      background-position-x: 0;
      background-position-y: 100%;
    }
    to {
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
    from {
      background-size: 250% auto;
      background-position-x: 0;
      background-position-y: 100%;
    }
    to {
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
  gap: 20px;
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
  cursor: default;
  user-select: none;
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
  width: 270px;
  display: block;
  text-align: center;
  font-family: 'UniversalSerif';
  font-size: 44px;
  font-weight: 100;
  letter-spacing: 20px;
  text-indent: -3px;
  line-height: 50px;
  border-top: 3.5px solid #ffffff;
  border-bottom: 3.5px solid #ffffff;
}

.main-menu .logo.menu-heading .lineTwo {
  width: 181px;
  font-size: 30px;
  letter-spacing: 13px;
  text-indent: -2px;
  line-height: 32px;
  border-top: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
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
  padding: 30px 40px;
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
    font-size: 150px;
    margin-bottom: -44px;
  }

  .main-menu .logo .lineTwo {
    width: 620px;
    font-size: 100px;
    letter-spacing: 48px;
    text-indent: -9px;
    line-height: 102px;
    border-top: 7px solid #ffffff;
    border-bottom: 7px solid #ffffff;
  }

  .main-menu .logo.menu-heading {
    text-shadow: 4px 4px #000000;
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
