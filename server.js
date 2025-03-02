const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
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
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Basic routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "Maverick Contracting INC | Full-Service Exterior Remodeler in Minnesota",
    description:
      "Maverick Contracting provides professional roofing, siding, windows, and gutter services for residential and commercial properties in Minnesota. Serving Minneapolis, St. Paul, and surrounding areas.",
    active: "home",
  });
});

// Storm Damage Routes
app.get("/storm-damage/residential", (req, res) => {
  res.render("storm-damage/residential", {
    title: "Residential Storm Damage Services | Maverick Contracting",
    description:
      "Expert residential storm damage repair and restoration services in Minnesota. We help homeowners recover from hail, wind, and storm damage with quality repairs and insurance claim assistance.",
    active: "storm-damage-residential",
  });
});

app.get("/storm-damage/multi-family", (req, res) => {
  res.render("storm-damage/multi-family", {
    title: "Multi-Family Storm Damage Repair | Maverick Contracting",
    description: "Comprehensive storm damage repair services for multi-family properties in Minnesota. We handle everything from assessment to restoration for apartments, condos, and townhomes.",
    active: "storm-damage-multi-family",
  });
});

app.get("/storm-damage/emergency-services", (req, res) => {
  res.render("storm-damage/emergency-services", {
    title: "Emergency Storm Damage Services | Maverick Contracting",
    description: "24/7 emergency storm damage services in Minnesota. Fast response to protect your property from further damage after severe weather events.",
    active: "storm-damage-emergency-services",
  });
});

app.get("/storm-damage/insurance-claims", (req, res) => {
  res.render("storm-damage/insurance-claims", {
    title: "Storm Damage Insurance Claims Assistance | Maverick Contracting",
    description: "Expert guidance through the storm damage insurance claim process in Minnesota. We work with your insurance company to ensure you receive fair compensation for repairs.",
    active: "storm-damage-insurance-claims",
  });
});

app.get("/storm-damage/roof-tarping", (req, res) => {
  res.render("storm-damage/roof-tarping", {
    title: "Emergency Roof Tarping Services | Maverick Contracting",
    description: "Professional roof tarping services in Minnesota to prevent further damage after storms. Quick response to protect your home or business from water damage.",
    active: "storm-damage-roof-tarping",
  });
});

app.get("/services", (req, res) => {
  res.render("services", {
    title: "Our Services | Maverick Contracting INC - Minnesota",
    description:
      "Explore our comprehensive exterior remodeling services including roofing, siding, windows, and gutters in Minnesota. Quality workmanship guaranteed throughout Minneapolis, St. Paul, and surrounding communities.",
    active: "services",
  });
});

app.get("/roofing", (req, res) => {
  res.render("roofing", {
    title: "Expert Roofing Services in Minnesota | Maverick Contracting",
    description: "Professional roof installation, repair, and replacement services in Minneapolis, St. Paul, and surrounding Minnesota areas. Quality materials and expert craftsmanship guaranteed.",
    active: "roofing",
  });
});

app.get("/siding", (req, res) => {
  res.render("siding", {
    title: "Professional Siding Installation in Minnesota | Maverick Contracting",
    description:
      "Transform your Minnesota home with premium siding solutions from Maverick Contracting. Serving Minneapolis, St. Paul, and surrounding communities with quality siding installation and repair.",
    active: "siding",
  });
});

app.get("/windows", (req, res) => {
  res.render("windows", {
    title: "Energy-Efficient Window Installation in Minnesota | Maverick Contracting",
    description: "Upgrade to energy-efficient windows perfect for Minnesota's climate. Professional installation serving Minneapolis, St. Paul, and surrounding areas with quality window solutions.",
    active: "windows",
  });
});

app.get("/gutters", (req, res) => {
  res.render("gutters", {
    title: "Seamless Gutter Installation in Minnesota | Maverick Contracting",
    description: "Protect your Minnesota home from water damage with professional gutter solutions. Serving Minneapolis, St. Paul, and surrounding areas with seamless gutter installation and repair.",
    active: "gutters",
  });
});

app.get("/projects", (req, res) => {
  res.render("projects", {
    title: "Our Minnesota Projects | Maverick Contracting Portfolio",
    description:
      "View our portfolio of completed exterior remodeling projects throughout Minneapolis, St. Paul, and surrounding Minnesota communities. See the quality craftsmanship that Maverick Contracting delivers.",
    active: "projects",
  });
});

app.get("/testimonials", (req, res) => {
  res.render("testimonials", {
    title: "Minnesota Customer Testimonials | Maverick Contracting",
    description:
      "Read what our satisfied Minnesota customers in Minneapolis, St. Paul, and surrounding areas have to say about Maverick Contracting's exterior remodeling services and exceptional customer care.",
    active: "testimonials",
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact Maverick Contracting | Request a Free Estimate in Minnesota",
    description:
      "Contact Maverick Contracting for a free estimate on your exterior remodeling project. Serving Minneapolis, St. Paul, and all surrounding Minnesota communities with quality exterior solutions.",
    active: "contact",
  });
});

// Contact form submission route
app.post("/submit-contact", async (req, res) => {
  try {
    const { name, email, phone, message, service } = req.body;

    // Log the form submission (instead of sending to Telegram)
    console.log("Form submission received:", { name, email, phone, message, service });

    // Render thank you page
    res.render("thank-you", {
      title: "Thank You | Maverick Contracting INC - Minnesota",
      description:
        "Thank you for contacting Maverick Contracting. We appreciate your interest and will get back to you shortly. Proudly serving Minnesota homeowners with quality exterior remodeling services.",
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
});
