interface Card {
  ability?: string
  abilityIcon?: string
  active: boolean
  animationName?: string
  defaultValue: number
  description?: string
  faction?: string
  hero?: boolean
  id: string
  image: string
  name?: string
  type: string
  typeIcon?: string
  value: number
}

const allOpponentCards: Card[] = [
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "101", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "102", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "103", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "104", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
  { ability: 'boost', abilityIcon: "fa-plus", active: false, defaultValue: 3, description: "<strong>Morale Boost:</strong> Adds + 1 to all units in the row (excluding itself).", faction: 'br', image: "br-sergent.jpg", id: "105", name: "Sergent", type: "close", typeIcon: "gi-broadsword", value: 3 },
  { ability: 'boost', abilityIcon: "fa-plus", active: false, defaultValue: 3, description: "<strong>Morale Boost:</strong> Adds + 1 to all units in the row (excluding itself).", faction: 'br', image: "br-sergent.jpg", id: "106", name: "Sergent", type: "close", typeIcon: "gi-broadsword", value: 3 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 4, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "107", image: "br-rifle.jpg", name: "Rifleman", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 4, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "108", image: "br-rifle.jpg", name: "Rifleman", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 4, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "109", image: "br-rifle.jpg", name: "Rifleman", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
  { active: false, defaultValue: 6, faction: 'br', image: "br-cavalry.jpg", id: "110", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 6 },
  { active: false, defaultValue: 6, faction: 'br', image: "br-cavalry.jpg", id: "111", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 6 },
  { active: false, defaultValue: 6, faction: 'br', image: "br-cavalry.jpg", id: "112", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 6 },
  { active: false, defaultValue: 6, faction: 'br', image: "br-cavalry.jpg", id: "113", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 6 },
  { ability: 'heal', abilityIcon: "gi-heart-plus", active: false, defaultValue: 4, description: "<strong>Medic:</strong> Choose one card from your discard pile and play it instantly (no Heroes or Special Cards).", faction: 'br', id: "114", image: "br-harris.jpg", name: "Harris", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
  { ability: 'ranged_scorch', abilityIcon: "io-skull", active: false, defaultValue: 7, description: "<strong>Scorch - Ranged:</strong> Destroy your enemy's strongest <strong>Ranged Combat</strong> unit(s) if the combined strength of their <strong>Ranged Combat</strong> units is 10 or more.", faction: 'br', id: "115", image: "br-hagman.jpg", name: "Daniel Hagman", type: "ranged", typeIcon: "gi-crossbow", value: 7 },
  { ability: 'close_scorch', abilityIcon: "io-skull", active: false, defaultValue: 10, description: "<strong>Scorch - Close Combat:</strong> Destroy your enemy's strongest <strong>Close Combat</strong> unit(s) if the combined strength of their <strong>Close Combat</strong> units is 10 or more.", faction: 'br', hero: true, id: "116", image: "br-harper.jpg", name: "Patrick Harper", type: "close", typeIcon: "gi-broadsword", value: 10 },
  { ability: 'double', abilityIcon: "gi-hunting-horn", active: false, defaultValue: 15, description: "<strong>Commander's Horn:</strong> Doubles the strength of all unit cards in that row. Limited to 1 per row.", faction: 'br', hero: true, id: "117",  image: "br-sharpe.jpg", name: "Richard Sharpe", type: "ranged", typeIcon: "gi-crossbow", value: 15 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "118",  image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "119",  image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "120",  image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
  { ability: 'spy', abilityIcon: "hi-solid-eye", active: false, defaultValue: 4, description: "<strong>Spy:</strong> Place on your opponent's battlefield (counts towards opponent's total) and draw 2 cards from your deck.", faction: 'br', id: "121", image: "br-hogan.jpg", name: "Michael Hogan", type: "close", typeIcon: "gi-broadsword", value: 4 },
  // { ability: 'double', abilityIcon: "gi-hunting-horn", active: false, defaultValue: 0, description: "Doubles the strength of all unit cards in that row. Limited to 1 per row.", id: "122" ,image: "horn.png", name: "Commander's Horn", type: "special", value: 0 },
  // { ability: 'double', abilityIcon: "gi-hunting-horn", active: false, defaultValue: 0, description: "Doubles the strength of all unit cards in that row. Limited to 1 per row.", id: "123", image: "horn.png", name: "Commander's Horn", type: "special", value: 0 },
  // { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", id: "124", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
  // { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", id: "125", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
  // { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", id: "126", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
  // { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", id: "127", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
  // { ability: 'rain', abilityIcon: "gi-heavy-rain", active: false, defaultValue: 0, description: "Sets the strength of all <strong>Siege Combat</strong> cards to 1 for both players.", id: "128", image: "rain.png", name: "Torrential Rain", type: "special", value: 0 },
  // { ability: 'scorch', abilityIcon: "io-skull", active: false, defaultValue: 0, description: "Discards after playing. Kills the strongest card(s) on the battlefield.", id: "129", image: "scorch.png", name: "Scorch", type: "special", value: 0 },
  // { ability: 'clear', abilityIcon: "gi-sunflower", active: false, defaultValue: 0, description: "Removes all <strong>Weather Card</strong> (Biting Frost, Impenetrable Fog and Torrential Rain) effects.", id: "130", image: "clear.png", name: "Clear Weather", type: "special", value: 0 }
]

const allPlayerCards: Card[] = [
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "001", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "002", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "003", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "004", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
  { ability: 'boost', abilityIcon: "fa-plus", active: false, defaultValue: 3, description: "<strong>Morale Boost:</strong> Adds + 1 to all units in the row (excluding itself).", faction: 'br', image: "br-sergent.jpg", id: "005", name: "Sergent", type: "close", typeIcon: "gi-broadsword", value: 3 },
  { ability: 'boost', abilityIcon: "fa-plus", active: false, defaultValue: 3, description: "<strong>Morale Boost:</strong> Adds + 1 to all units in the row (excluding itself).", faction: 'br', image: "br-sergent.jpg", id: "006", name: "Sergent", type: "close", typeIcon: "gi-broadsword", value: 3 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 4, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "007", image: "br-rifle.jpg", name: "Rifleman", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 4, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "008", image: "br-rifle.jpg", name: "Rifleman", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 4, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "009", image: "br-rifle.jpg", name: "Rifleman", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
  { active: false, defaultValue: 6, faction: 'br', image: "br-cavalry.jpg", id: "010", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 6 },
  { active: false, defaultValue: 6, faction: 'br', image: "br-cavalry.jpg", id: "011", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 6 },
  { active: false, defaultValue: 6, faction: 'br', image: "br-cavalry.jpg", id: "012", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 6 },
  { active: false, defaultValue: 6, faction: 'br', image: "br-cavalry.jpg", id: "013", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 6 },
  { ability: 'heal', abilityIcon: "gi-heart-plus", active: false, defaultValue: 4, description: "<strong>Medic:</strong> Choose one card from your discard pile and play it instantly (no Heroes or Special Cards).", faction: 'br', id: "014", image: "br-harris.jpg", name: "Harris", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
  { ability: 'ranged_scorch', abilityIcon: "io-skull", active: false, defaultValue: 7, description: "<strong>Scorch - Ranged:</strong> Destroy your enemy's strongest <strong>Ranged Combat</strong> unit(s) if the combined strength of their <strong>Ranged Combat</strong> units is 10 or more.", faction: 'br', id: "015", image: "br-hagman.jpg", name: "Daniel Hagman", type: "ranged", typeIcon: "gi-crossbow", value: 7 },
  { ability: 'close_scorch', abilityIcon: "io-skull", active: false, defaultValue: 10, description: "<strong>Scorch - Close Combat:</strong> Destroy your enemy's strongest <strong>Close Combat</strong> unit(s) if the combined strength of their <strong>Close Combat</strong> units is 10 or more.", faction: 'br', hero: true, id: "016", image: "br-harper.jpg", name: "Patrick Harper", type: "close", typeIcon: "gi-broadsword", value: 10 },
  { ability: 'double', abilityIcon: "gi-hunting-horn", active: false, defaultValue: 15, description: "<strong>Commander's Horn:</strong> Doubles the strength of all unit cards in that row. Limited to 1 per row.", faction: 'br', hero: true, id: "017",  image: "br-sharpe.jpg", name: "Richard Sharpe", type: "ranged", typeIcon: "gi-crossbow", value: 15 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "018",  image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "019",  image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "020",  image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
  { ability: 'spy', abilityIcon: "hi-solid-eye", active: false, defaultValue: 4, description: "<strong>Spy:</strong> Place on your opponent's battlefield (counts towards opponent's total) and draw 2 cards from your deck.", faction: 'br', id: "021", image: "br-hogan.jpg", name: "Michael Hogan", type: "close", typeIcon: "gi-broadsword", value: 4 },
  // { ability: 'double', abilityIcon: "gi-hunting-horn", active: false, defaultValue: 0, description: "Doubles the strength of all unit cards in that row. Limited to 1 per row.", id: "022", image: "horn.png", name: "Commander's Horn", type: "special", value: 0 },
  // { ability: 'double', abilityIcon: "gi-hunting-horn", active: false, defaultValue: 0, description: "Doubles the strength of all unit cards in that row. Limited to 1 per row.", id: "023", image: "horn.png", name: "Commander's Horn", type: "special", value: 0 },
  // { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", id: "024", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
  // { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", id: "025", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
  // { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", id: "026", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
  // { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", id: "027", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
  // { ability: 'rain', abilityIcon: "gi-heavy-rain", active: false, defaultValue: 0, description: "Sets the strength of all <strong>Siege Combat</strong> cards to 1 for both players.", id: "028", image: "rain.png", name: "Torrential Rain", type: "special", value: 0 },
  // { ability: 'scorch', abilityIcon: "io-skull", active: false, defaultValue: 0, description: "Discards after playing. Kills the strongest card(s) on the battlefield.", id: "029", image: "scorch.png", name: "Scorch", type: "special", value: 0 },
  // { ability: 'clear', abilityIcon: "gi-sunflower", active: false, defaultValue: 0, description: "Removes all <strong>Weather Card</strong> (Biting Frost, Impenetrable Fog and Torrential Rain) effects.", id: "030", image: "clear.png", name: "Clear Weather", type: "special", value: 0 }
]

const emptyPlayerBoardArrays: Card[][] = [[], [], []]

const emptyOpponentBoardArrays: Card[][] = [[], [], []]

const emptyPlayerBuffsArrays: Card[][] = [[], [], []]

const emptyOpponentBuffsArrays: Card[][] = [[], [], []]


const emptyCardArray: Card[] = []

const dummyOpponentCards: Card[][] = [
  [
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "101", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "102", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "103", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "104", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "105", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "106", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { active: false, defaultValue: 6, faction: 'br', image: "br-cavalry.jpg", id: "111", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 6 },
    { active: false, defaultValue: 6, faction: 'br', image: "br-cavalry.jpg", id: "112", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 6 },
    { active: false, defaultValue: 6, faction: 'br', image: "br-cavalry.jpg", id: "113", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 6 },
  ],
  [
    { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", id: "124", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
    { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", id: "125", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
  ],
  [
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "018",  image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "019",  image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "019",  image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
  ]
]

const dummyPlayerCards: Card[][] = [
  [
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "101", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "102", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "103", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "104", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'boost', abilityIcon: "fa-plus", active: false, defaultValue: 3, description: "<strong>Morale Boost:</strong> Adds + 1 to all units in the row (excluding itself).", faction: 'br', image: "br-sergent.jpg", id: "105", name: "Sergent", type: "close", typeIcon: "gi-broadsword", value: 3 },
  ],
  [
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 4, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "107", image: "br-rifle.jpg", name: "Rifleman", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 4, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "108", image: "br-rifle.jpg", name: "Rifleman", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 4, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "109", image: "br-rifle.jpg", name: "Rifleman", type: "ranged", typeIcon: "gi-crossbow", value: 4 },  ],
  [
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "118",  image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'br', id: "119",  image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
  ]
]

const dummySpecialCards: Card[] = [
  { ability: 'rain', abilityIcon: "gi-heavy-rain", active: false, defaultValue: 0, description: "Sets the strength of all <strong>Siege Combat</strong> cards to 1 for both players.", id: "025", image: "rain.png", name: "Torrential Rain", type: "special", value: 0 },
  { ability: 'scorch', abilityIcon: "io-skull", active: false, defaultValue: 0, description: "Discards after playing. Kills the strongest card(s) on the battlefield.", id: "026", image: "scorch.png", name: "Scorch", type: "special", value: 0 },
  { ability: 'clear', abilityIcon: "gi-sunflower", active: false, defaultValue: 0, description: "Removes all <strong>Weather Card</strong> (Biting Frost, Impenetrable Fog and Torrential Rain) effects.", id: "027", image: "clear.png", name: "Clear Weather", type: "special", value: 0 }
]

const dummyPlayerBuffs: Card[][] = [
  [],
  [
    { ability: 'double', abilityIcon: "gi-hunting-horn", active: false, defaultValue: 0, description: "Doubles the strength of all unit cards in that row. Limited to 1 per row.", id: "022", image: "horn.png", name: "Commander's Horn", type: "special", value: 0 }
  ],
  []
]
const dummyOpponentBuffs: Card[][] = [
  [
    { ability: 'double', abilityIcon: "gi-hunting-horn", active: false, defaultValue: 0, description: "Doubles the strength of all unit cards in that row. Limited to 1 per row.", id: "122", image: "horn.png", name: "Commander's Horn", type: "special", value: 0 }
  ],
  [],
  [
    { ability: 'double', abilityIcon: "gi-hunting-horn", active: false, defaultValue: 0, description: "Doubles the strength of all unit cards in that row. Limited to 1 per row.", id: "123", image: "horn.png", name: "Commander's Horn", type: "special", value: 0 },
    { ability: 'rain', abilityIcon: "gi-heavy-rain", active: false, defaultValue: 0, description: "Sets the strength of all <strong>Siege Combat</strong> cards to 1 for both players.", id: "028", image: "rain.png", name: "Torrential Rain", type: "special", value: 0 },
  ]
]

export {
  type Card,
  allOpponentCards,
  allPlayerCards,
  emptyPlayerBoardArrays,
  emptyOpponentBoardArrays,
  emptyPlayerBuffsArrays,
  emptyOpponentBuffsArrays,
  emptyCardArray,
  dummyOpponentCards,
  dummyPlayerCards,
  dummySpecialCards,
  dummyPlayerBuffs,
  dummyOpponentBuffs,
}
