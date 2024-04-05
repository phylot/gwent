<script setup lang="ts">
import { onMounted, ref } from 'vue'

let showBean = ref(false)
let showLogo = ref(false)
let showPlayButton = ref(false)

// EVENTS

defineEmits<{
  (e: 'play'): void
}>()

// HOOKS

onMounted(() => {
  // Title sequence
  setTimeout(() => {
    showBean.value = true
    setTimeout(() => {
      showBean.value = false
      setTimeout(() => {
        showLogo.value = true
        setTimeout(() => {
          showPlayButton.value = true
        }, 1500)
      }, 4100)
    }, 4000)
  }, 9000)
})
</script>

<template>
  <div class="main-menu">
    <transition name="fade">
      <h1 v-if="showBean" class="bean">SEAN BEAN</h1>
    </transition>

    <transition name="fade">
      <div v-if="showLogo" class="logo-wrap">
        <h1 class="logo">
          <span class="lineOne">Sharpe's</span><span class="lineTwo"><span>GWENT</span></span>
        </h1>

        <transition name="fade">
          <button
            v-if="showPlayButton"
            class="btn large primary no-mobile-highlight"
            type="button"
            @click="$emit('play')"
          >
            PLAY
          </button>
        </transition>
      </div>
    </transition>
  </div>
</template>

<style>
/* TODO: Move to /assets/styles/main-menu.css */

.main-menu {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background-repeat: no-repeat;
  background-image: url('./../assets/images/main-menu-bg.jpg');
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

.main-menu .logo-wrap {
  min-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 300px;
}

.main-menu .logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-shadow: 4px 4px #000000;
}

.main-menu .logo .lineOne {
  font-family: 'LouisaCP';
  font-size: 80px;
  margin-bottom: -23px;
}

.main-menu .logo .lineTwo {
  font-family: 'UniversalSerif';
  font-size: 54px;
  font-weight: 100;
  letter-spacing: 18px;
  text-indent: 10px;
  line-height: 59px;
  text-align: center;
  border-top: 3px solid #ffffff;
  border-bottom: 3px solid #ffffff;
}

.main-menu .logo .lineTwo span {
  margin: 0 -16px;
}

.main-menu .bean {
  font-family: 'UniversalSerif';
  font-size: 32px;
  font-weight: 100;
  letter-spacing: 4px;
  text-shadow: 2px 2px #000000;
}

.main-menu .btn.large {
  margin: 60px;
}

/* Desktop / Tablet Styles */

@media (min-height: 880px) and (orientation: landscape),
  (min-width: 768px) and (min-height: 1024px) and (orientation: portrait) {
  .main-menu .logo-wrap {
    width: auto;
    height: 486px;
  }

  .main-menu .logo {
    text-shadow: 6px 6px #000000;
  }

  .main-menu .logo .lineOne {
    font-size: 180px;
    margin-bottom: -52px;
  }

  .main-menu .logo .lineTwo {
    font-size: 130px;
    letter-spacing: 40px;
    text-indent: 23px;
    line-height: 130px;
    border-top: 8px solid #ffffff;
    border-bottom: 8px solid #ffffff;
  }

  .main-menu .logo .lineTwo span {
    margin: 0 -35px;
  }

  .main-menu .bean {
    font-size: 60px;
    letter-spacing: 7px;
    text-shadow: 4px 4px #000000;
  }

  .main-menu .btn.large {
    margin: 90px;
  }
}
</style>
