import type { Awards } from "@/types";

const defaultPlayerAwards: Awards = {
  fieldmarshal: { active: false, count: 0, description: "Gain a <strong>total unit strength</strong> of <strong>140 points</strong> or more in a single round.", icon: "gi-rank-3", name: "Field Marshal", targetCount: 140 },
  heavyweight: { active: false, count: 0, description: "Gain a <strong>Siege Combat</strong> strength of <strong>100 points</strong> or more in a single round.", icon: "gi-muscle-up", name: "Heavyweight", targetCount: 100 },
  spymaster: { active: false, count: 0, description: "Play <strong>4</strong> or more <strong>Spy cards</strong> in a single match.", icon: "bi-incognito", name: "Spy Master", targetCount: 4 },
  tactician: { active: false, count: 0, description: "<strong>Win</strong> a match by playing <strong>9 cards or less</strong>.", icon: "gi-brain", name: "Tactician", targetCount: 9 },
  tyrant: { active: false, count: 0, description: "<strong>Scorch 6 cards</strong> or more in a single match.", icon: "gi-daemon-skull", name: "Tyrant", targetCount: 6 },
}

const defaultOpponentAwards: Awards = {
  fieldmarshal: { active: false, count: 0, description: "Gain a <strong>total unit strength</strong> of <strong>140 points</strong> or more in a single round.", icon: "gi-rank-3", name: "Field Marshal", targetCount: 140 },
  heavyweight: { active: false, count: 0, description: "Gain a <strong>Siege Combat</strong> strength of <strong>100 points</strong> or more in a single round.", icon: "gi-muscle-up", name: "Heavyweight", targetCount: 100 },
  spymaster: { active: false, count: 0, description: "Play <strong>4</strong> or more <strong>Spy cards</strong> in a single match.", icon: "bi-incognito", name: "Spy Master", targetCount: 4 },
  tactician: { active: false, count: 0, description: "<strong>Win</strong> a match by playing <strong>9 cards or less</strong>.", icon: "gi-brain", name: "Tactician", targetCount: 9 },
  tyrant: { active: false, count: 0, description: "<strong>Scorch 6 cards</strong> or more in a single match.", icon: "gi-daemon-skull", name: "Tyrant", targetCount: 6 },
}

export {
  defaultPlayerAwards,
  defaultOpponentAwards,
}
