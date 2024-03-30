import type { Awards } from "@/types";

const defaultPlayerAwards: Awards = {
  fieldmarshal: { active: false, count: 0, icon: "gi-rank-3", name: "Field Marshal", targetCount: 140 },
  heavyweight: { active: false, count: 0, icon: "gi-muscle-up", name: "Heavyweight", targetCount: 100 },
  spymaster: { active: false, count: 0, icon: "bi-incognito", name: "Spy Master", targetCount: 4 },
  tactician: { active: false, count: 0, icon: "gi-brain", name: "Tactician", targetCount: 9 },
  tyrant: { active: false, count: 0, icon: "gi-daemon-skull", name: "Tyrant", targetCount: 6 },
}

const defaultOpponentAwards: Awards = {
  fieldmarshal: { active: false, count: 0, icon: "gi-rank-3", name: "Field Marshal", targetCount: 140 },
  heavyweight: { active: false, count: 0, icon: "gi-muscle-up", name: "Heavyweight", targetCount: 100 },
  spymaster: { active: false, count: 0, icon: "bi-incognito", name: "Spy Master", targetCount: 4 },
  tactician: { active: false, count: 0, icon: "gi-brain", name: "Tactician", targetCount: 9 },
  tyrant: { active: false, count: 0, icon: "gi-daemon-skull", name: "Tyrant", targetCount: 6 },
}

export {
  defaultPlayerAwards,
  defaultOpponentAwards,
}