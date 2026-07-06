/**
 * ----------------------------------------------------
 * Farah Discord Bot Configuration
 * ----------------------------------------------------
 */

require("dotenv").config();

module.exports = {
    // ==========================
    // BOT INFORMATION
    // ==========================
    bot: {
        name: "Farah",
        version: "2.0.0",
        developers: ["KriXna"],
        color: "#ff69b4",
        footer: "Powered by Farah",
        invite: process.env.BOT_INVITE || "",
        support: process.env.SUPPORT_SERVER || "",
        website: process.env.WEBSITE || ""
    },

    // ==========================
    // DISCORD
    // ==========================
    discord: {
        token: process.env.TOKEN,
        clientId: process.env.CLIENT_ID,
        guildId: process.env.GUILD_ID,

        owners: process.env.OWNERS
            ? process.env.OWNERS.split(",")
            : [],

        prefix: process.env.PREFIX || ".",

        activity: {
            name: "Protecting Your Server 🤍",
            type: "Watching", // Playing | Listening | Watching | Competing
            status: "online" // online | idle | dnd | invisible
        }
    },

    // ==========================
    // DATABASE
    // ==========================
    database: {
        mongoURI: process.env.MONGO_URI
    },

    // ==========================
    // EMBEDS
    // ==========================
    embeds: {
        color: "#ff69b4",
        success: "#57F287",
        error: "#ED4245",
        warning: "#FEE75C",
        info: "#5865F2"
    },

    // ==========================
    // MODERATION
    // ==========================
    moderation: {
        defaultCooldown: 3,
        maxWarnings: 3,
        antiSpam: true,
        antiLink: false,
        antiInvite: false
    },

    // ==========================
    // LOGGING
    // ==========================
    logs: {
        enabled: true,
        console: true
    },

    // ==========================
    // EMOJIS
    // ==========================
    emojis: {
        success: "✅",
        error: "❌",
        warning: "⚠️",
        loading: "⏳",
        owner: "👑",
        shield: "🛡️"
    }
};