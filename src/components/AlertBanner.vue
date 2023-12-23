<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  avatar?: string
  desktop?: boolean
  icon?: string
  modelValue: boolean
  title: string
}>()

const avatarImg = computed(() => {
  return new URL(`../assets/images/${props.avatar}`, import.meta.url)
})
</script>

<template>
  <transition name="fade">
    <div v-if="modelValue" class="alert-banner" role="alert">
      <div v-if="avatar || icon" class="mark">
        <div v-if="avatar" class="avatar" :style="{ backgroundImage: `url(${avatarImg})` }"></div>
        <v-icon v-if="icon" :name="icon" class="icon" />
      </div>
      <div class="heading">
        <slot>
          <h2>{{ props.title }}</h2>
        </slot>
      </div>
    </div>
  </transition>
</template>
