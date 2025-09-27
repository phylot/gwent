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
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.8);
}

.alert-banner .mark {
  position: relative;
  width: 50px;
  height: 50px;
}

.alert-banner .avatar {
  position: absolute;
  top: -5px;
  bottom: -5px;
  right: 0;
  width: 60px;
  min-width: 60px;
  height: 60px;
  min-height: 60px;
  border: 2px solid #ffffff;
  border-radius: 999px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  box-shadow: 0 0 0 2px #000000;
}

.alert-banner .icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  min-width: 50px;
  height: 50px;
  min-height: 50px;
}

.alert-banner .heading {
  max-width: 400px;
  padding-left: 10px;
}

.alert-banner .heading .title {
  font-size: 14px;
}

/* Desktop Styles */

.alert-banner.desktop {
  height: 80px;
}

.alert-banner.desktop .mark {
  width: 80px;
  height: 80px;
}

.alert-banner.desktop .avatar {
  position: absolute;
  top: -5px;
  bottom: -5px;
  right: 0;
  width: 90px;
  min-width: 90px;
  height: 90px;
  min-height: 80px;
}

.alert-banner.desktop .icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  min-width: 80px;
  height: 80px;
  min-height: 80px;
}

.alert-banner.desktop .heading {
  padding-left: 15px;
}

.alert-banner.desktop .heading .title {
  font-size: 22px;
}
</style>
