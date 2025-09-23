<script setup lang="ts">
const props = defineProps<{
  active: boolean
  desktop: boolean
  icon: string
  name: string
  reverse?: boolean
  type: string
}>()
</script>

<template>
  <div class="award" :class="[{ desktop: desktop, reverse: reverse }, active ? type : null]">
    <v-icon class="icon award-icon" :name="active ? props.icon : 'gi-padlock'" />
    <div class="name">{{ active ? props.name : '??????' }}</div>
  </div>
</template>

<style>
.award {
  display: flex;
  align-items: center;
  font-size: 0.7em;
  font-weight: bold;
  border-radius: 9999px;
  background-color: #3f3f3f;
}

.award.reverse {
  flex-direction: row-reverse;
  text-align: right;
}

.award .award-icon {
  width: 23px;
  height: 23px;
  padding: 3px;
  border-radius: 999px;
  fill: #ffffff;
  background-color: #535353;
}

.award .name {
  padding: 0 15px 0 5px;
  text-wrap: nowrap;
}

.award.reverse .name {
  padding: 0 5px 0 10px;
}

.award.cardmaster {
  background-color: #217f9d;
}

.award.cardmaster .award-icon {
  background-color: #2b94b5;
}

.award.fieldmarshal {
  background-color: #357266;
}

.award.fieldmarshal .award-icon {
  background-color: #408679;
}

.award.heavyweight {
  background-color: #bb4902;
}

.award.heavyweight .award-icon {
  background-color: #d55a0e;
}

.award.spymaster {
  background-color: #712f79;
}

.award.spymaster .award-icon {
  background-color: #893b93;
}

.award.tactician {
  background-color: #ad507f;
}

.award.tactician .award-icon {
  background-color: #c36294;
}

.award.tyrant {
  background-color: #c1292e;
}

.award.tyrant .award-icon {
  background-color: #db3c42;
}

.award.desktop {
  font-size: 0.8em;
}

.award.desktop .award-icon {
  width: 38px;
  height: 38px;
  padding: 5px;
}

.award.desktop .name {
  padding: 0 20px 0 10px;
}

.award.desktop.reverse .name {
  padding: 0 10px 0 20px;
}
</style>
