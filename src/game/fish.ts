import { IFish, Rarity } from "../types/fish.type"
import { Biome, Season, Weather } from "../types/models/epChannel.type"

export default (require("../../asset/fish.json") as PartialFish[]).map(
  (fish) => {
    if (!fish.biomes) fish.biomes = []
    if (!fish.weathers) fish.weathers = []
    if (!fish.seasons) fish.seasons = []
    if (!fish.standardDeviation) fish.standardDeviation = 0.2

    return fish as IFish
  }
) as IFish[]

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
