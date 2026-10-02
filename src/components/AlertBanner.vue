<script setup lang="ts">
defineProps<{
  avatar?: string
  desktop?: boolean
  icon?: string
  modelValue: boolean
  title: string
}>()
</script>

<template>
  <transition name="fast-fade">
    <div v-if="modelValue" class="alert-banner" :class="{ desktop: desktop }" role="alert">
      <div v-if="avatar || icon" class="mark">
        <div v-if="avatar" class="avatar" :style="{ backgroundImage: `url(${avatar})` }"></div>
        <v-icon
          v-if="icon"
          class="icon"
          :fill="icon === 'oi-star-fill' ? '#d89803' : null"
          :name="icon"
        />
      </div>
      <div class="heading">
        <slot>
          <h2 class="title">{{ title }}</h2>
        </slot>
      </div>
    </div>
  </transition>
</template>

<style>
.alert-banner {
  z-index: 6000;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  width: 100%;
  min-width: 320px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.8);
}

.alert-banner .mark {
  position: relative;
  width: 100px;
  height: 70px;
}

.alert-banner .avatar {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  right: 0;
  width: 80px;
  min-width: 80px;
  height: 80px;
  min-height: 80px;
  border: 2px solid #ffffff;
  border-radius: 999px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  box-shadow: 0 0 0 2px #000000;
  filter: drop-shadow(0px 0px 20px #000000) drop-shadow(0px 0px 20px #000000)
    drop-shadow(0px 0px 20px #000000);
}

.alert-banner .icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  width: 100px;
  min-width: 100px;
  height: 100px;
  min-height: 100px;
  filter: drop-shadow(0px 0px 20px #000000) drop-shadow(0px 0px 20px #000000)
    drop-shadow(0px 0px 20px #000000);
}

.alert-banner .heading {
  max-width: 400px;
}

.alert-banner .heading .title {
  font-size: 14px;
  font-weight: 900;
  filter: drop-shadow(0px 0px 10px #000000) drop-shadow(0px 0px 10px #000000)
    drop-shadow(0px 0px 10px #000000);
}

/* Desktop Styles */

.alert-banner.desktop {
  height: 120px;
  gap: 30px;
}

.alert-banner.desktop .mark {
  width: 200px;
  height: 80px;
}

.alert-banner.desktop .avatar {
  width: 160px;
  min-width: 160px;
  height: 160px;
  min-height: 160px;
}

.alert-banner.desktop .icon {
  position: absolute;
  left: 0;
  width: 200px;
  min-width: 200px;
  height: 200px;
  min-height: 200px;
}

.alert-banner.desktop .heading .title {
  font-size: 22px;
}
</style>
