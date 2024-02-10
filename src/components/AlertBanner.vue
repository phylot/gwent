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
        <div v-if="avatar" class="avatar" :style="{ backgroundImage: `url(${props.avatar})` }"></div>
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
