const express = require("express");
const router = express.Router();

// Inline service area data
const serviceAreas = [
  { name: "Minneapolis", slug: "minneapolis", population: 425115, median_home_value: 325000, median_home_age: 57 },
  { name: "St. Paul", slug: "st-paul", population: 303820, median_home_value: 280000, median_home_age: 59 },
  { name: "Bloomington", slug: "bloomington", population: 87398, median_home_value: 320000, median_home_age: 50 },
  { name: "Eden Prairie", slug: "eden-prairie", population: 64870, median_home_value: 435000, median_home_age: 45 },
  { name: "Plymouth", slug: "plymouth", population: 80666, median_home_value: 375000, median_home_age: 48 },
  { name: "Maple Grove", slug: "maple-grove", population: 68228, median_home_value: 375000, median_home_age: 46 },
  { name: "Coon Rapids", slug: "coon-rapids", population: 34456, median_home_value: 275000, median_home_age: 53 },
  { name: "Blaine", slug: "blaine", population: 78268, median_home_value: 325000, median_home_age: 49 },
  { name: "Anoka", slug: "anoka", population: 18336, median_home_value: 275000, median_home_age: 59 },
  { name: "Andover", slug: "andover", population: 34256, median_home_value: 375000, median_home_age: 47 },
  { name: "Brooklyn Park", slug: "brooklyn-park", population: 83346, median_home_value: 275000, median_home_age: 52 },
  { name: "Fridley", slug: "fridley", population: 28888, median_home_value: 250000, median_home_age: 53 },
  { name: "Champlin", slug: "champlin", population: 25442, median_home_value: 325000, median_home_age: 50 },
  { name: "Ramsey", slug: "ramsey", population: 23685, median_home_value: 300000, median_home_age: 50 },
  { name: "Shoreview", slug: "shoreview", population: 28734, median_home_value: 400000, median_home_age: 47 },
  { name: "Roseville", slug: "roseville", population: 35836, median_home_value: 300000, median_home_age: 57 },
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
