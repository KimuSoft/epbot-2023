import { applicationCommand, Extension, listener } from "@pikokr/command.ts"
import {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  MessageActionRowComponentBuilder,
} from "discord.js"
import { redis } from "../index"
import { getRandomTurn, TurnData } from "../services/fish.services"
import { FishEventType } from "../types/fish.type"
import { findFishById } from "../game/fish"

class FishExtension extends Extension {
  @applicationCommand({
    name: "cancel_fishing",
    type: ApplicationCommandType.ChatInput,
    nameLocalizations: {
      ko: "낚시중지",
    },
    description: "호앵",
  })
  async cancelFishing(i: ChatInputCommandInteraction) {
    if (!(await redis.exists(`ep:fish:${i.user.id}`)))
      return i.reply("낚시중인 거 없는데...")

    await redis.del(`ep:fish:${i.user.id}`)
    await i.reply("낚시를 그만뒀다!")
  }

  @applicationCommand({
    name: "fish",
    type: ApplicationCommandType.ChatInput,
    nameLocalizations: {
      ko: "낚시",
      ja: "釣る",
    },
    description: "wow this is ping",
  })
  async fish(i: ChatInputCommandInteraction) {
    if (!i.channel) return

    // 이미 낚시 중인 경우
    if (await redis.exists(`ep:fish:${i.user.id}`))
      return i.reply("다른 낚시대랑 바람피는 거야...?")

    const epChannel = await i.channel.getEpChannel()
    redis.hmset(`ep:fish:${i.user.id}`, { event: FishEventType.Idle })

    await i.reply({
      content: `찌를 던졌다!`,
      components: getFishComponents(i.user.id),
    })

    while (true) {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * (Math.random() * 3 + 1) + i.client.ws.ping)
      )

      // 취소하는 등의 이유로 세션 데이터가 사라지면 종료
      if (!(await redis.exists(`ep:fish:${i.user.id}`)))
        return this.logger.debug("낚시 종료")

      const turn = getRandomTurn(epChannel)
      await i.editReply({
        content: turn.message || "...",
      })

      await redis.hmset(`ep:fish:${i.user.id}`, turn)
    }
  }

  @listener({ event: "interactionCreate" })
  async onFishHandler(i: ButtonInteraction) {
    if (!i.channel || !i.isButton()) return this.logger.info("no channel")
    if (!/^fish:\d+:/.test(i.customId))
      return this.logger.info("구액" + i.customId)

    // 다른 사람의 낚시 커맨드에 인터렉션한 경우
    const [_, userId, key] = i.customId.split(":")
    if (userId !== i.user.id)
      return i.reply({
        content: "남의 낚시대를 만지면 도둑!",
        ephemeral: true,
      })

    // 낚시 중이 아닌 경우
    const session = (await redis.hgetall(`ep:fish:${i.user.id}`)) as unknown as
      | TurnData
      | undefined
    if (!session) return i.reply("어라... 낚시대가 어디갔지?")

    // 낚시 취소 버튼을 누른 경우
    if (key === "cancel" && !session.catchKeys?.includes("cancel")) {
      await redis.del(`ep:fish:${i.user.id}`)
      return i.update({ content: "낚시를 그만뒀다!", components: [] })
    }

    console.log(session)

    // 물지 않았는데 누른 경우
    // @ts-ignore
    if (FishEventType[session.event] !== FishEventType.Bite) {
      await redis.del(`ep:fish:${i.user.id}`)
      return i.update({ content: "아무 것도 낚이지 않았어...", components: [] })
    }

    // 물었는데 잘못된 키를 누른 경우
    if (session.catchKeys && !session.catchKeys.includes(key)) {
      await redis.del(`ep:fish:${i.user.id}`)
      return i.update({ content: "물고기가 도망갔다...", components: [] })
    }

    const fish = findFishById(session.fishId!)

    await redis.del(`ep:fish:${i.user.id}`)
    await i.update({
      content: `낚시에 성공했다! ${fish?.name}을(를) 잡았다!`,
      components: [],
    })
  }
}

export const setup = async () => {
  return new FishExtension()
}

const getFishComponents = (userId: string) => [
  new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`fish:${userId}:a`)
      .setLabel("A")
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(`fish:${userId}:b`)
      .setLabel("B")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`fish:${userId}:x`)
      .setLabel("X")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`fish:${userId}:y`)
      .setLabel("Y")
      .setStyle(ButtonStyle.Secondary)
  ),
  new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`fish:${userId}:cancel`)
      .setLabel("낚시 그만하기")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("<:broken_paring:1064937598944030830>")
  ),
]
