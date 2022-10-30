require("dotenv").config();

const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { intents, partials, permLevels } = require("./config.js");
const logger = require("./modules/logger.js");
const client = new Client({ intents, partials });

const commands = new Collection();
const aliases = new Collection();
const slashcmds = new Collection();

const levelCache = {};
for (let i = 0; i < permLevels.length; i++) {
  const thisLevel = permLevels[i];
  levelCache[thisLevel.name] = thisLevel.level;
}

client.container = {
  commands,
  aliases,
  slashcmds,
  levelCache,
};

const init = async () => {
  const commands = readdirSync("./commands/").filter((file) =>
    file.endsWith(".js")
  );

  for (const file of commands) {
    const props = require(`./commands/${file}`);
    logger.log(`Loading Command: ${props.help.name}. 👌`, "log");
    client.container.commands.set(props.help.name, props);
    props.conf.aliases.forEach((alias) => {
      client.container.aliases.set(alias, props.help.name);
    });
  }

  const slashFiles = readdirSync("./slash").filter((file) =>
    file.endsWith(".js")
  );
  for (const file of slashFiles) {
    const command = require(`./slash/${file}`);
    const commandName = file.split(".")[0];
    logger.log(`Loading Slash command: ${commandName}. 👌`, "log");

    client.container.slashcmds.set(command.commandData.name, command);
  }

  const eventFiles = readdirSync("./events/").filter((file) =>
    file.endsWith(".js")
  );
  for (const file of eventFiles) {
    const eventName = file.split(".")[0];
    logger.log(`Loading Event: ${eventName}. 👌`, "log");
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
  }

  client.on("threadCreate", (thread) => thread.join());

  client.login();
};

init();
