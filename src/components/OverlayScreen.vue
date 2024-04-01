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

<style>
.overlay {
  z-index: 2000;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: black;
  opacity: 0.5;
}
</style>
