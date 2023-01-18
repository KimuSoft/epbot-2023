import { FishEventType, Rarity } from "../types/fish.type"

export default require("../../asset/gamerule.json") as GameRule

interface GameRule {
  rarityProbability: Record<Rarity, number>
  eventProbability: Record<FishEventType, number>
}
