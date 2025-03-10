const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
const { sendContactFormMessage, sendServerMessage, sendCareerApplicationMessage } = require("./lib/telegram");
require("dotenv").config();
const schedule = require("node-schedule");

// Base URL for canonical links
const baseUrl = "https://www.hiremaverick.com";

// Monitoring constants - simplified
const SLOW_REQUEST_THRESHOLD = 1000; // 1 second (in milliseconds)
const PERFORMANCE_ALERT_COOLDOWN = 30 * 60 * 1000; // 30 minutes in milliseconds

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Trust Cloudflare/NGINX proxy
app.set("trust proxy", 1); // Trust the first proxy in the chain

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

// Monitoring stats - simplified
let lastPerformanceAlert = 0;
let requestStats = {
  totalRequests: 0,
  slowRequests: 0,
  errors: 0,
  startTime: Date.now(),
};

// Performance monitoring middleware - clean and minimal
app.use((req, res, next) => {
  const start = Date.now();
  requestStats.totalRequests++;

  // Once the response is finished
  res.on("finish", () => {
    const duration = Date.now() - start;

    // Only track slow requests
    if (duration > SLOW_REQUEST_THRESHOLD) {
      requestStats.slowRequests++;
      console.log(`⚠️ Slow request: ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);

      // Alert on slow requests, with cooldown
      const now = Date.now();
      if (now - lastPerformanceAlert > PERFORMANCE_ALERT_COOLDOWN) {
        lastPerformanceAlert = now;
        sendServerMessage(`⚠️ *Slow Page Load Detected*\nPage: \`${req.originalUrl}\`\nTime: ${duration}ms`).catch((err) => console.error("Failed to send alert:", err));
      }
    }

    // Track server errors
    if (res.statusCode >= 500) {
      requestStats.errors++;
      console.log(`🔴 Server error: ${req.method} ${req.originalUrl} ${res.statusCode}`);

      // Always alert on server errors
      sendServerMessage(`🔴 *Server Error*\nPage: \`${req.originalUrl}\`\nStatus: ${res.statusCode}`).catch((err) => console.error("Failed to send alert:", err));
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

// Careers page route
app.get("/careers", (req, res) => {
  res.render("careers", {
    title: "Career Opportunities | Maverick Contracting",
    description: "Join the Maverick Contracting team. Explore career opportunities in roofing, siding, and exterior remodeling with one of Minnesota's premier contracting companies.",
    active: "careers",
    canonical: `${baseUrl}/careers`,
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
    title: "Privacy Policy | Maverick Contracting",
    description: "Our commitment to protecting your privacy and personal information at Maverick Contracting Inc.",
    active: "privacy",
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

// Career application form submission route
app.post("/submit-application", async (req, res) => {
  try {
    // Make sure field names match what's in the HTML form
    const { fullname, email, phone, position, experience, message } = req.body;

    // Log the application submission
    console.log(`📝 Career application received from ${fullname} (${email}) - Position: ${position}`);

    // Send to Telegram
    await sendCareerApplicationMessage({ fullname, email, phone, position, experience, message });

    // Render the dedicated thank-you page for job applications
    res.render("thank-you-application", {
      title: "Application Received | Maverick Contracting INC - Minnesota",
      description: "Thank you for applying to Maverick Contracting. We've received your application and our team will review it shortly.",
      active: "careers",
      canonical: `${baseUrl}/thank-you-application`,
    });
  } catch (error) {
    console.error("❌ Error processing career application:", error);
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

// 404 handler - must be the last route
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found | Maverick Contracting INC - Minnesota",
    description: "The page you're looking for could not be found. Maverick Contracting provides professional exterior remodeling services in Minnesota.",
    active: "none",
  });
});

// Helper function to format uptime - simplified
function formatUptime(milliseconds) {
  const seconds = milliseconds / 1000;
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${days}d ${hours}h ${minutes}m`;
}

// Function to send heartbeat with stats - simplified
async function sendHeartbeatMessage() {
  try {
    const now = Date.now();
    const uptime = now - requestStats.startTime;
    const memoryUsage = process.memoryUsage();

    // Calculate request stats
    const uptimeHours = uptime / 3600000;
    const requestsPerHour = uptimeHours > 0 ? (requestStats.totalRequests / uptimeHours).toFixed(1) : "0.0";

    const message =
      `📊 *Website Statistics*\n` +
      `⏱️ Uptime: ${formatUptime(uptime)}\n` +
      `📈 Requests: ${requestStats.totalRequests} (${requestsPerHour}/hr)\n` +
      `⚠️ Slow Loads: ${requestStats.slowRequests}\n` +
      `🔴 Errors: ${requestStats.errors}\n` +
      `🧠 Memory: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB\n` +
      `📊 [View Analytics Dashboard](https://dashboard.simpleanalytics.com/hiremaverick.com)`;

    await sendServerMessage(message);
    console.log("📊 Statistics report sent to Telegram");
  } catch (error) {
    console.error("❌ Failed to send statistics:", error);
  }
}

// Handle uncaught exceptions - keep this for critical errors
process.on("uncaughtException", async (error) => {
  console.error("🔥 Uncaught Exception:", error);
  await sendServerMessage(`🔥 *CRITICAL ERROR*\n${error.message}`).catch(console.error);
  // Wait a moment for the message to send before exiting
  setTimeout(() => process.exit(1), 1000);
});

// Start the server - simplified
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);

  // Replace the setInterval with scheduled jobs at fixed times
  // Schedule daily 8am Minnesota time heartbeat
  schedule.scheduleJob("0 8 * * *", { timezone: "America/Chicago" }, () => {
    console.log("📊 Sending 8am scheduled heartbeat");
    sendHeartbeatMessage();
  });

  // Schedule daily 8pm Minnesota time heartbeat
  schedule.scheduleJob("0 20 * * *", { timezone: "America/Chicago" }, () => {
    console.log("📊 Sending 8pm scheduled heartbeat");
    sendHeartbeatMessage();
  });
});
