const dummyPlayerHand: {
  ability?: string
  active: boolean
  description: string
  faction?: string
  image: string
  name: string
  type: string
  value: number
}[] = [
  { ability: 'bond', active: false, description: "Description", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", value: 1 },
  { active: false, description: "Description", faction: 'br', image: "br-cavalry.jpg", name: "Cavalry Rider", type: "close", value: 6 },
  { ability: 'bond', active: false, description: "Description", faction: 'br', image: "br-rifle.jpg", name: "Rifleman", type: "ranged", value: 4 },
  { ability: 'boost', active: false, description: "Description", faction: 'br', image: "br-sergent.jpg", name: "Sergent", type: "ranged", value: 5 },
  { ability: 'bond', active: false, description: "Description", faction: 'br', image: "br-canon.jpg", name: "Cannon", type: "siege", value: 8 },
  { ability: 'close_scorch', active: false, description: "Description", faction: 'br', image: "br-harper.jpg", name: "Pat Harper", type: "hero", value: 10 },
  { ability: 'hero', active: false, description: "Description", faction: 'br', image: "br-sharpe.jpg", name: "Richard Sharpe", type: "hero", value: 15 },
  { ability: 'spy', active: false, description: "Description", faction: 'br', image: "br-hogan.jpg", name: "Michael Hogan", type: "close", value: 4 },
  // { ability: 'double', active: false, description: "Description", image: "horn.jpg", name: "Commander's Horn", type: "special", value: 0 },
  { ability: 'dummy', active: false, description: "Description", image: "dummy.jpg", name: "Dummy", type: "special", value: 0 },
  { ability: 'rain', active: false, description: "Description", image: "rain.png", name: "Torrential Rain", type: "special", value: 0 },
  { ability: 'clear', active: false, description: "Description", image: "clear.png", name: "Clear Weather", type: "special", value: 0 },
  { ability: 'scorch', active: false, description: "Description", image: "scorch.png", name: "Scorch", type: "special", value: 0 }
]

// const dummyOpponentHand: {
//   ability?: string
//   active: boolean
//   description: string
//   faction?: string
//   image: string
//   name: string
//   type: string
//   value?: number
// }[] = [
//
// ]

const dummyPlayerCards: {
  ability?: string
  active: boolean
  description: string
  faction?: string
  image: string
  name: string
  type: string
  value: number
}[][] = [
  [
    { ability: 'bond', active: false, description: "Description", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", value: 1 },
    { ability: 'bond', active: false, description: "Description", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", value: 1 },
    { ability: 'bond', active: false, description: "Description", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", value: 1 },
    { ability: 'boost', active: false, description: "Description", faction: 'br', image: "br-sergent.jpg", name: "Sergent", type: "ranged", value: 5 },
    { active: false, description: "Description", faction: 'br', image: "br-cavalry.jpg", name: "Cavalry Rider", type: "close", value: 6 },
    { active: false, description: "Description", faction: 'br', image: "br-cavalry.jpg", name: "Cavalry Rider", type: "close", value: 6 },
  ],
  [
    { ability: 'bond', active: false, description: "Description", faction: 'br', image: "br-rifle.jpg", name: "Rifleman", type: "ranged", value: 4 },
    { ability: 'bond', active: false, description: "Description", faction: 'br', image: "br-rifle.jpg", name: "Rifleman", type: "ranged", value: 4 },
    { ability: 'bond', active: false, description: "Description", faction: 'br', image: "br-rifle.jpg", name: "Rifleman", type: "ranged", value: 4 },
    { ability: 'bond', active: false, description: "Description", faction: 'br', image: "br-rifle.jpg", name: "Rifleman", type: "ranged", value: 4 },
  ],
  [
    { ability: 'bond', active: false, description: "Description", faction: 'br', image: "br-canon.jpg", name: "Cannon", type: "siege", value: 8 },
    { ability: 'bond', active: false, description: "Description", faction: 'br', image: "br-canon.jpg", name: "Cannon", type: "siege", value: 8 },
  ]
]

const dummyOpponentCards: {
  ability?: string
  active: boolean
  description: string
  faction?: string
  image: string
  name: string
  type: string
  value: number
}[][] = [
  [
    { ability: 'bond', active: false, description: "Description", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", value: 1 },
    { ability: 'bond', active: false, description: "Description", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", value: 1 },
    { ability: 'bond', active: false, description: "Description", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", value: 1 },
    { ability: 'bond', active: false, description: "Description", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", value: 1 },
    { ability: 'bond', active: false, description: "Description", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", value: 1 },
    { ability: 'bond', active: false, description: "Description", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", value: 1 },
    { active: false, description: "Description", faction: 'br', image: "br-cavalry.jpg", name: "Cavalry Rider", type: "close", value: 6 },
    { active: false, description: "Description", faction: 'br', image: "br-cavalry.jpg", name: "Cavalry Rider", type: "close", value: 6 },
    { active: false, description: "Description", faction: 'br', image: "br-cavalry.jpg", name: "Cavalry Rider", type: "close", value: 6 },
  ],
  [
    { ability: 'dummy', active: false, description: "Description", image: "dummy.jpg", name: "Dummy", type: "special", value: 0 },
    { ability: 'dummy', active: false, description: "Description", image: "dummy.jpg", name: "Dummy", type: "special", value: 0 },
  ],
  [
    { ability: 'bond', active: false, description: "Description", faction: 'br', image: "br-canon.jpg", name: "Cannon", type: "siege", value: 8 },
    { ability: 'bond', active: false, description: "Description", faction: 'br', image: "br-canon.jpg", name: "Cannon", type: "siege", value: 8 },
    { ability: 'bond', active: false, description: "Description", faction: 'br', image: "br-canon.jpg", name: "Cannon", type: "siege", value: 8 },
  ]
]

const emptyCardRow: { active: boolean; value: number }[] = []

export {
  dummyPlayerHand,
  // dummyOpponentHand,
  dummyPlayerCards,
  dummyOpponentCards,
  emptyCardRow
}
