import type { Awards, Card, RowFlag } from "@/types";

const defaultPlayerAwards: Awards = {
  fieldmarshal: { active: true, count: 0, icon: "gi-rank-3", name: "Field Marshal", targetCount: 140 },
  heavyweight: { active: true, count: 0, icon: "gi-muscle-up", name: "Heavyweight", targetCount: 100 },
  spymaster: { active: true, count: 0, icon: "bi-incognito", name: "Spy Master", targetCount: 4 },
  tactician: { active: true, count: 0, icon: "gi-brain", name: "Tactician", targetCount: 8 },
  tyrant: { active: true, count: 0, icon: "gi-daemon-skull", name: "Tyrant", targetCount: 7 },
}

const defaultOpponentAwards: Awards = {
  fieldmarshal: { active: true, count: 0, icon: "gi-rank-3", name: "Field Marshal", targetCount: 140 },
  heavyweight: { active: true, count: 0, icon: "gi-muscle-up", name: "Heavyweight", targetCount: 100 },
  spymaster: { active: true, count: 0, icon: "bi-incognito", name: "Spy Master", targetCount: 4 },
  tactician: { active: true, count: 0, icon: "gi-brain", name: "Tactician", targetCount: 8 },
  tyrant: { active: true, count: 0, icon: "gi-daemon-skull", name: "Tyrant", targetCount: 7 },
}

const defaultPlayerRowFlagArrays: RowFlag[] = [
  { cardSelect: false, double: false, doubleIcon: 'fa-drum', rowSelect: false, weather: false, weatherIcon: "bi-snow3", },
  { cardSelect: false, double: false, doubleIcon: 'fa-drum', rowSelect: false, weather: false, weatherIcon: "ri-foggy-line", },
  { cardSelect: false, double: false, doubleIcon: 'fa-drum', rowSelect: false, weather: false, weatherIcon: "gi-heavy-rain", },
]

const defaultOpponentRowFlagArrays: RowFlag[] = [
  { cardSelect: false, double: false, doubleIcon: 'fa-drum', rowSelect: false, weather: false, weatherIcon: "bi-snow3", },
  { cardSelect: false, double: false, doubleIcon: 'fa-drum', rowSelect: false, weather: false, weatherIcon: "ri-foggy-line", },
  { cardSelect: false, double: false, doubleIcon: 'fa-drum', rowSelect: false, weather: false, weatherIcon: "gi-heavy-rain", },
]

const emptyCardArray: Card[] = []

const emptyPlayerBoardArrays: Card[][] = [[], [], []]

const emptyOpponentBoardArrays: Card[][] = [[], [], []]

export {
  defaultPlayerAwards,
  defaultOpponentAwards,
  defaultPlayerRowFlagArrays,
  defaultOpponentRowFlagArrays,
  emptyCardArray,
  emptyPlayerBoardArrays,
  emptyOpponentBoardArrays,
}