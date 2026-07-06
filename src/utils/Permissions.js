const config = require("../../config");

/**
 * Helpers for permission logic.
 */
class Permissions {
  /**
   * @param {import('discord.js').User} user
   * @returns {boolean}
   */
  static isOwner(user) {
    if (!user?.id) return false;
    const owners = config.discord?.owners || [];
    return owners.includes(user.id);
  }

  /**
   * @param {import('discord.js').GuildMember | null} member
   * @param {string} permission
   * @returns {boolean}
   */
  static hasPermission(member, permission) {
    if (!member?.permissions || !permission) return false;
    try {
      return member.permissions.has(permission);
    } catch {
      return false;
    }
  }

  /**
   * Validate that a command is allowed in this context.
   * @param {object} ctx
   * @param {boolean} [ctx.guildOnly]
   * @param {import('discord.js').Guild | null} [ctx.guild]
   */
  static assertContext(ctx = {}) {
    if (ctx.guildOnly && !ctx.guild) {
      const err = new Error("This command can only be used in a guild.");
      err.code = "GUILD_ONLY";
      throw err;
    }

    if (ctx.ownerOnly && !ctx.isOwner) {
      const err = new Error("This command is owner-only.");
      err.code = "OWNER_ONLY";
      throw err;
    }
  }
}

module.exports = { Permissions };

