import { createApp } from 'vue'
// import { createPinia } from 'pinia'
// import router from './router'
import App from './App.vue'

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
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
  FaFlag,
} from 'oh-vue-icons/icons'

import './assets/main.css'
import './assets/base.css'

addIcons(
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
  FaFlag,
)

const app = createApp(App)
// app.use(createPinia())
// app.use(router)
app.component('v-icon', OhVueIcon)
app.mount('#app')
