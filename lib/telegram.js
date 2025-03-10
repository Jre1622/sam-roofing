const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

// Telegram bot configuration
const token = "7710957028:AAGyYotndyvzsaa17nHdAqbufgYnUg04xkE";
const chatId = "-4754645595";

// Create a bot instance
const bot = token ? new TelegramBot(token, { polling: false }) : null;

/**
 * Send a message to the configured Telegram chat
 * @param {Object} formData - The form data to send
 * @returns {Promise<boolean>} - Whether the message was sent successfully
 */
async function sendContactFormMessage(formData) {
  if (!bot || !chatId) {
    console.warn("Telegram bot not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env file.");
    return false;
  }

  try {
    const { name, email, phone, service, message = "" } = formData;

    // Format the date in US/Central timezone (Minnesota)
    const options = {
      timeZone: "America/Chicago",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    const minnesotaTime = new Date().toLocaleString("en-US", options);

    // Format the message
    const formattedMessage = `
🔔 *NEW CONTACT FORM SUBMISSION*

👤 *Name:* ${name}
📱 *Phone:* ${phone}
📧 *Email:* ${email}
🔧 *Service:* ${service}
${message ? `\n💬 *Message:* ${message}` : ""}

📅 *Date (Minnesota Time):* ${minnesotaTime}
    `;

    // Send the message
    await bot.sendMessage(chatId, formattedMessage, { parse_mode: "Markdown" });
    console.log("Message sent to Telegram successfully");
    return true;
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
    return false;
  }
}

/**
 * Sends a general server message to the Telegram chat
 * Used for heartbeats, errors, and server status updates
 */
async function sendServerMessage(message) {
  if (!bot || !chatId) {
    console.warn("Telegram bot not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env file.");
    return false;
  }

  try {
    // Format with Minnesota time
    const options = {
      timeZone: "America/Chicago",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    const minnesotaTime = new Date().toLocaleString("en-US", options);

    // Add timestamp to the message
    const formattedMessage = `${message}\n\n📅 *Date (Minnesota Time):* ${minnesotaTime}`;

    // Send the message
    await bot.sendMessage(chatId, formattedMessage, { parse_mode: "Markdown" });
    console.log("Server message sent to Telegram successfully");
    return true;
  } catch (error) {
    console.error("Error sending server message to Telegram:", error);
    return false;
  }
}

/**
 * Send a career application submission to the configured Telegram chat
 * @param {Object} formData - The application form data to send
 * @returns {Promise<boolean>} - Whether the message was sent successfully
 */
async function sendCareerApplicationMessage(formData) {
  if (!bot || !chatId) {
    console.warn("Telegram bot not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env file.");
    return false;
  }

  try {
    const { fullname, email, phone, position, experience, message = "" } = formData;

    // Format the date in US/Central timezone (Minnesota)
    const options = {
      timeZone: "America/Chicago",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    const minnesotaTime = new Date().toLocaleString("en-US", options);

    // Format the message
    const formattedMessage = `
🔔 *NEW CAREER APPLICATION*

👤 *Name:* ${fullname}
📱 *Phone:* ${phone}
📧 *Email:* ${email}
💼 *Position:* ${position}
⏱️ *Experience:* ${experience}
${message ? `\n💬 *Message:* ${message}` : ""}

📅 *Date (Minnesota Time):* ${minnesotaTime}
    `;

    // Send the message
    await bot.sendMessage(chatId, formattedMessage, { parse_mode: "Markdown" });
    console.log("Career application sent to Telegram successfully");
    return true;
  } catch (error) {
    console.error("Error sending career application to Telegram:", error);
    return false;
  }
}

module.exports = {
  sendContactFormMessage,
  sendServerMessage,
  sendCareerApplicationMessage,
};
