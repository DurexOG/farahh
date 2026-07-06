const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    // Prefix commands are handled by CommandHandler.
    return;
  }
};

