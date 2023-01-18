import * as mongoose from "mongoose"
import { IEpUser } from "../types/models/epUser.type"

const schema = new mongoose.Schema<IEpUser>({
  id: { type: "String", required: true, unique: true },
  name: { type: "String", required: true },
  money: { type: "Number", required: true, default: 1000 },
  exp: { type: "Number", required: true, default: 0 },
})

export const EpUser = mongoose.model<IEpUser>("epUser", schema)
