interface Card {
  ability?: string
  active: boolean
  defaultValue: number
  description: string
  faction?: string
  hero?: boolean
  image: string
  name: string
  type: string
  value: number
}

const allCards: Card[] = [
  { ability: 'bond', active: false, defaultValue: 1, description: "Description", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", value: 1 },
  { ability: 'bond', active: false, defaultValue: 4, description: "Description", faction: 'br', image: "br-rifle.jpg", name: "Rifleman", type: "ranged", value: 4 },
  { ability: 'boost', active: false, defaultValue: 5, description: "Description", faction: 'br', image: "br-sergent.jpg", name: "Sergent", type: "ranged", value: 5 },
  { active: false, defaultValue: 6, description: "Description", faction: 'br', image: "br-cavalry.jpg", name: "Cavalry Rider", type: "close", value: 6 },
  { ability: 'bond', active: false, defaultValue: 8, description: "Description", faction: 'br', image: "br-canon.jpg", name: "Cannon", type: "siege", value: 8 },
  { ability: 'spy', active: false, defaultValue: 4, description: "Description", faction: 'br', image: "br-hogan.jpg", name: "Michael Hogan", type: "close", value: 4 },
  { ability: 'close_scorch', active: false, defaultValue: 10, description: "Description", faction: 'br', hero: true, image: "br-harper.jpg", name: "Pat Harper", type: "close", value: 10 },
  { ability: 'scorch', active: false, defaultValue: 15, description: "Description", faction: 'br', hero: true, image: "br-sharpe.jpg", name: "Richard Sharpe", type: "ranged", value: 15 },
  // { ability: 'double', active: false, defaultValue: 0, description: "Description", image: "horn.jpg", name: "Commander's Horn", type: "special", value: 0 },
  { ability: 'dummy', active: false, defaultValue: 0, description: "Description", image: "dummy.jpg", name: "Dummy", type: "special", value: 0 },
  { ability: 'rain', active: false, defaultValue: 0, description: "Description", image: "rain.png", name: "Torrential Rain", type: "special", value: 0 },
  { ability: 'scorch', active: false, defaultValue: 0, description: "Description", image: "scorch.png", name: "Scorch", type: "special", value: 0 },
  { ability: 'clear', active: false, defaultValue: 0, description: "Description", image: "clear.png", name: "Clear Weather", type: "special", value: 0 }
]

// const dummyOpponentHand: Card[] = [
//
// ]

const dummyPlayerCards: Card[][] = [
  [
    { ability: 'bond', active: false, defaultValue: 1, description: "Description", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", value: 1 },
    { ability: 'bond', active: false, defaultValue: 1, description: "Description", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", value: 1 },
    { ability: 'bond', active: false, defaultValue: 1, description: "Description", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", value: 1 },
    { ability: 'boost', active: false, defaultValue: 5, description: "Description", faction: 'br', image: "br-sergent.jpg", name: "Sergent", type: "ranged", value: 5 },
    { active: false, defaultValue: 6, description: "Description", faction: 'br', image: "br-cavalry.jpg", name: "Cavalry Rider", type: "close", value: 6 },
    { active: false, defaultValue: 6, description: "Description", faction: 'br', image: "br-cavalry.jpg", name: "Cavalry Rider", type: "close", value: 6 },
  ],
  [
    { ability: 'bond', active: false, defaultValue: 4, description: "Description", faction: 'br', image: "br-rifle.jpg", name: "Rifleman", type: "ranged", value: 4 },
    { ability: 'bond', active: false, defaultValue: 4, description: "Description", faction: 'br', image: "br-rifle.jpg", name: "Rifleman", type: "ranged", value: 4 },
    { ability: 'bond', active: false, defaultValue: 4, description: "Description", faction: 'br', image: "br-rifle.jpg", name: "Rifleman", type: "ranged", value: 4 },
    { ability: 'bond', active: false, defaultValue: 4, description: "Description", faction: 'br', image: "br-rifle.jpg", name: "Rifleman", type: "ranged", value: 4 },
  ],
  [
    { ability: 'bond', active: false, defaultValue: 8, description: "Description", faction: 'br', image: "br-canon.jpg", name: "Cannon", type: "siege", value: 8 },
    { ability: 'bond', active: false, defaultValue: 8, description: "Description", faction: 'br', image: "br-canon.jpg", name: "Cannon", type: "siege", value: 8 },
  ]
]

const dummyOpponentCards: Card[][] = [
  [
    { ability: 'bond', active: false, defaultValue: 1, description: "Description", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", value: 1 },
    { ability: 'bond', active: false, defaultValue: 1, description: "Description", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", value: 1 },
    { ability: 'bond', active: false, defaultValue: 1, description: "Description", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", value: 1 },
    { ability: 'bond', active: false, defaultValue: 1, description: "Description", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", value: 1 },
    { ability: 'bond', active: false, defaultValue: 1, description: "Description", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", value: 1 },
    { ability: 'bond', active: false, defaultValue: 1, description: "Description", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", value: 1 },
    { active: false, defaultValue: 6, description: "Description", faction: 'br', image: "br-cavalry.jpg", name: "Cavalry Rider", type: "close", value: 6 },
    { active: false, defaultValue: 6, description: "Description", faction: 'br', image: "br-cavalry.jpg", name: "Cavalry Rider", type: "close", value: 6 },
    { active: false, defaultValue: 6, description: "Description", faction: 'br', image: "br-cavalry.jpg", name: "Cavalry Rider", type: "close", value: 6 },
  ],
  [
    { ability: 'dummy', active: false, defaultValue: 0, description: "Description", image: "dummy.jpg", name: "Dummy", type: "special", value: 0 },
    { ability: 'dummy', active: false, defaultValue: 0, description: "Description", image: "dummy.jpg", name: "Dummy", type: "special", value: 0 },
  ],
  [
    { ability: 'bond', active: false, defaultValue: 8, description: "Description", faction: 'br', image: "br-canon.jpg", name: "Cannon", type: "siege", value: 8 },
    { ability: 'bond', active: false, defaultValue: 8, description: "Description", faction: 'br', image: "br-canon.jpg", name: "Cannon", type: "siege", value: 8 },
    { ability: 'bond', active: false, defaultValue: 8, description: "Description", faction: 'br', image: "br-canon.jpg", name: "Cannon", type: "siege", value: 8 },
  ]
]

const dummySpecialCards: Card[] = [
  // { ability: 'rain', active: false, defaultValue: 0, description: "Description", image: "rain.png", name: "Torrential Rain", type: "special", value: 0 },
  // { ability: 'scorch', active: false, defaultValue: 0, description: "Description", image: "scorch.png", name: "Scorch", type: "special", value: 0 },
  // { ability: 'clear', active: false, defaultValue: 0, description: "Description", image: "clear.png", name: "Clear Weather", type: "special", value: 0 },
]

const emptyCardRow: Card[] = []

export {
  type Card,
  allCards,
  // dummyOpponentHand,
  dummyPlayerCards,
  dummyOpponentCards,
  dummySpecialCards,
  emptyCardRow
}
