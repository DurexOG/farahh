require("dotenv").config();

const config = require("./config");
const Farah = require("./src/structures/Farah");
const { Logger } = require("./src/utils/Logger");

const logger = new Logger({ botName: config.bot?.name || "Farah" });

/**
 * Starts the bot.
 */
async function start() {
  try {
    console.clear();

    logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.info(`🤍 Starting ${config.bot?.name || "Farah"}...`);
    logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const client = new Farah({ logger });

    // Global safety nets (process-level)
    process.on("unhandledRejection", (reason) => {
      logger.error(`Unhandled Promise Rejection: ${reason?.stack || reason}`);
    });

    process.on("uncaughtException", (error) => {
      logger.error(`Uncaught Exception: ${error?.stack || error}`);
    });

    process.on("uncaughtExceptionMonitor", (error) => {
      logger.error(`Exception Monitor: ${error?.stack || error}`);
    });

    // Boot
    await client.initializeMongoose();
    await client.loadEvents();
    await client.loadMain();

    logger.info("✓ Bot Ready Startup");

    await client.login(config.discord?.token);
  } catch (error) {
    logger.error(`❌ Failed to start Farah: ${error?.stack || error}`);
    process.exit(1);
  }
}

start();

