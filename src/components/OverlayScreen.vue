<script setup lang="ts">

defineProps<{
  modelValue: boolean
}>()
</script>

<template>
  <transition name="fade">
    <div v-if="modelValue" class="overlay" role="alert"></div>
  </transition>
</template>
