const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    // SlashHandler already handles chat input commands.
    // Keep this file for future button/select/menu/modal routing.
    return;
  }
};

