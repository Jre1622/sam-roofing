const express = require("express");
const router = express.Router();

// Inline service area data
const serviceAreas = [
  { name: "Minneapolis", slug: "minneapolis" },
  { name: "St. Paul", slug: "st-paul" },
  { name: "Bloomington", slug: "bloomington" },
  { name: "Eden Prairie", slug: "eden-prairie" },
  { name: "Plymouth", slug: "plymouth" },
  { name: "Maple Grove", slug: "maple-grove" },
  { name: "Coon Rapids", slug: "coon-rapids" },
  { name: "Blaine", slug: "blaine" },
  { name: "Anoka", slug: "anoka" },
  { name: "Andover", slug: "andover" },
  { name: "Brooklyn Park", slug: "brooklyn-park" },
  { name: "Fridley", slug: "fridley" },
  { name: "Champlin", slug: "champlin" },
  { name: "Ramsey", slug: "ramsey" },
  { name: "Shoreview", slug: "shoreview" },
  { name: "Roseville", slug: "roseville" },
];

// Base URL for canonical links (import from environment or config)
const baseUrl = "https://www.hiremaverick.com";

// Main service areas page
router.get("/", (req, res) => {
  res.render("service-areas", {
    title: "Areas We Serve | Maverick Contracting",
    description: "Maverick Contracting provides professional exterior remodeling services throughout the Twin Cities metro area including Minneapolis, St. Paul, and surrounding suburbs.",
    active: "service-areas",
    canonical: `${baseUrl}/service-areas`,
    serviceAreas: serviceAreas,
  });
});

// City-specific service area pages
router.get("/:city", (req, res) => {
  const citySlug = req.params.city;
  const cityData = serviceAreas.find((city) => city.slug === citySlug);

  if (!cityData) {
    return res.status(404).render("404", {
      title: "Page Not Found | Maverick Contracting",
      description: "The page you're looking for could not be found. Maverick Contracting provides professional exterior remodeling services in Minnesota.",
      active: "none",
    });
  }

  res.render("service-areas/city", {
    title: `Exterior Remodeling in ${cityData.name}, MN | Maverick Contracting`,
    description: `Professional roofing, siding, window, and gutter services in ${cityData.name}, Minnesota. Quality materials and expert installation for ${cityData.name} homes.`,
    active: "service-areas",
    canonical: `${baseUrl}/service-areas/${citySlug}`,
    city: cityData,
  });
});

module.exports = router;
