const { Client, GatewayIntentBits, Partials, Collection, Events } = require("discord.js");
const mongoose = require("mongoose");
const config = require("../../config");
const { Logger } = require("../utils/Logger");

/**
 * @typedef {import("discord.js").ChatInputCommandInteraction} ChatInputCommandInteraction
 */

/**
 * Farah client.
 * Responsible for boot sequence: MongoDB connection, loading handlers (commands, slash, events), and centralized error capture.
 */
class Farah extends Client {
  /**
   * @param {object} [options]
   */
  constructor(options = {}) {
    const logger = options.logger || new Logger({ botName: config.bot?.name || "Farah" });

    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
      ],
      partials: [Partials.Channel],
      allowedMentions: { repliedUser: true },
      shards: options.shards ?? undefined,
      ...options.discordClientOptions
    });

    this.logger = logger;
    this.config = config;

    /** @type {import('mongoose').Mongoose | null} */
    this.mongoose = mongoose;

    this.prefixCommands = new Collection();
    this.slashCommands = new Collection();
    this.cooldowns = new Map();

    this._booted = false;

    // Bind error handlers.
    this.on(Events.Error, (error) => {
      this.logger.error(`Discord.js error: ${error?.stack || error}`);
    });
  }

  /**
   * Connect MongoDB using mongoose.
   */
  async initializeMongoose() {
    const uri = this.config.database?.mongoURI;
    if (!uri) throw new Error("Missing MONGO_URI in environment/config.");

    mongoose.set("strictQuery", true);
    mongoose.connection.on("connected", () => {
      this.logger.info("✓ Database Connected");
    });

    mongoose.connection.on("error", (err) => {
      this.logger.error(`MongoDB connection error: ${err?.stack || err}`);
    });

    await mongoose.connect(uri, {
      autoIndex: false
    });

    return mongoose.connection;
  }

  /**
   * Load all events.
   * @returns {Promise<void>}
   */
  async loadEvents() {
    const { EventHandler } = require("../handlers/EventHandler");
    const handler = new EventHandler({ client: this, logger: this.logger });
    await handler.load();
  }

  /**
   * Load prefix + slash commands.
   * @returns {Promise<void>}
   */
  async loadMain() {
    const { CommandHandler } = require("../handlers/CommandHandler");
    const { SlashHandler } = require("../handlers/SlashHandler");

    await new CommandHandler({ client: this, logger: this.logger }).load();
    await new SlashHandler({ client: this, logger: this.logger }).load();

    // Register application commands once the client is ready.
    this.once(Events.ClientReady, async () => {
      try {
        await new SlashHandler({ client: this, logger: this.logger }).register();
      } catch (e) {
        this.logger.error(`Slash registration failed: ${e?.stack || e}`);
      }
    });
  }

  /**
   * Centralized input validation utility.
   * @param {string} value
   * @param {number} [max=200]
   */
  validateString(value, max = 200) {
    if (typeof value !== "string") return "";
    const trimmed = value.trim();
    if (trimmed.length > max) return trimmed.slice(0, max);
    return trimmed;
  }
}

module.exports = Farah;

