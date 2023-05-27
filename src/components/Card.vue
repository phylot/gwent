<template>
  <div class="card-wrapper">
    <div class="card">{{ value }}</div>
  </div>
</template>

<script>
export default {
  name: 'card',
  props: {
    ability: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    faction: {
      type: String,
      default: null
    },
    image: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: null
    },
    value: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped></style>
