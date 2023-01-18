import { EpChannelDocument } from "../types/models/epChannel.type"
import fishData from "../game/fish"
import { FishEventType, IFish } from "../types/fish.type"
import gameRule from "../game/gameRule"
import { pmfChoice, recordToPmfObject } from "../utils/random"
import _ from "lodash"
import fishEvent, { IFishEvent } from "../game/fishEvent"

// 해당 채널에서 낚을 수 있는 물고기 목록을 반환합니다.
export const getFishArray = (epChannel: EpChannelDocument): IFish[] =>
  fishData.filter(
    (f) =>
      f.biomes.includes(epChannel.biome) &&
      f.weathers.includes(epChannel.weather) &&
      f.seasons.includes(epChannel.season)
  )

// 랜덤으로 물고기를 하나 반환합니다.
export const getRandomFish = (
  epChannel: EpChannelDocument
): IFish | undefined => {
  const rarity = pmfChoice(recordToPmfObject(gameRule.rarityProbability)).value
  const fishArray = getFishArray(epChannel).filter((f) => f.rarity >= rarity)

  const fish = _.sample(fishArray.filter((f) => f.rarity === rarity))
  if (!fish) throw new Error("No fish found")

  return fish
}

// TODO: 이벤트 조건 추가
export const getRandomFishEvent = (eventType: FishEventType): IFishEvent => {
  return _.sample(fishEvent.filter((e) => e.type === eventType))!
}

// 랜덤한 이벤트 종류를 반환합니다.
export const getRandomTurn = (epChannel: EpChannelDocument): TurnData => {
  const eventType = pmfChoice(
    recordToPmfObject(gameRule.eventProbability)
  ).value
  const event = getRandomFishEvent(eventType)

  return {
    event: eventType,
    fishId:
      event.type !== FishEventType.Idle
        ? getRandomFish(epChannel)?.id
        : undefined,
    catchKeys: event.catchKeys,
    message: event.message,
  }
}

export interface TurnData {
  event: FishEventType
  catchKeys?: string[]
  fishId?: string
  message?: string
}
