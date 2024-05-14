import type { Card, RowFlag } from "@/types";

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
  defaultPlayerRowFlagArrays,
  defaultOpponentRowFlagArrays,
  emptyCardArray,
  emptyPlayerBoardArrays,
  emptyOpponentBoardArrays,
}
