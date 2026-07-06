const path = require("path");
const fs = require("fs-extra");
const { REST, Routes, Collection } = require("discord.js");
const config = require("../../config");

/**
 * Slash command loader and registrar.
 */
class SlashHandler {
  /**
   * @param {{ client: import('discord.js').Client, logger: any }} options
   */
  constructor(options = {}) {
    this.client = options.client;
    this.logger = options.logger;
    this.commandsRoot = path.join(__dirname, "..", "commands");

    this._slashFiles = [];
  }

  /**
   * Load slash command definitions (ChatInputCommand only).
   */
  async load() {
    if (!fs.existsSync(this.commandsRoot)) return;

    const files = this._collectCommandFiles(this.commandsRoot);

    let loaded = 0;
    for (const file of files) {
      const mod = require(file);
      const cmd = mod?.default || mod;
      if (!cmd?.data || typeof cmd.data.toJSON !== "function") continue;

      // Support either meta.commandType or exported property.
      const dataJson = cmd.data.toJSON();
      if (!dataJson?.name) continue;

      // Register only chat input commands by default.
      if (cmd.type && cmd.type !== "CHAT_INPUT") continue;

      this.client.slashCommands.set(dataJson.name, cmd);
      this._slashFiles.push(cmd);
      loaded++;
    }

    this.logger.info(`✓ Slash Commands Loaded (${loaded})`);

    this.client.on("interactionCreate", async (interaction) => {
      try {
        if (!interaction.isChatInputCommand()) return;

        const command = this.client.slashCommands.get(interaction.commandName);
        if (!command) return;

        const guildOnly = !!command.meta?.guildOnly;
        const ownerOnly = !!command.meta?.ownerOnly;
        if (guildOnly && !interaction.guild) {
          return interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
        }

        if (ownerOnly) {
          const owners = config.discord?.owners || [];
          if (!owners.includes(interaction.user.id)) {
            return interaction.reply({ content: "This command is owner-only.", ephemeral: true });
          }
        }

        await command.execute(interaction, { client: this.client, logger: this.logger });
      } catch (e) {
        this.logger.error(e?.stack || e);
        if (interaction?.isRepliable && interaction?.isRepliable()) {
          await interaction.reply({ content: "An error occurred while executing that command.", ephemeral: true }).catch(() => {});
        }
      }
    });
  }

  /**
   * Register slash commands globally (or for a guild if configured).
   */
  async register() {
    const token = config.discord?.token;
    const clientId = config.discord?.clientId;
    if (!token || !clientId) {
      throw new Error("Missing DISCORD token / clientId in config.");
    }

    const rest = new REST({ version: "10" }).setToken(token);

    const commands = [...this.client.slashCommands.values()].map((c) => c.data.toJSON());

    const guildId = config.discord?.guildId;
    const route = guildId ? Routes.applicationGuildCommands(clientId, guildId) : Routes.applicationCommands(clientId);

    await rest.put(route, { body: commands });
    this.logger.info("✓ Slash Commands Registered");
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

module.exports = { SlashHandler };

