import { FishEventType } from "../types/fish.type"

export default require("../../asset/fish_event.json") as IFishEvent[]

export interface IFishEvent {
  type: FishEventType
  message: string
  catchKeys?: string[]
}
