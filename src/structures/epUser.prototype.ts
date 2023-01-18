import { User } from "discord.js"
import { EpUserDocument } from "../types/models/epUser.type"
import { EpUser } from "../models/epUser"

declare module "discord.js" {
  interface User {
    getEpUser(): Promise<EpUserDocument>
  }
}

User.prototype.getEpUser = async function () {
  let user = await EpUser.findOne({ id: this.id })
  if (!user) {
    user = new EpUser({
      id: this.id,
      name: this.username,
    })
    console.log(user.save)
    await user.save()
  }
  user.name = this.username
  return user
}
