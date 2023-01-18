type Config = {
  token: string
  guilds: string[]
  db: string
}

export const config: Config = require("../config.json")
