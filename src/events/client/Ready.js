const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  /**
   * @param {import('discord.js').Client} client
   */
  async execute(client) {
    const tag = client.user?.tag || "Farah";
    console.log(`✅ Bot Ready: ${tag}`);
  }
};

