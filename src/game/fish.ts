import { IFish, Rarity } from "../types/fish.type"
import { Biome, Season, Weather } from "../types/models/epChannel.type"

const fish = (require("../../asset/fish.json") as PartialFish[]).map((fish) => {
  return {
    standardDeviation: 0.2,
    ...fish,
    rarity: Rarity[fish.rarity] as unknown as Rarity,
  } as IFish
}) as IFish[]

export const findFishById = (id: string) => fish.find((f) => f.id === id)

interface PartialFish {
  id: string
  name: string
  rarity: Rarity
  biomes?: Biome[]
  weathers?: Weather[]
  seasons?: Season[]
  averagePrice: number
  averageLength: number
  standardDeviation?: number
}

export default fish
