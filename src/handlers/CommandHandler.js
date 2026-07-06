const path = require("path");
const fs = require("fs-extra");
const { Collection } = require("discord.js");
const config = require("../../config");

/**
 * Prefix command handler (message-based).
 */
class CommandHandler {
  /**
   * @param {{ client: import('discord.js').Client, logger: any }} options
   */
  constructor(options = {}) {
    this.client = options.client;
    this.logger = options.logger;

    this.commandsRoot = path.join(__dirname, "..", "commands");
  }

  /**
   * Load prefix commands.
   */
  async load() {
    if (!fs.existsSync(this.commandsRoot)) {
      this.logger.warn("No prefix commands directory found.");
      return;
    }

    const files = this._collectCommandFiles(this.commandsRoot);
    let loaded = 0;

    for (const file of files) {
      const mod = require(file);
      const cmd = mod?.default || mod;
      if (!cmd?.data?.name) continue;

      const name = cmd.data.name;
      this.client.prefixCommands.set(name, cmd);
      loaded++;
    }

    this.logger.info(`✓ Prefix Commands Loaded (${loaded})`);

    // Bind message handler for prefix commands.
    this.client.on("messageCreate", async (message) => {
      try {
        if (message.author.bot) return;
        if (!message.guild) return; // keep safe: guild-only by default

        const prefix = config.discord?.prefix || ".";
        if (!message.content.startsWith(prefix)) return;

        const raw = message.content.slice(prefix.length).trim();
        if (!raw) return;

        const [name, ...args] = raw.split(/\s+/);
        const command = this.client.prefixCommands.get(name?.toLowerCase?.() || name);
        if (!command) return;

        if (command.meta?.guildOnly && !message.guild) return;

        const isOwner = !!this.client.user && command.meta?.ownerOnly ? this.client._owners?.includes?.(message.author.id) : false;
        // Minimal permission hook: full permissions checks will be expanded later.

        if (command.meta?.ownerOnly && !isOwner) {
          return message.reply("This command is owner-only.");
        }

        if (command.meta?.guildOnly && !message.guild) {
          return message.reply("This command is guild-only.");
        }

        if (command.execute) {
          await command.execute({ client: this.client, message, args, logger: this.logger });
        }
      } catch (e) {
        this.logger.error(e?.stack || e);
      }
    });
  }

  _collectCommandFiles(dirAbs) {
    const out = [];
    const items = fs.readdirSync(dirAbs);
    for (const item of items) {
      const full = path.join(dirAbs, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) out.push(...this._collectCommandFiles(full));
      else if (stat.isFile() && item.endsWith(".js")) out.push(full);
    }
    return out;
  }
}

module.exports = { CommandHandler };

