const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

/**
 * @typedef {object} EmbedOptions
 * @property {string} [title]
 * @property {string} [description]
 * @property {string} [color]
 * @property {Array<{name: string, value: string, inline?: boolean}>} [fields]
 * @property {string} [footerText]
 * @property {string} [thumbnail]
 */

/**
 * Reusable themed embed factory (Farah theme).
 */
class Embed {
  /**
   * @param {EmbedOptions} options
   */
  static build(options = {}) {
    const color = options.color || config.embeds?.color || "#ff69b4";

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTimestamp();

    if (options.title) embed.setTitle(options.title);
    if (options.description) embed.setDescription(options.description);

    if (Array.isArray(options.fields) && options.fields.length) {
      for (const f of options.fields) {
        if (!f?.name || typeof f.value !== "string") continue;
        embed.addFields({ name: f.name, value: f.value, inline: f.inline ?? false });
      }
    }

    if (options.thumbnail) embed.setThumbnail(options.thumbnail);

    const footerText = options.footerText || config.bot?.footer || "Powered by Farah";
    embed.setFooter({ text: footerText });

    return embed;
  }

  /** @param {string} description */
  static success(description, title = "Success") {
    return Embed.build({
      title,
      description,
      color: config.embeds?.success || "#57F287"
    });
  }

  /** @param {string} description */
  static error(description, title = "Error") {
    return Embed.build({
      title,
      description,
      color: config.embeds?.error || "#ED4245"
    });
  }

  /** @param {string} description */
  static warning(description, title = "Warning") {
    return Embed.build({
      title,
      description,
      color: config.embeds?.warning || "#FEE75C"
    });
  }

  /** @param {string} description */
  static info(description, title = "Info") {
    return Embed.build({
      title,
      description,
      color: config.embeds?.info || "#5865F2"
    });
  }
}

module.exports = { Embed };

