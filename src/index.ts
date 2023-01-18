import { Client } from "discord.js"
import { config } from "./config"
import { CustomizedCommandClient } from "./structures"
import Redis from "ioredis"
import { Logger } from "tslog"
import mongoose from "mongoose"

export const logger = new Logger()

process.on("uncaughtException", (err) => {
  logger.error(err)
})
process.on("unhandledRejection", (err) => {
  logger.error(err)
})

const client = new Client({
  intents: ["Guilds", "DirectMessages"],
})

export const redis = new Redis(6379, "127.0.0.1")

export const cts = new CustomizedCommandClient(client)

const start = async () => {
  logger.info("Connecting to MongoDB...")
  await mongoose.connect(config.db)

  logger.info("Connecting to Discord...")
  await cts.setup()

  await client.login(config.token)

  await cts.enableTextCommandsExtension({
    prefix: "미도리야 ",
  })

  await cts.getApplicationCommandsExtension()!.sync()
}

start().then()
