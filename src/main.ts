import { createApp } from 'vue'
// import { createPinia } from 'pinia'
// import router from './router'
import App from './App.vue'

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  BiIncognito,
  BiSnow3,
  FaChevronLeft,
  FaChevronRight,
  FaDrum,
  FaLayerGroup,
  FaPlus,
  FaRegularSave,
  GiBrain,
  GiBroadsword,
  GiBrokenShield,
  GiCatapult,
  GiCrossbow,
  GiCrownCoin,
  GiDaemonSkull,
  GiHeartPlus,
  GiHeavyRain,
  GiMuscleUp,
  GiPocketBow,
  GiRank3,
  GiRoundStar,
  GiSandsOfTime,
  GiScarecrow,
  GiSunflower,
  GiTwoShadows,
  HiChevronLeft,
  HiChevronRight,
  HiSolidEye,
  IoSkull,
  LaSpinnerSolid,
  MdHandshakeOutlined,
  MdTouchappRound,
  FaFlag,
  RiFoggyLine,
} from 'oh-vue-icons/icons'

import './assets/main.css'

addIcons(
  BiIncognito,
  BiSnow3,
  FaChevronLeft,
  FaChevronRight,
  FaDrum,
  FaLayerGroup,
  FaPlus,
  FaRegularSave,
  GiBrain,
  GiBroadsword,
  GiBrokenShield,
  GiCatapult,
  GiCrossbow,
  GiCrownCoin,
  GiDaemonSkull,
  GiHeartPlus,
  GiHeavyRain,
  GiMuscleUp,
  GiPocketBow,
  GiRank3,
  GiRoundStar,
  GiSandsOfTime,
  GiScarecrow,
  GiSunflower,
  GiTwoShadows,
  HiChevronLeft,
  HiChevronRight,
  HiSolidEye,
  IoSkull,
  LaSpinnerSolid,
  MdHandshakeOutlined,
  MdTouchappRound,
  FaFlag,
  RiFoggyLine,
)

const app = createApp(App)
// app.use(createPinia())
// app.use(router)
app.component('v-icon', OhVueIcon)
app.mount('#app')
