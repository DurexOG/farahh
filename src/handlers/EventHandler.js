const path = require("path");
const fs = require("fs-extra");
const { Events } = require("discord.js");

/**
 * Loads and registers event files.
 */
class EventHandler {
  /**
   * @param {{ client: import('discord.js').Client, logger: any }} options
   */
  constructor(options = {}) {
    this.client = options.client;
    this.logger = options.logger;

    /** @type {string} */
    this.eventsRoot = path.join(__dirname, "..", "events");
  }

  /**
   * @returns {Promise<void>}
   */
  async load() {
    if (!fs.existsSync(this.eventsRoot)) return;

    const files = this._collectJsFiles(this.eventsRoot);

    for (const file of files) {
      // file exports either: { name, once, execute } OR class/function with execute
      const mod = require(file);
      const evt = mod?.default || mod;

      const name = evt?.name || path.basename(file, path.extname(file));
      const once = evt?.once ?? false;
      const execute = evt?.execute || evt;

      if (typeof execute !== "function") continue;

      // Map our folder naming to Discord.js event name if needed.
      const eventName = name in Events ? name : name;

      if (once) this.client.once(eventName, execute.bind(this.client));
      else this.client.on(eventName, execute.bind(this.client));
    }

    this.logger.info("✓ Events Loaded");
  }

  _collectJsFiles(dirAbs) {
    const out = [];
    const items = fs.readdirSync(dirAbs);
    for (const item of items) {
      const full = path.join(dirAbs, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) out.push(...this._collectJsFiles(full));
      else if (stat.isFile() && item.endsWith(".js")) out.push(full);
    }
    return out;
  }
}

module.exports = { EventHandler };

