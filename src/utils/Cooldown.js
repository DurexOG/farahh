/**
 * Simple in-memory cooldown manager.
 * Production note: for multi-shard/multi-instance, use Redis or Mongo-backed cooldowns.
 */
class Cooldown {
  constructor() {
    /** @type {Map<string, number>} */
    this.timeouts = new Map();
  }

  /**
   * @param {string} key unique cooldown key (e.g., userId:command)
   * @param {number} ms duration in milliseconds
   * @returns {{expired: boolean, remainingMs: number}}
   */
  check(key, ms) {
    const now = Date.now();
    const expiresAt = this.timeouts.get(key);

    if (!expiresAt) return { expired: true, remainingMs: 0 };

    const remainingMs = expiresAt - now;
    if (remainingMs <= 0) {
      this.timeouts.delete(key);
      return { expired: true, remainingMs: 0 };
    }

    return { expired: false, remainingMs };
  }

  /**
   * @param {string} key
   * @param {number} ms
   */
  set(key, ms) {
    const expiresAt = Date.now() + ms;
    this.timeouts.set(key, expiresAt);
  }

  /** @param {string} key */
  clear(key) {
    this.timeouts.delete(key);
  }
}

module.exports = { Cooldown };

