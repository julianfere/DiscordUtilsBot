exports.run = async (client, interaction) => {
  // eslint-disable-line no-unused-vars
  await interaction.deferReply();
  const reply = await interaction.channel.guild.emojis.fetch();

  const emojis = reply
    .map((e) => (e.animated ? `<a:${e.name}:${e.id}>` : `<:${e.name}:${e.id}>`))
    .join(" ");

  await interaction.editReply(emojis);
};

exports.commandData = {
  name: "list",
  description: "list emojis",
  options: [],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: false,
};
