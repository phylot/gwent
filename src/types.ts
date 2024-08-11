interface Award {
  active: boolean
  count?: number
  description: string
  icon: string
  name: string
  targetCount?: number
}

interface Awards {
  cardmaster: Award
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
  bondName?: string
  defaultValue?: number
  description?: string
  faction: string
  hero?: boolean
  id: string
  image: string
  imageUrl?: string
  musterName?: string
  name?: string
  replacedById?: string,
  type: string
  typeIcon?: string
  value?: number
}

interface CardCollection {
  british: { collection: Card[]; deck: Card[] }
  french: { collection: Card[]; deck: Card[] }
}

interface LeaderCardCollection {
  british: { collection: Card[]; selected: Card }
  french: { collection: Card[]; selected: Card }
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

export {
  type Award,
  type Awards,
  type Card,
  type CardCollection,
  type LeaderCardCollection,
  type RoundTotal,
  type RowFlag
}
