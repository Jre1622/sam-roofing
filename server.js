const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
const { sendContactFormMessage, sendServerMessage } = require("./lib/telegram");
require("dotenv").config();

// Base URL for canonical links
const baseUrl = "https://www.hiremaverick.com";

// Monitoring constants
const HEARTBEAT_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
const SLOW_REQUEST_THRESHOLD = 1000; // 1 second (in milliseconds)
const PERFORMANCE_ALERT_COOLDOWN = 30 * 60 * 1000; // 30 minutes in milliseconds

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
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to all requests
app.use(limiter);

// Monitoring stats
let lastPerformanceAlert = 0;
let requestStats = {
  totalRequests: 0,
  slowRequests: 0,
  errors: 0,
  startTime: Date.now(),
};

// Performance monitoring middleware
app.use((req, res, next) => {
  const start = Date.now();
  requestStats.totalRequests++;

  // Once the response is finished
  res.on("finish", () => {
    const duration = Date.now() - start;

    // Only log slow requests to the console
    if (duration > SLOW_REQUEST_THRESHOLD) {
      requestStats.slowRequests++;
      console.log(`⚠️ Slow request: ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);

      // Alert on slow requests, but use cooldown to prevent spam
      const now = Date.now();
      if (now - lastPerformanceAlert > PERFORMANCE_ALERT_COOLDOWN) {
        lastPerformanceAlert = now;
        sendServerMessage(`⚠️ *Performance Alert*\n` + `Slow request detected: \`${req.method} ${req.originalUrl}\`\n` + `Response time: *${duration}ms*\n` + `Status code: *${res.statusCode}*`).catch(
          (err) => console.error("Failed to send performance alert:", err)
        );
      }
    }

    // Track server errors
    if (res.statusCode >= 500) {
      requestStats.errors++;
      console.log(`🔴 Server error: ${req.method} ${req.originalUrl} ${res.statusCode}`);

      // Always alert on server errors
      sendServerMessage(`🔴 *Server Error*\n` + `Error on: \`${req.method} ${req.originalUrl}\`\n` + `Status code: *${res.statusCode}*`).catch((err) =>
        console.error("Failed to send error alert:", err)
      );
    }
  });

  next();
});

// Basic routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "Maverick Contracting INC | Full-Service Exterior Remodeler in Minnesota",
    description:
      "Maverick Contracting provides professional roofing, siding, windows, and gutter services for residential properties in Minnesota. Serving Minneapolis, St. Paul, and surrounding areas.",
    active: "home",
    canonical: `${baseUrl}/`,
  });
});

// Storm Damage Routes
app.get("/storm-damage/residential", (req, res) => {
  res.render("storm-damage/residential", {
    title: "Residential Storm Damage Services | Maverick Contracting",
    description:
      "Expert residential storm damage repair and restoration services in Minnesota. We help homeowners recover from hail, wind, and storm damage with quality repairs and insurance claim assistance.",
    active: "storm-damage-residential",
    canonical: `${baseUrl}/storm-damage/residential`,
  });
});

app.get("/storm-damage/multi-family", (req, res) => {
  res.render("storm-damage/multi-family", {
    title: "Multi-Family Storm Damage Repair | Maverick Contracting",
    description: "Comprehensive storm damage repair services for multi-family properties in Minnesota. We handle everything from assessment to restoration for apartments, condos, and townhomes.",
    active: "storm-damage-multi-family",
    canonical: `${baseUrl}/storm-damage/multi-family`,
  });
});

app.get("/storm-damage/emergency-services", (req, res) => {
  res.render("storm-damage/emergency-services", {
    title: "Emergency Storm Damage Services | Maverick Contracting",
    description: "24/7 emergency storm damage services in Minnesota. Fast response to protect your property from further damage after severe weather events.",
    active: "storm-damage-emergency-services",
    canonical: `${baseUrl}/storm-damage/emergency-services`,
  });
});

app.get("/storm-damage/insurance-claims", (req, res) => {
  res.render("storm-damage/insurance-claims", {
    title: "Storm Damage Insurance Claims Assistance | Maverick Contracting",
    description: "Expert guidance through the storm damage insurance claim process in Minnesota. We work with your insurance company to ensure you receive fair compensation for repairs.",
    active: "storm-damage-insurance-claims",
    canonical: `${baseUrl}/storm-damage/insurance-claims`,
  });
});

app.get("/storm-damage/roof-tarping", (req, res) => {
  res.render("storm-damage/roof-tarping", {
    title: "Emergency Roof Tarping Services | Maverick Contracting",
    description: "Professional roof tarping services in Minnesota to prevent further damage after storms. Quick response to protect your home or business from water damage.",
    active: "storm-damage-roof-tarping",
    canonical: `${baseUrl}/storm-damage/roof-tarping`,
  });
});

app.get("/services", (req, res) => {
  res.render("services", {
    title: "Our Services | Maverick Contracting INC - Minnesota",
    description:
      "Explore our comprehensive exterior remodeling services including roofing, siding, windows, and gutters in Minnesota. Quality workmanship guaranteed throughout Minneapolis, St. Paul, and surrounding communities.",
    active: "services",
    canonical: `${baseUrl}/services`,
  });
});

app.get("/roofing", (req, res) => {
  res.render("roofing", {
    title: "Expert Roofing Services in Minnesota | Maverick Contracting",
    description: "Professional roof installation, repair, and replacement services in Minneapolis, St. Paul, and surrounding Minnesota areas. Quality materials and expert craftsmanship guaranteed.",
    active: "roofing",
    canonical: `${baseUrl}/roofing`,
  });
});

app.get("/siding", (req, res) => {
  res.render("siding", {
    title: "Professional Siding Installation in Minnesota | Maverick Contracting",
    description:
      "Transform your Minnesota home with premium siding solutions from Maverick Contracting. Serving Minneapolis, St. Paul, and surrounding communities with quality siding installation and repair.",
    active: "siding",
    canonical: `${baseUrl}/siding`,
  });
});

app.get("/windows", (req, res) => {
  res.render("windows", {
    title: "Energy-Efficient Window Installation in Minnesota | Maverick Contracting",
    description: "Upgrade to energy-efficient windows perfect for Minnesota's climate. Professional installation serving Minneapolis, St. Paul, and surrounding areas with quality window solutions.",
    active: "windows",
    canonical: `${baseUrl}/windows`,
  });
});

app.get("/gutters", (req, res) => {
  res.render("gutters", {
    title: "Seamless Gutter Installation in Minnesota | Maverick Contracting",
    description: "Protect your Minnesota home from water damage with professional gutter solutions. Serving Minneapolis, St. Paul, and surrounding areas with seamless gutter installation and repair.",
    active: "gutters",
    canonical: `${baseUrl}/gutters`,
  });
});

app.get("/testimonials", (req, res) => {
  res.render("testimonials", {
    title: "Minnesota Customer Testimonials | Maverick Contracting",
    description:
      "Read what our satisfied Minnesota customers in Minneapolis, St. Paul, and surrounding areas have to say about Maverick Contracting's exterior remodeling services and exceptional customer care.",
    active: "testimonials",
    canonical: `${baseUrl}/testimonials`,
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact Maverick Contracting | Request a Free Estimate in Minnesota",
    description:
      "Contact Maverick Contracting for a free estimate on your exterior remodeling project. Serving Minneapolis, St. Paul, and all surrounding Minnesota communities with quality exterior solutions.",
    active: "contact",
    canonical: `${baseUrl}/contact`,
  });
});

app.get("/privacy", (req, res) => {
  res.render("privacy", {
    title: "Privacy Policy | Maverick Contracting INC - Minnesota",
    description: "Read Maverick Contracting's privacy policy outlining how we collect, use, and protect your personal information. Serving Minnesota homeowners with transparency and integrity.",
    active: "none",
    canonical: `${baseUrl}/privacy`,
  });
});

// Contact form submission route
app.post("/submit-contact", async (req, res) => {
  try {
    const { name, email, phone, message, service } = req.body;

    // Log the form submission
    console.log(`📝 Form submission received from ${name} (${email}) - Service: ${service}`);

    // Send to Telegram
    await sendContactFormMessage({ name, email, phone, message, service });

    // Render thank you page
    res.render("thank-you", {
      title: "Thank You | Maverick Contracting INC - Minnesota",
      description:
        "Thank you for contacting Maverick Contracting. We appreciate your interest and will get back to you shortly. Proudly serving Minnesota homeowners with quality exterior remodeling services.",
      active: "contact",
      canonical: `${baseUrl}/thank-you`,
    });
  } catch (error) {
    console.error("❌ Error processing form submission:", error);
    res.status(500).send("Something went wrong. Please try again later.");
  }
});

// Roofle webhook route
app.post("/webhooks/roofle", async (req, res) => {
  try {
    // Log the webhook data
    console.log("🏠 Roofle webhook received");

    // Extract only the basic information
    const { firstName, lastName, email, phone } = req.body;

    // Format customer name
    const name = `${firstName || ""} ${lastName || ""}`.trim() || "Not provided";

    // Format the data for Telegram using the same structure as contact form
    const formData = {
      name,
      email: email || "Not provided",
      phone: phone || "Not provided",
      service: "Roofle Roof Quote",
      message: "Submitted through Roofle widget",
    };

    // Send to Telegram using existing function
    await sendContactFormMessage(formData);

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Webhook received and processed successfully",
    });
  } catch (error) {
    console.error("❌ Error processing Roofle webhook:", error);

    // Still return a 200 status code to prevent Roofle from retrying
    res.status(200).json({
      success: false,
      message: "Error processing webhook, but request received",
    });
  }
});

// Only accessible in development mode
if (process.env.NODE_ENV !== "production") {
  // Test endpoint for heartbeat (development only)
  app.get("/dev/test-heartbeat", (req, res) => {
    // Trigger a heartbeat
    safeHeartbeat();
    res.send("Heartbeat test triggered. Check Telegram for the message.");
  });

  // Test endpoint for error notification (development only)
  app.get("/dev/test-error", (req, res) => {
    requestStats.errors++;
    sendServerMessage("🔴 *Test Error Alert*\nThis is a test error notification").catch(console.error);
    res.send("Error test triggered. Check Telegram for the message.");
  });

  console.log("🔧 Development testing endpoints enabled");
}

// 404 handler - must be the last route
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found | Maverick Contracting INC - Minnesota",
    description: "The page you're looking for could not be found. Maverick Contracting provides professional exterior remodeling services in Minnesota.",
    active: "none",
  });
});

// Helper function to format uptime
function formatUptime(milliseconds) {
  const seconds = milliseconds / 1000;
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${days}d ${hours}h ${minutes}m`;
}

// Function to send heartbeat with stats
async function sendHeartbeatMessage() {
  try {
    const now = Date.now();
    const uptime = now - requestStats.startTime;
    const memoryUsage = process.memoryUsage();

    // Calculate request stats
    const uptimeHours = uptime / 3600000;
    const requestsPerHour = uptimeHours > 0 ? (requestStats.totalRequests / uptimeHours).toFixed(1) : "0.0";

    const message =
      `💓 *Server Health Report*\n` +
      `⏱️ Uptime: ${formatUptime(uptime)}\n` +
      `📊 Stats (since ${new Date(requestStats.startTime).toLocaleString()}):\n` +
      `   • Total Requests: ${requestStats.totalRequests}\n` +
      `   • Requests/Hour: ${requestsPerHour}\n` +
      `   • Slow Requests: ${requestStats.slowRequests}\n` +
      `   • Server Errors: ${requestStats.errors}\n` +
      `🧠 Memory: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`;

    await sendServerMessage(message);
    console.log("💓 Health report sent to Telegram");
  } catch (error) {
    console.error("❌ Failed to send heartbeat:", error);
  }
}

// Safe heartbeat function with error handling
function safeHeartbeat() {
  try {
    sendHeartbeatMessage();
  } catch (error) {
    console.error("Failed to generate or send heartbeat:", error);

    // Reset stats if we encounter issues processing them
    requestStats = {
      totalRequests: 0,
      slowRequests: 0,
      errors: 0,
      startTime: Date.now(),
    };

    // Try to send a simplified heartbeat instead
    sendServerMessage("💓 *Server is still running*\nEncountered an error generating detailed stats.").catch(console.error);
  }
}

// Handle uncaught exceptions
process.on("uncaughtException", async (error) => {
  console.error("🔥 Uncaught Exception:", error);
  await sendServerMessage(`🔥 *CRITICAL ERROR: Uncaught exception*\n\`\`\`\n${error.stack}\n\`\`\``).catch(console.error);
  // Wait a moment for the message to send before exiting
  setTimeout(() => process.exit(1), 1000);
});

// PM2 specific restart events
if (process.env.PM2_HOME || process.env.PM2_JSON_PROCESSING || process.env.PM2_CLI) {
  // We're running under PM2
  console.log("📋 Running under PM2 process manager");

  // Send a startup notification for PM2 restarts
  // This runs on both initial startup and PM2 restarts
  sendServerMessage(`🔁 *Server Restarted via PM2*\nServer running at http://localhost:${port}`).catch((err) => console.error("Failed to send PM2 restart notification:", err));
}

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);

  // Only send the startup message if this is a fresh start (not PM2 managed)
  if (!process.env.PM2_HOME && !process.env.PM2_JSON_PROCESSING && !process.env.PM2_CLI) {
    sendServerMessage(`🟢 *Server Started*\nServer running at http://localhost:${port}`).catch((err) => console.error("Failed to send startup notification:", err));
  }

  // Schedule regular heartbeats
  setInterval(safeHeartbeat, HEARTBEAT_INTERVAL);
});
