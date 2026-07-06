const { Events } = require("discord.js");

/**
 * Compatibility event file.
 * Prefix commands are handled directly inside CommandHandler.
 * This file exists so loader expectations for MessageCreate routing stay consistent.
 */
module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    return;
  }
};

