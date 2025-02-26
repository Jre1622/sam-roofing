const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
const { sendMessage, sendLeadNotification } = require("./lib/telegram");
require("dotenv").config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Parse URL-encoded bodies and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Basic routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "Sam's Roofing - Professional Roofing, Siding & Gutters",
    active: "home",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Us | Sam's Roofing",
    active: "about",
  });
});

app.get("/services", (req, res) => {
  res.render("services", {
    title: "Our Services | Sam's Roofing",
    active: "services",
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact Us | Sam's Roofing",
    active: "contact",
  });
});

// Contact form submission route
app.post("/submit-contact", async (req, res) => {
  try {
    const { name, email, phone, message, service } = req.body;

    // Send notification to Telegram
    await sendLeadNotification({ name, email, phone, message, service });

    // Render thank you page
    res.render("thank-you", {
      title: "Thank You | Sam's Roofing",
      active: "contact",
    });
  } catch (error) {
    console.error("Error processing form submission:", error);
    res.status(500).send("Something went wrong. Please try again later.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);

  // Send startup notification to Telegram if configured
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    sendMessage(`🚀 <b>Sam's Roofing website is now online!</b>\nStarted at: ${new Date().toLocaleString()}`);
  }
});
