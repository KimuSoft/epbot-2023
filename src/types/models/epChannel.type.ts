import mongoose, { Model } from "mongoose"

export interface IEpChannel {
  id: string
  name: string
  // 명성 -> 레벨 업용 경험치
  exp: number
  // 포인트 -> 시설 연구를 위해 필요한 비용
  point: number
  biome: Biome
  weather: Weather
  season: Season
  type: ChannelType
}

export interface IEpChannelMethods {}

export type EpChannelModel = Model<IEpChannel, {}, IEpChannelMethods>
export type EpChannelDocument = mongoose.Document<{}, {}, IEpChannel> & {
  _id: mongoose.Types.ObjectId
} & IEpChannel &
  IEpChannelMethods

export enum Biome {
  Desert,
  Beach,
  River,
  Lake,
  Valley,
  Mudflat,
  Island,
}

export enum Weather {
  Sunny,
  Cloudy,
  Rainy,
  Snowy,
  Heatwave,
  Coldwave,
  Foggy,
  Thunder,
}

export enum Season {
  Spring,
  Summer,
  Autumn,
  Winter,
}

export enum ChannelType {
  Normal,
  Personal,
}
