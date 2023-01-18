import * as mongoose from "mongoose"
import _ from "lodash"
import {
  Biome,
  IEpChannel,
  Season,
  Weather,
} from "../types/models/epChannel.type"

const schema = new mongoose.Schema<IEpChannel>({
  id: { type: "String", required: true, unique: true },
  name: { type: "String", required: true },
  exp: { type: "Number", required: true, default: 0 },
  point: { type: "Number", required: true, default: 0 },
  season: {
    type: "Number",
    required: true,
    default: randomSeason,
  },
  biome: {
    type: "Number",
    required: true,
    default: randomBiome,
  },
  weather: {
    type: "Number",
    default: Weather.Sunny,
  },
  type: {
    type: "Number",
    required: true,
    default: 0,
  },
})

function randomSeason() {
  return _.sample([Season.Spring, Season.Summer, Season.Autumn, Season.Winter])!
}

function randomBiome() {
  return _.sample([Biome.Beach, Biome.Lake])!
}

export const EpChannel = mongoose.model<IEpChannel>("epChannel", schema)
