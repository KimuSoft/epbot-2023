import mongoose, { Model } from "mongoose"

export interface IEpUser {
  id: string
  name: string
  money: number
  exp: number
}

export interface IEpUserMethods {}

export type EpUserModel = Model<IEpUser, {}, IEpUserMethods>
export type EpUserDocument = mongoose.Document<{}, {}, IEpUser> & {
  _id: mongoose.Types.ObjectId
} & IEpUser &
  IEpUserMethods
