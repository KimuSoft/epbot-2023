import {
  applicationCommand,
  command,
  Extension,
  listener,
} from "@pikokr/command.ts"
import { ApplicationCommandType, ChatInputCommandInteraction } from "discord.js"
import { cts } from "../index"

class SystemExtension extends Extension {
  @listener({ event: "ready" })
  async ready() {
    this.logger.info(`Logged in as ${this.client.user!.tag}`)
    await this.commandClient.fetchOwners()
  }

  @applicationCommand({
    name: "ping",
    type: ApplicationCommandType.ChatInput,
    description: "wow this is ping",
  })
  async ping(i: ChatInputCommandInteraction) {
    await i.reply(`current ping: ${i.client.ws.ping}ms`)
    await i.channel?.send("키")
    await i.channel?.send("천")
    await i.channel?.send("뮤")
    await i.channel?.send("재")
  }

  @command({ name: "cmdSync", description: "키뮤귀엽다" })
  async syncCommands(i: ChatInputCommandInteraction) {
    await i.deferReply()
    await cts.getApplicationCommandsExtension()!.sync()
    await i.editReply("명령어를 전부 동기화했어요!")
  }

  @listener({ event: "applicationCommandInvokeError", emitter: "cts" })
  async onError(e: Error) {
    await undefined
    this.logger.error(e)
  }
}

export const setup = async () => {
  return new SystemExtension()
}
