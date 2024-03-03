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
  FaPlus,
  GiBroadsword,
  GiBrokenShield,
  GiCatapult,
  GiCrossbow,
  GiCrownCoin,
  GiHeartPlus,
  GiHeavyRain,
  GiPocketBow,
  GiRoundStar,
  GiSandsOfTime,
  GiScarecrow,
  GiSunflower,
  GiTwoShadows,
  HiChevronLeft,
  HiChevronRight,
  HiSolidEye,
  IoSkull,
  MdHandshakeOutlined,
  MdTouchappRound,
  FaFlag,
  RiFoggyLine,
} from 'oh-vue-icons/icons'

import './assets/main.css'
import './assets/base.css'

addIcons(
  BiSnow3,
  FaChevronLeft,
  FaChevronRight,
  FaDrum,
  FaLayerGroup,
  FaPlus,
  GiBroadsword,
  GiBrokenShield,
  GiCatapult,
  GiCrossbow,
  GiCrownCoin,
  GiHeartPlus,
  GiHeavyRain,
  GiPocketBow,
  GiRoundStar,
  GiSandsOfTime,
  GiScarecrow,
  GiSunflower,
  GiTwoShadows,
  HiChevronLeft,
  HiChevronRight,
  HiSolidEye,
  IoSkull,
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
