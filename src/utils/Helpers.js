const { PermissionsBitField } = require("discord.js");

class Helpers {
  /** @param {string} str @param {number} max */
  static clampString(str, max = 200) {
    if (typeof str !== "string") return "";
    const t = str.trim();
    if (t.length <= max) return t;
    return t.slice(0, max);
  }

  /**
   * Converts a Discord.js permission string into a bitfield check.
   * @param {string} permission
   */
  static isValidPermission(permission) {
    if (!permission || typeof permission !== "string") return false;
    try {
      PermissionsBitField.Flags[permission];
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = { Helpers };

