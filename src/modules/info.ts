import { applicationCommand, Extension } from "@pikokr/command.ts"
import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js"
import dedent from "dedent"

class InfoExtension extends Extension {
  @applicationCommand({
    name: "profile",
    nameLocalizations: {
      ko: "프로필",
    },
    type: ApplicationCommandType.ChatInput,
    description: "wow this is ping",
  })
  async profile(i: ChatInputCommandInteraction) {
    await i.deferReply()
    console.log("꺙랴어랻")
    console.log(i.user.getEpUser)
    const user = await i.user.getEpUser()
    console.log("꺙랴ㅇㅇㅇ어랻")
    const embed = new EmbedBuilder().setTitle(user.name).setDescription(dedent`
        **유저 ID**: ${user.id}
        **유저 EXP**: ${user.exp}
        **유저 돈**: ${user.money}
      `)

    await i.editReply({ embeds: [embed] })
  }

  @applicationCommand({
    name: "info",
    nameLocalizations: {
      ko: "여기",
    },
    type: ApplicationCommandType.ChatInput,
    description: "wow this is ping",
  })
  async info(i: ChatInputCommandInteraction) {
    if (!i.channel) return
    const channel = await i.channel.getEpChannel()
    const embed = new EmbedBuilder().setTitle(channel.name)
      .setDescription(dedent`
        **채널 ID**: ${channel.id}
        **채널 타입**: ${channel.type}
        **채널 EXP**: ${channel.exp}
        **채널 레벨**: ${channel.point}
        **지형**: ${channel.biome}
        **날씨**: ${channel.weather}
      `)

    await i.reply({ embeds: [embed] })
  }
}

export const setup = async () => {
  return new InfoExtension()
}
