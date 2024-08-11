import { createApp } from 'vue'
// import { createPinia } from 'pinia'
// import router from './router'
import App from './App.vue'

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  BiSnow3,
  FaChevronLeft,
  FaChevronRight,
  FaDrum,
  FaLayerGroup,
  FaPeopleArrows,
  FaPlus,
  FaRegularSave,
  GiBrain,
  GiBroadsword,
  GiBrokenShield,
  GiCardExchange,
  GiCatapult,
  GiCrossbow,
  GiCrown,
  GiCrownCoin,
  GiDaemonSkull,
  GiHeartPlus,
  GiHeavyRain,
  GiHood,
  GiMuscleUp,
  GiPocketBow,
  GiRoundStar,
  GiSandsOfTime,
  GiScarecrow,
  GiSpy,
  GiStarMedal,
  GiSunflower,
  GiTwoShadows,
  HiChevronLeft,
  HiChevronRight,
  HiSolidEye,
  IoSkull,
  LaCogSolid,
  LaSpinnerSolid,
  LaStarOfLifeSolid,
  MdTouchappRound,
  FaFlag,
  RiFoggyLine,
} from 'oh-vue-icons/icons'

import './assets/main.css'

addIcons(
  BiSnow3,
  FaChevronLeft,
  FaChevronRight,
  FaDrum,
  FaLayerGroup,
  FaPeopleArrows,
  FaPlus,
  FaRegularSave,
  GiBrain,
  GiBroadsword,
  GiBrokenShield,
  GiCardExchange,
  GiCatapult,
  GiCrossbow,
  GiCrown,
  GiCrownCoin,
  GiDaemonSkull,
  GiHeartPlus,
  GiHeavyRain,
  GiHood,
  GiMuscleUp,
  GiPocketBow,
  GiRoundStar,
  GiSandsOfTime,
  GiScarecrow,
  GiSpy,
  GiStarMedal,
  GiSunflower,
  GiTwoShadows,
  HiChevronLeft,
  HiChevronRight,
  HiSolidEye,
  IoSkull,
  LaCogSolid,
  LaSpinnerSolid,
  LaStarOfLifeSolid,
  MdTouchappRound,
  FaFlag,
  RiFoggyLine,
)

const app = createApp(App)
// app.use(createPinia())
// app.use(router)
app.component('v-icon', OhVueIcon)
app.mount('#app')
