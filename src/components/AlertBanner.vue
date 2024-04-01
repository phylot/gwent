<script setup lang="ts">
const props = defineProps<{
  avatar?: string
  desktop?: boolean
  icon?: string
  modelValue: boolean
  title: string
}>()
</script>

<template>
  <transition name="fade">
    <div v-if="modelValue" class="alert-banner" role="alert">
      <div v-if="avatar || icon" class="mark">
        <div
          v-if="avatar"
          class="avatar"
          :style="{ backgroundImage: `url(${props.avatar})` }"
        ></div>
        <v-icon
          v-if="icon"
          class="icon"
          :fill="icon === 'gi-round-star' ? 'gold' : null"
          :name="icon"
        />
      </div>
      <div class="heading">
        <slot>
          <h2>{{ props.title }}</h2>
        </slot>
      </div>
    </div>
  </transition>
</template>

<style>
.alert-banner {
  z-index: 7000;
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
  border: 2px solid #000000;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
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

.alert-banner .heading h2 {
  font-size: 0.9em;
}

/* Desktop / Tablet Styles */

@media (min-height: 880px) and (orientation: landscape),
  (min-width: 768px) and (min-height: 1024px) and (orientation: portrait) {
  .alert-banner {
    height: 80px;
  }

  .alert-banner .mark {
    width: 80px;
    height: 80px;
  }

  .alert-banner .avatar {
    position: absolute;
    top: -5px;
    bottom: -5px;
    right: 0;
    width: 90px;
    min-width: 90px;
    height: 90px;
    min-height: 80px;
  }

  .alert-banner .icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 80px;
    min-width: 80px;
    height: 80px;
    min-height: 80px;
  }

  .alert-banner .heading {
    padding-left: 15px;
  }

  .alert-banner .heading h2 {
    font-size: 1.2em;
  }
}
</style>
