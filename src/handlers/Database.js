const mongoose = require("mongoose");

/**
 * Thin wrapper for database connection.
 */
class Database {
  /**
   * @param {{ uri: string, logger: any }} options
   */
  constructor(options = {}) {
    this.uri = options.uri;
    this.logger = options.logger;
  }

  /**
   * @returns {Promise<mongoose.Connection>}
   */
  async connect() {
    if (!this.uri) throw new Error("Missing MongoDB connection URI.");

    mongoose.set("strictQuery", true);
    await mongoose.connect(this.uri, { autoIndex: false });

    this.logger?.info?.("✓ Database Connected");

    return mongoose.connection;
  }
}

module.exports = { Database };

