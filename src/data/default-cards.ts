interface Card {
  ability?: string
  abilityIcon?: string
  active: boolean
  animationName?: string
  defaultValue: number
  description?: string
  faction: string
  hero?: boolean
  id: string
  image: string
  musterName?: string
  name?: string
  type: string
  typeIcon?: string
  value: number
}

const allOpponentCards: Card[] = [
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'french', id: "201", image: "fr-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'french', id: "202", image: "fr-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'french', id: "203", image: "fr-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'french', id: "204", image: "fr-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
  { ability: 'boost', abilityIcon: "fa-plus", active: false, defaultValue: 2, description: "<strong>Morale Boost:</strong> Adds + 1 to all units in the row (excluding itself).", faction: 'french', image: "fr-sergent.jpg", id: "205", name: "Sergent", type: "close", typeIcon: "gi-broadsword", value: 2 },
  { ability: 'boost', abilityIcon: "fa-plus", active: false, defaultValue: 2, description: "<strong>Morale Boost:</strong> Adds + 1 to all units in the row (excluding itself).", faction: 'french', image: "fr-sergent.jpg", id: "206", name: "Sergent", type: "close", typeIcon: "gi-broadsword", value: 2 },
  { active: false, defaultValue: 3, faction: 'french', id: "207", image: "fr-gaston.png", musterName: "calvet", name: "Gaston", type: "siege", typeIcon: "gi-catapult", value: 3 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 5, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'french', id: "208", image: "fr-oldguard.jpg", name: "Old Guard", type: "ranged", typeIcon: "gi-crossbow", value: 5 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 5, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'french', id: "209", image: "fr-oldguard.jpg", name: "Old Guard", type: "ranged", typeIcon: "gi-crossbow", value: 5 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 5, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'french', id: "210", image: "fr-oldguard.jpg", name: "Old Guard", type: "ranged", typeIcon: "gi-crossbow", value: 5 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 5, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'french', id: "211", image: "fr-oldguard.jpg", name: "Old Guard", type: "ranged", typeIcon: "gi-crossbow", value: 5 },
  { active: false, defaultValue: 7, faction: 'french', image: "fr-cavalry.jpg", id: "212", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 7 },
  { active: false, defaultValue: 7, faction: 'french', image: "fr-cavalry.jpg", id: "213", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 7 },
  { active: false, defaultValue: 7, faction: 'french', image: "fr-cavalry.jpg", id: "214", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 7 },
  { active: false, defaultValue: 7, faction: 'french', image: "fr-cavalry.jpg", id: "215", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 7 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'french', id: "216",  image: "fr-cannon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'french', id: "217",  image: "fr-cannon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'french', id: "218",  image: "fr-cannon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
  { ability: 'spy', abilityIcon: "hi-solid-eye", active: false, defaultValue: 0, description: "<strong>Spy:</strong> Place on your opponent's battlefield (counts towards opponent's total) and draw 2 cards from your deck.", faction: 'french', hero: true, id: "219", image: "fr-ducos.png", name: "Maj. Pierre Ducos", type: "close", typeIcon: "gi-broadsword", value: 0 },
  { ability: 'muster', abilityIcon: "gi-two-shadows", active: false, defaultValue: 10, description: "<strong>Muster:</strong> Find the <strong>Gaston</strong> card in your deck and play it instantly.", faction: 'french', id: "220", image: "fr-general-calvet.png", musterName: "calvet", name: "General Calvet", type: "siege", typeIcon: "gi-catapult", value: 10 },
  { ability: 'close_scorch', abilityIcon: "io-skull", active: false, defaultValue: 10, description: "<strong>Scorch - Close Combat:</strong> Destroy your enemy's strongest <strong>Close Combat</strong> unit(s) if the combined strength of their <strong>Close Combat</strong> units is 10 or more.", faction: 'fr', image: "fr-loup.jpg", hero: true, id: "221", name: "Brigadier-General Guy Loup", type: "close", typeIcon: "gi-broadsword", value: 10 },
  { active: false, defaultValue: 3, faction: 'french', image: "fr-voltigeur.jpg", id: "222", name: "Voltigeur", type: "ranged", typeIcon: "gi-crossbow", value: 3 },
  { active: false, defaultValue: 3, faction: 'french', image: "fr-voltigeur.jpg", id: "223", name: "Voltigeur", type: "ranged", typeIcon: "gi-crossbow", value: 3 },
  { active: false, defaultValue: 3, faction: 'french', image: "fr-voltigeur.jpg", id: "224", name: "Voltigeur", type: "ranged", typeIcon: "gi-crossbow", value: 3 },
  { ability: 'spy', abilityIcon: "hi-solid-eye", active: false, defaultValue: 2, description: "<strong>Spy:</strong> Place on your opponent's battlefield (counts towards opponent's total) and draw 2 cards from your deck.", faction: 'french', id: "225", image: "fr-maquerre.png", name: "Comte de Maquerre", type: "close", typeIcon: "gi-broadsword", value: 2 },
  { ability: 'spy', abilityIcon: "hi-solid-eye", active: false, defaultValue: 5, description: "<strong>Spy:</strong> Place on your opponent's battlefield (counts towards opponent's total) and draw 2 cards from your deck.", faction: 'french', id: "226", image: "fr-brand.jpg", name: "Col. Brand", type: "ranged", typeIcon: "gi-crossbow", value: 5 },
  { ability: 'heal', abilityIcon: "gi-heart-plus", active: false, defaultValue: 6, description: "<strong>Medic:</strong> Choose one card from your discard pile and play it instantly (no <strong>Heroes</strong> or <strong>Special</strong> cards).", faction: 'french', id: "227", image: "fr-leroux.png", name: "Helene Leroux", type: "siege", typeIcon: "gi-catapult", value: 6 },
  // { ability: 'double', abilityIcon: "fa-drum", active: false, defaultValue: 0, description: "Doubles the strength of all unit cards in that row. Limited to 1 per row.", faction: 'french', id: "222" ,image: "fr-drummer.jpg", name: "Drummer", type: "special", value: 0 },
  // { ability: 'double', abilityIcon: "fa-drum", active: false, defaultValue: 0, description: "Doubles the strength of all unit cards in that row. Limited to 1 per row.", faction: 'french', id: "223", image: "fr-drummer.jpg", name: "Drummer", type: "special", value: 0 },
  // { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", id: "224", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
  // { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", id: "225", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
  // { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", id: "226", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
  // { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", id: "227", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
  // { ability: 'rain', abilityIcon: "gi-heavy-rain", active: false, defaultValue: 0, description: "Sets the strength of all <strong>Siege Combat</strong> cards to 1 for both players.", id: "228", image: "rain.png", name: "Torrential Rain", type: "special", value: 0 },
  // { ability: 'scorch', abilityIcon: "io-skull", active: false, defaultValue: 0, description: "Discards after playing. Kills the strongest card(s) on the battlefield.", id: "229", image: "scorch.png", name: "Scorch", type: "special", value: 0 },
  // { ability: 'clear', abilityIcon: "gi-sunflower", active: false, defaultValue: 0, description: "Removes all <strong>Weather Card</strong> (Biting Frost, Impenetrable Fog and Torrential Rain) effects.", id: "230", image: "clear.png", name: "Clear Weather", type: "special", value: 0 }
]

const allPlayerCards: Card[] = [
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 2, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "001", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 2 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 2, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "002", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 2 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 2, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "003", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 2 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 2, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "004", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 2 },
  { ability: 'boost', abilityIcon: "fa-plus", active: false, defaultValue: 3, description: "<strong>Morale Boost:</strong> Adds + 1 to all units in the row (excluding itself).", faction: 'british', image: "br-sergent.jpg", id: "005", name: "Sergent", type: "close", typeIcon: "gi-broadsword", value: 3 },
  { ability: 'boost', abilityIcon: "fa-plus", active: false, defaultValue: 3, description: "<strong>Morale Boost:</strong> Adds + 1 to all units in the row (excluding itself).", faction: 'british', image: "br-sergent.jpg", id: "006", name: "Sergent", type: "close", typeIcon: "gi-broadsword", value: 3 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 4, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "007", image: "br-rifle.jpg", name: "Rifleman", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 4, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "008", image: "br-rifle.jpg", name: "Rifleman", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 4, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "009", image: "br-rifle.jpg", name: "Rifleman", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 4, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "010", image: "br-rifle.jpg", name: "Rifleman", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
  { active: false, defaultValue: 5, faction: 'british', image: "br-cavalry.jpg", id: "011", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 5 },
  { active: false, defaultValue: 5, faction: 'british', image: "br-cavalry.jpg", id: "012", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 5 },
  { active: false, defaultValue: 5, faction: 'british', image: "br-cavalry.jpg", id: "013", name: "Cavalry Rider", type: "close", typeIcon: "gi-broadsword", value: 5 },
  { ability: 'heal', abilityIcon: "gi-heart-plus", active: false, defaultValue: 4, description: "<strong>Medic:</strong> Choose one card from your discard pile and play it instantly (no <strong>Heroes</strong> or <strong>Special</strong> cards).", faction: 'british', id: "014", image: "br-harris.jpg", name: "Rifleman Harris", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
  { ability: 'ranged_scorch', abilityIcon: "io-skull", active: false, defaultValue: 7, description: "<strong>Scorch - Ranged:</strong> Destroy your enemy's strongest <strong>Ranged Combat</strong> unit(s) if the combined strength of their <strong>Ranged Combat</strong> units is 10 or more.", faction: 'british', id: "015", image: "br-hagman.jpg", name: "Rifleman Daniel Hagman", type: "ranged", typeIcon: "gi-crossbow", value: 7 },
  { active: false, defaultValue: 10, description: "<strong>Hero:</strong> Not affected by any Special Cards or abilities.", faction: 'british', hero: true, id: "016", image: "br-harper.jpg", name: "Sgt. Patrick Harper", type: "close", typeIcon: "gi-broadsword", value: 10 },
  { ability: 'close_scorch', abilityIcon: "io-skull", active: false, defaultValue: 15, description: "<strong>Scorch - Close Combat:</strong> Destroy your enemy's strongest <strong>Close Combat</strong> unit(s) if the combined strength of their <strong>Close Combat</strong> units is 10 or more.", faction: 'british', hero: true, id: "017",  image: "br-sharpe.jpg", name: "Maj. Richard Sharpe", type: "close", typeIcon: "gi-broadsword", value: 15 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 7, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "018",  image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 7 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 7, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "019",  image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 7 },
  { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 7, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "020",  image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 7 },
  { ability: 'spy', abilityIcon: "hi-solid-eye", active: false, defaultValue: 1, description: "<strong>Spy:</strong> Place on your opponent's battlefield (counts towards opponent's total) and draw 2 cards from your deck.", faction: 'british', id: "021", image: "br-hogan.jpg", name: "Maj. Michael Hogan", type: "close", typeIcon: "gi-broadsword", value: 1 },
  { ability: 'spy', abilityIcon: "hi-solid-eye", active: false, defaultValue: 3, description: "<strong>Spy:</strong> Place on your opponent's battlefield (counts towards opponent's total) and draw 2 cards from your deck.", faction: 'british', id: "022", image: "br-moreno.jpg", name: "Teresa Moreno", type: "close", typeIcon: "gi-broadsword", value: 3 },
  { ability: 'spy', abilityIcon: "hi-solid-eye", active: false, defaultValue: 6, description: "<strong>Spy:</strong> Place on your opponent's battlefield (counts towards opponent's total) and draw 2 cards from your deck.", faction: 'british', id: "023", image: "br-anne-camoynes.png", name: "Lady Anne Camoynes", type: "ranged", typeIcon: "gi-crossbow", value: 6 },
  { active: false, defaultValue: 3, faction: 'british', id: "024", image: "br-hakeswill.jpg", name: "Sgt. Obadiah Hakeswill", type: "close", typeIcon: "gi-broadsword", value: 3 },
  { ability: 'boost', abilityIcon: "fa-plus", active: false, defaultValue: 6, description: "<strong>Morale Boost:</strong> Adds + 1 to all units in the row (excluding itself).", faction: 'british', id: "025", image: "br-fredrickson.jpg", name: "Capt. William Frederickson", type: "ranged", typeIcon: "gi-crossbow", value: 6 },
  // { ability: 'double', abilityIcon: "fa-drum", active: false, defaultValue: 0, description: "Doubles the strength of all unit cards in that row. Limited to 1 per row.", faction: 'british', id: "026", image: "br-drummer.jpg", name: "Drummer", type: "special", value: 0 },
  // { ability: 'double', abilityIcon: "fa-drum", active: false, defaultValue: 0, description: "Doubles the strength of all unit cards in that row. Limited to 1 per row.", faction: 'british', id: "027", image: "br-drummer.jpg", name: "Drummer", type: "special", value: 0 },
  // { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", id: "028", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
  // { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", id: "029", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
  // { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", id: "030", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
  // { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", id: "031", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
  // { ability: 'rain', abilityIcon: "gi-heavy-rain", active: false, defaultValue: 0, description: "Sets the strength of all <strong>Siege Combat</strong> cards to 1 for both players.", id: "032", image: "rain.png", name: "Torrential Rain", type: "special", value: 0 },
  // { ability: 'scorch', abilityIcon: "io-skull", active: false, defaultValue: 0, description: "Discards after playing. Kills the strongest card(s) on the battlefield.", id: "033", image: "scorch.png", name: "Scorch", type: "special", value: 0 },
  // { ability: 'clear', abilityIcon: "gi-sunflower", active: false, defaultValue: 0, description: "Removes all <strong>Weather Card</strong> (Biting Frost, Impenetrable Fog and Torrential Rain) effects.", id: "034", image: "clear.png", name: "Clear Weather", type: "special", value: 0 }
]

const playerLeaderCard: Card = { ability: 'clear', active: false, defaultValue: 0, description: "<strong>Clear:</strong> Clear any weather effects.", faction: 'british', id: "901", image: "br-wellington.jpg", name: "Wellington", type: "leader", value: 0 };

const opponentLeaderCard: Card = { ability: 'reinforce', active: false, defaultValue: 0, description: "<strong>Reinforce</strong> Magically summon 2 x Poor Fucking Infantry cards.", faction: 'french', id: "902", image: "fr-napoleon.jpg", name: "Napoleon", type: "leader", value: 0 };

const emptyPlayerBoardArrays: Card[][] = [[], [], []]

const emptyOpponentBoardArrays: Card[][] = [[], [], []]

const emptyPlayerBuffsArrays: Card[][] = [[], [], []]

const emptyOpponentBuffsArrays: Card[][] = [[], [], []]


const emptyCardArray: Card[] = []

const dummyOpponentCards: Card[][] = [
  [
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "101", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "102", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "103", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "104", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "105", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "106", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
  ],
  [
    { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", faction: 'french', id: "124", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
    { ability: 'decoy', abilityIcon: "gi-scarecrow", active: false, defaultValue: 0, description: "Swap with a card on the battlefield to return it to your hand.", faction: 'french', id: "125", image: "decoy.jpg", name: "Decoy", type: "special", value: 0 },
  ],
  [
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "018",  image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "019",  image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "019",  image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
  ]
]

const dummyPlayerCards: Card[][] = [
  [
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "101", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "102", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "103", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 1, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "104", image: "br-infantry.jpg", name: "Poor Fucking Infantry", type: "close", typeIcon: "gi-broadsword", value: 1 },
    { ability: 'boost', abilityIcon: "fa-plus", active: false, defaultValue: 3, description: "<strong>Morale Boost:</strong> Adds + 1 to all units in the row (excluding itself).", faction: 'british', image: "br-sergent.jpg", id: "105", name: "Sergent", type: "close", typeIcon: "gi-broadsword", value: 3 },
  ],
  [
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 4, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "107", image: "br-rifle.jpg", name: "Rifleman", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 4, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "108", image: "br-rifle.jpg", name: "Rifleman", type: "ranged", typeIcon: "gi-crossbow", value: 4 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 4, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "109", image: "br-rifle.jpg", name: "Rifleman", type: "ranged", typeIcon: "gi-crossbow", value: 4 },  ],
  [
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "118",  image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
    { ability: 'bond', abilityIcon: "md-handshake-outlined", active: false, defaultValue: 8, description: "<strong>Tight Bond:</strong> Place next to a card with the same name to double the value of both cards.", faction: 'british', id: "119",  image: "br-canon.jpg", name: "Cannon", type: "siege", typeIcon: "gi-catapult", value: 8 },
  ]
]

const dummySpecialCards: Card[] = [
  { ability: 'rain', abilityIcon: "gi-heavy-rain", active: false, defaultValue: 0, description: "Sets the strength of all <strong>Siege Combat</strong> cards to 1 for both players.", faction: "british", id: "025", image: "rain.png", name: "Torrential Rain", type: "special", value: 0 },
  { ability: 'scorch', abilityIcon: "io-skull", active: false, defaultValue: 0, description: "Discards after playing. Kills the strongest card(s) on the battlefield.", faction: "british", id: "026", image: "scorch.png", name: "Scorch", type: "special", value: 0 },
  { ability: 'clear', abilityIcon: "gi-sunflower", active: false, defaultValue: 0, description: "Removes all <strong>Weather Card</strong> (Biting Frost, Impenetrable Fog and Torrential Rain) effects.", faction: "british", id: "027", image: "clear.png", name: "Clear Weather", type: "special", value: 0 }
]

const dummyPlayerBuffs: Card[][] = [
  [],
  [
    { ability: 'double', abilityIcon: "fa-drum", active: false, defaultValue: 0, description: "Doubles the strength of all unit cards in that row. Limited to 1 per row.", faction: 'british', id: "022", image: "br-drummer.jpg", name: "Commander's Horn", type: "special", value: 0 }
  ],
  []
]
const dummyOpponentBuffs: Card[][] = [
  [
    { ability: 'double', abilityIcon: "fa-drum", active: false, defaultValue: 0, description: "Doubles the strength of all unit cards in that row. Limited to 1 per row.", faction: 'french', id: "122", image: "fr-drummer.jpg", name: "Commander's Horn", type: "special", value: 0 }
  ],
  [],
  [
    { ability: 'double', abilityIcon: "fa-drum", active: false, defaultValue: 0, description: "Doubles the strength of all unit cards in that row. Limited to 1 per row.", faction: 'french', id: "123", image: "fr-drummer.jpg", name: "Drummer", type: "special", value: 0 },
    { ability: 'rain', abilityIcon: "gi-heavy-rain", active: false, defaultValue: 0, description: "Sets the strength of all <strong>Siege Combat</strong> cards to 1 for both players.", faction: 'french', id: "028", image: "rain.png", name: "Torrential Rain", type: "special", value: 0 },
  ]
]

export {
  type Card,
  allOpponentCards,
  allPlayerCards,
  playerLeaderCard,
  opponentLeaderCard,
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
