import { Biome, Season, Weather } from "./models/epChannel.type"

export interface IFish {
  id: string
  name: string
  rarity: Rarity
  averagePrice: number
  averageLength: number
  standardDeviation: number
  biomes: Biome[]
  weathers: Weather[]
  seasons: Season[]
}

export enum Rarity {
  // Treasure = -1,
  Trash,
  Common,
  Rare,
  Epic,
  Legendary,
}

export enum FishEventType {
  Idle,
  Bite,
}
