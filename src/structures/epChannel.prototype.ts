import {
  BaseGuildTextChannel,
  BaseGuildVoiceChannel,
  DMChannel,
  ThreadChannel,
} from "discord.js"
import { EpChannel } from "../models/epChannel"
import { ChannelType, EpChannelDocument } from "../types/models/epChannel.type"

declare module "discord.js" {
  interface BaseGuildTextChannel {
    getEpChannel(): Promise<EpChannelDocument>
  }
  interface ThreadChannel {
    getEpChannel(): Promise<EpChannelDocument>
  }
  interface BaseGuildVoiceChannel {
    getEpChannel(): Promise<EpChannelDocument>
  }
  interface DMChannel {
    getEpChannel(): Promise<EpChannelDocument>
  }
}

const getEpChannel = async (
  discordChannel: BaseGuildTextChannel | BaseGuildVoiceChannel | DMChannel
) => {
  console.log("ㅇㅇㅇㅇㅇ")
  let channel = await EpChannel.findOne({ cid: discordChannel.id })
  const channelName = discordChannel.isDMBased()
    ? discordChannel.recipientId
    : discordChannel.name

  if (!channel) {
    channel = new EpChannel({
      id: discordChannel.id,
      name: channelName,
      channelType: discordChannel.isDMBased()
        ? ChannelType.Personal
        : ChannelType.Normal,
    })
    await channel.save()
  }
  channel.name = channelName
  return channel
}

BaseGuildTextChannel.prototype.getEpChannel = async function () {
  return getEpChannel(this)
}

ThreadChannel.prototype.getEpChannel = async function () {
  if (this) if (!this.parent) throw new Error("Thread has no parent")
  // @ts-ignore 포럼채널 타입체커가 없음
  return getEpChannel(this.parent)
}

BaseGuildVoiceChannel.prototype.getEpChannel = async function () {
  return getEpChannel(this)
}

DMChannel.prototype.getEpChannel = async function () {
  return getEpChannel(this)
}
