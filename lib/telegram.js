const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

// Replace with your bot token from environment variables
const token = process.env.TELEGRAM_BOT_TOKEN;
// Your friend's chat ID from environment variables
const chatId = process.env.TELEGRAM_CHAT_ID;

// Initialize the bot
const bot = new TelegramBot(token, { polling: false });

/**
 * Send a message to the roofing company owner via Telegram
 * @param {string} message - The message to send (can include HTML formatting)
 * @returns {Promise<boolean>} - Whether the message was sent successfully
 */
const sendMessage = async (message) => {
  try {
    if (!token || !chatId) {
      console.warn("Telegram bot token or chat ID not configured");
      return false;
    }

    await bot.sendMessage(chatId, message, { parse_mode: "HTML" });
    return true;
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    return false;
  }
};

/**
 * Send a lead notification to the roofing company owner
 * @param {Object} lead - The lead information
 * @returns {Promise<boolean>} - Whether the message was sent successfully
 */
const sendLeadNotification = async (lead) => {
  const { name, email, phone, message, service } = lead;

  const telegramMessage = `
<b>🏠 New Roofing Lead!</b>

<b>Name:</b> ${name}
<b>Email:</b> ${email}
<b>Phone:</b> ${phone}
<b>Service:</b> ${service || "Not specified"}
<b>Message:</b> 
${message}

<i>Submitted: ${new Date().toLocaleString()}</i>
`;

  return sendMessage(telegramMessage);
};

/**
 * Send website stats to the roofing company owner
 * @param {Object} stats - The website statistics
 * @returns {Promise<boolean>} - Whether the message was sent successfully
 */
const sendStats = async (stats) => {
  const { visitorsToday, pageViews, popularPage, uptime } = stats;

  const message = `
<b>📊 Website Stats Update</b>

<b>Visitors Today:</b> ${visitorsToday}
<b>Page Views:</b> ${pageViews}
<b>Most Popular Page:</b> ${popularPage}
<b>Uptime:</b> ${uptime}%

<i>Updated: ${new Date().toLocaleString()}</i>
`;

  return sendMessage(message);
};

module.exports = {
  sendMessage,
  sendLeadNotification,
  sendStats,
  bot,
};
