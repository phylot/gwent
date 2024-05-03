interface Award {
  active: boolean
  count: number
  description: string
  icon: string
  name: string
  targetCount: number
}

interface Awards {
  fieldmarshal: Award
  heavyweight: Award
  spymaster: Award
  tactician: Award
  tyrant: Award
}

interface Card {
  ability?: string
  abilityIcon?: string
  active: boolean
  animationName?: string
  defaultValue?: number
  description?: string
  faction: string
  hero?: boolean
  id: string
  image: string
  imageUrl?: string
  musterName?: string
  name?: string
  type: string
  typeIcon?: string
  value?: number
}

interface RoundTotal {
  isWin: boolean
  value: number
}

interface RowFlag {
  cardSelect: boolean
  double: boolean
  doubleIcon: string
  rowSelect: boolean
  weather: boolean
  weatherIcon: string
}

export { type Award, type Awards, type Card, type RoundTotal, type RowFlag }
