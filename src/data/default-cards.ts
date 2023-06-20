const dummyPlayerHand: { value: number; active: boolean }[] = [
  { value: 1, active: false },
  { value: 2, active: false },
  { value: 3, active: false },
  { value: 4, active: false },
  { value: 5, active: false },
  { value: 6, active: false },
  { value: 7, active: false },
  { value: 8, active: false },
  { value: 9, active: false },
  { value: 10, active: false },
  { value: 11, active: false },
  { value: 12, active: false },
  { value: 13, active: false },
  { value: 14, active: false }
]

// const dummyOpponentHand: { value: number }[] = [
//   { value: 1 },
//   { value: 1 },
//   { value: 1 },
//   { value: 2 },
//   { value: 2 },
//   { value: 3 },
//   { value: 4 },
//   { value: 5 },
//   { value: 5 },
//   { value: 6 },
//   { value: 8 },
//   { value: 10 },
//   { value: 10 },
//   { value: 10 },
// ];

const dummyPlayerCards: { value: number; active: boolean }[][] = [
  [
    { value: 4, active: false },
    { value: 4, active: false },
    { value: 6, active: false },
    { value: 6, active: false },
    { value: 7, active: false }
  ],
  [
    { value: 5, active: false },
    { value: 5, active: false },
    { value: 5, active: false }
  ],
  [
    { value: 6, active: false },
    { value: 6, active: false },
    { value: 8, active: false },
    { value: 8, active: false }
  ]
]

const dummyOpponentCards: { value: number; active: boolean }[][] = [
  [
    { value: 1, active: false },
    { value: 1, active: false },
    { value: 1, active: false },
    { value: 1, active: false },
    { value: 1, active: false },
    { value: 1, active: false },
    { value: 1, active: false },
    { value: 1, active: false },
    { value: 1, active: false },
    { value: 1, active: false },
    { value: 2, active: false },
    { value: 3, active: false }
  ],
  [
    { value: 6, active: false },
    { value: 5, active: false }
  ],
  [{ value: 8, active: false }]
]

const emptyCardRow: { value: number; active: boolean }[] = []

export {
  dummyPlayerHand,
  // dummyOpponentHand,
  dummyPlayerCards,
  dummyOpponentCards,
  emptyCardRow
}
