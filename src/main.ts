import { createApp } from 'vue'
// import { createPinia } from 'pinia'
// import router from './router'
import App from './App.vue'

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  FaChevronLeft,
  FaChevronRight,
  FaLayerGroup,
  FaPlus,
  GiBroadsword,
  GiCatapult,
  GiCrossbow,
  GiHeartPlus,
  GiHeavyRain,
  GiHuntingHorn,
  GiPocketBow,
  GiRoundStar,
  GiScarecrow,
  GiSunflower,
  HiChevronLeft,
  HiChevronRight,
  HiSolidEye,
  IoSkull,
  MdHandshakeOutlined
} from 'oh-vue-icons/icons'

import './assets/main.css'

addIcons(
  FaChevronLeft,
  FaChevronRight,
  FaLayerGroup,
  FaPlus,
  GiBroadsword,
  GiCatapult,
  GiCrossbow,
  GiHeartPlus,
  GiHeavyRain,
  GiHuntingHorn,
  GiPocketBow,
  GiRoundStar,
  GiScarecrow,
  GiSunflower,
  HiChevronLeft,
  HiChevronRight,
  HiSolidEye,
  IoSkull,
  MdHandshakeOutlined
)

const app = createApp(App)
// app.use(createPinia())
// app.use(router)
app.component('v-icon', OhVueIcon)
app.mount('#app')
