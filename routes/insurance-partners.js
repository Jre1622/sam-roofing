const express = require("express");
const router = express.Router();

const baseUrl = "https://www.hiremaverick.com";

const insuranceCompanies = [
  {
    name: "AAA",
    image: "aaa.png",
  },
  {
    name: "ASI",
    image: "asi.png",
  },
  {
    name: "Acuity",
    image: "acuity.png",
  },
  {
    name: "Allstate",
    image: "allstate.png",
  },
  {
    name: "American Family",
    image: "american-family.png",
  },
  {
    name: "Auto-Owners",
    image: "auto-owners.jpg",
  },
  {
    name: "Badger Mutual",
    image: "badger-mutual.png",
  },
  {
    name: "Chubb",
    image: "chubb.png",
  },
  {
    name: "Cincinnati",
    image: "cincinnati.png",
  },
  {
    name: "Country Financial",
    image: "country-financial.png",
  },
  {
    name: "Encompass",
    image: "encompass.png",
  },
  {
    name: "Farmers",
    image: "farmers.png",
  },
  {
    name: "Geico",
    image: "geico.png",
  },
  {
    name: "Hartford",
    image: "hartford.png",
  },
  {
    name: "Homesite",
    image: "homesite.png",
  },
  {
    name: "Integrity",
    image: "integrity.png",
  },
  {
    name: "Liberty Mutual / SafeCo",
    image: "liberty-mutual.png",
  },
  {
    name: "Nationwide",
    image: "nationwide.png",
  },
  {
    name: "Progressive",
    image: "progressive.png",
  },
  {
    name: "Secura",
    image: "secura.svg",
  },
  {
    name: "Selective",
    image: "selective.png",
  },
  {
    name: "State Auto",
    image: "state-auto.png",
  },
  {
    name: "State Farm",
    image: "state-farm.png",
  },
  {
    name: "Travelers",
    image: "travelers.png",
  },
  {
    name: "USAA",
    image: "usaa.png",
  },
  {
    name: "Universal Property",
    image: "universal-property.jpg",
  },
  {
    name: "West Bend",
    image: "west-bend.png",
  },
  {
    name: "Western National",
    image: "western-national.png",
  },
  {
    name: "Westfield",
    image: "westfield.png",
  },
];

router.get("/", (req, res) => {
  res.render("insurance-partners", {
    title: "Insurance Partners | Maverick Contracting",
    description: "View the insurance companies we work with for storm damage repairs and restoration services in Minnesota.",
    active: "insurance-partners",
    canonical: `${baseUrl}/insurance-partners`,
    insuranceCompanies: insuranceCompanies,
  });
});

module.exports = router;
