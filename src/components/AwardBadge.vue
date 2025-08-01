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
    <v-icon :name="active ? props.icon : 'gi-padlock'" class="icon" fill="white" :scale="props.desktop ? 2 : 1.2" />
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

.award .icon {
  padding: 3px;
  border-radius: 999px;
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

.award.cardmaster .icon {
  background-color: #2b94b5;
}

.award.fieldmarshal {
  background-color: #357266;
}

.award.fieldmarshal .icon {
  background-color: #408679;
}

.award.heavyweight {
  background-color: #BB4902;
}

.award.heavyweight .icon {
  background-color: #d55a0e;
}

.award.spymaster {
  background-color: #712f79;
}

.award.spymaster .icon {
  background-color: #893b93;
}

.award.tactician {
  background-color: #ad507f;
}

.award.tactician .icon {
  background-color: #c36294;
}

.award.tyrant {
  background-color: #c1292e;
}

.award.tyrant .icon {
  background-color: #db3c42;
}

.award.desktop {
  font-size: 0.8em;
}

.award.desktop .icon {
  padding: 5px;
}

.award.desktop .name {
  padding: 0 20px 0 10px;
}

.award.desktop.reverse .name {
  padding: 0 10px 0 20px;
}
</style>
