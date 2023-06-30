interface Card {
  ability?: string
  abilityIcon?: string
  active: boolean
  defaultValue: number
  description?: string
  faction?: string
  hero?: boolean
  image: string
  name: string
  type: string
  typeIcon?: string
  value: number
}

const allCards: Card[] = [
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 4, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', image: "br-rifle.jpg", name: "Rifleman", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
  { ability: 'boost', abilityIcon: "gi-hunting-horn", active: false, defaultValue: 3, description: "<strong>Commander's Horn:</strong> Doubles the strength of all unit cards in that row. Limited to 1 per row.", faction: 'br', image: "br-sergent.jpg", name: "Sergent", type: "close", typeIcon: "gi-broadsword", value: 3 },
  { active: false, defaultValue: 6, faction: 'br', image: "br-cavalry.jpg", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 6 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined",  active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
  { ability: 'heal', abilityIcon: "gi-heart-plus", active: false, defaultValue: 4, description: "<strong>Medic:</strong> Choose one card from your discard pile and play it instantly (no Heroes or Special Cards).", faction: 'br', image: "br-harris.jpg", name: "Harris", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
  { ability: 'ranged_scorch', abilityIcon: "io-skull", active: false, defaultValue: 7, description: "<strong>Scorch - Ranged:</strong> Destroy your enemy's strongest <strong>Ranged Combat</strong> unit(s) if the combined strength of their <strong>Ranged Combat</strong> units is 10 or more.", faction: 'br', hero: true, image: "br-hagman.jpg", name: "Daniel Hagman", type: "ranged", typeIcon: "gi-crossbow", value: 7 },
  { ability: 'close_scorch', abilityIcon: "io-skull", active: false, defaultValue: 10, description: "<strong>Scorch - Close Combat:</strong> Destroy your enemy's strongest <strong>Close Combat</strong> unit(s) if the combined strength of their <strong>Close Combat</strong> units is 10 or more.", faction: 'br', hero: true, image: "br-harper.jpg", name: "Pat Harper", type: "close", typeIcon: "gi-broadsword", value: 10 },
  { ability: 'boost', abilityIcon: "gi-hunting-horn", active: false, defaultValue: 15, description: "<strong>Commander's Horn:</strong> Doubles the strength of all unit cards in that row. Limited to 1 per row.", faction: 'br', hero: true, image: "br-sharpe.jpg", name: "Richard Sharpe", type: "ranged", typeIcon: "gi-crossbow", value: 15 },
  { ability: 'spy', abilityIcon: "hi-solid-eye", active: false, defaultValue: 4, description: "<strong>Spy:</strong> Place on your opponent's battlefield (counts towards opponent's total) and draw 2 cards from your deck.", faction: 'br', image: "br-hogan.jpg", name: "Michael Hogan", type: "close", typeIcon: "gi-broadsword", value: 4 },
  { ability: 'double', abilityIcon: "gi-hunting-horn", active: false, defaultValue: 0, description: "Doubles the strength of all unit cards in that row. Limited to 1 per row.", image: "horn.png", name: "Commander's Horn", type: "special", value: 0 },
  { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
  { ability: 'rain', abilityIcon: "gi-heavy-rain", active: false, defaultValue: 0, description: "Sets the strength of all <strong>Siege Combat</strong> cards to 1 for both players.", image: "rain.png", name: "Torrential Rain", type: "special", value: 0 },
  { ability: 'scorch', abilityIcon: "io-skull", active: false, defaultValue: 0, description: "Discards after playing. Kills the strongest card(s) on the battlefield.", image: "scorch.png", name: "Scorch", type: "special", value: 0 },
  { ability: 'clear', abilityIcon: "gi-sunflower", active: false, defaultValue: 0, description: "Removes all <strong>Weather Card</strong> (Biting Frost, Impenetrable Fog and Torrential Rain) effects.", image: "clear.png", name: "Clear Weather", type: "special", value: 0 }
]

// const dummyOpponentHand: Card[] = [
//
// ]

const dummyPlayerCards: Card[][] = [
  [
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'boost', abilityIcon: "gi-hunting-horn",  active: false, defaultValue: 3, description: "<strong>Commander's Horn:</strong> Doubles the strength of all unit cards in that row. Limited to 1 per row.", faction: 'br', image: "br-sergent.jpg", name: "Sergent", type: "ranged", typeIcon: "gi-crossbow", value: 3 },
    { active: false, defaultValue: 6, faction: 'br', image: "br-cavalry.jpg", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 6 },
    { active: false, defaultValue: 6, faction: 'br', image: "br-cavalry.jpg", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 6 },
  ],
  [
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 4, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', image: "br-rifle.jpg", name: "Rifleman", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 4, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', image: "br-rifle.jpg", name: "Rifleman", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 4, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', image: "br-rifle.jpg", name: "Rifleman", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 4, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', image: "br-rifle.jpg", name: "Rifleman", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
  ],
  [
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
  ]
]

const dummyOpponentCards: Card[][] = [
  [
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { active: false, defaultValue: 6, faction: 'br', image: "br-cavalry.jpg", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 6 },
    { active: false, defaultValue: 6, faction: 'br', image: "br-cavalry.jpg", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 6 },
    { active: false, defaultValue: 6, faction: 'br', image: "br-cavalry.jpg", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 6 },
  ],
  [
    { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
    { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
  ],
  [
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
  ]
]

const dummySpecialCards: Card[] = [
  { ability: 'rain', abilityIcon: "gi-heavy-rain", active: false, defaultValue: 0, description: "Sets the strength of all <strong>Siege Combat</strong> cards to 1 for both players.", image: "rain.png", name: "Torrential Rain", type: "special", value: 0 },
  { ability: 'scorch', abilityIcon: "io-skull", active: false, defaultValue: 0, description: "Discards after playing. Kills the strongest card(s) on the battlefield.", image: "scorch.png", name: "Scorch", type: "special", value: 0 },
  { ability: 'clear', abilityIcon: "gi-sunflower", active: false, defaultValue: 0, description: "Removes all <strong>Weather Card</strong> (Biting Frost, Impenetrable Fog and Torrential Rain) effects.", image: "clear.png", name: "Clear Weather", type: "special", value: 0 },
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
