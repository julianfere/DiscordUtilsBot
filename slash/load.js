const fs = require("fs");
const path = require("path");

function normalizeName(name) {
  return path.basename(name).split(".")[0];
}

function getEmojisPaths() {
  let p = path.resolve("./emojis");
  let files = fs.readdirSync(p);

  return files.map((f) => `./emojis/${f}`);
}

exports.run = async (client, interaction) => {
  await interaction.deferReply();
  const channel = interaction.channel;
  const guild = channel.guild;
  const emojis = getEmojisPaths().splice(0, 50);
  try {
    const responeMessage = [];
    interaction.editReply("Loading...");
    for (const emoji of emojis) {
      const emo = await guild.emojis.create(emoji, normalizeName(emoji));
      responeMessage.push(`<a:${emo.name}:${emo.id}>`);
    }
    channel.send(
      responseMessage.length > 0 ? responeMessage.join(" ") : "No emojis found"
    );
  } catch (error) {
    console.log(error);
  } finally {
    await interaction.editReply("Done!");
  }
};

exports.commandData = {
  name: "load",
  description: "load emojis",
  options: [],
  defaultPermission: true,
};

exports.conf = {
  permLevel: "Owner",
  guildOnly: false,
};
