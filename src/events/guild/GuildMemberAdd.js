const { Events } = require("discord.js");

module.exports = {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member) {
    // Placeholder welcome system will be implemented later.
    // Keeping this event file for architecture completeness.
    return;
  }
};

