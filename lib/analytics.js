/**
 * Simple in-memory analytics for the roofing website
 * This is a basic implementation and will reset when the server restarts
 * For production, consider using a database to persist this data
 */

// Track page views
const pageViews = {
  total: 0,
  byPage: {},
  byDate: {},
};

// Track when the server started for uptime calculation
const startTime = Date.now();

/**
 * Track a page view
 * @param {string} page - The page path that was viewed
 */
const trackPageView = (page) => {
  // Increment total views
  pageViews.total++;

  // Track by page
  if (!pageViews.byPage[page]) {
    pageViews.byPage[page] = 0;
  }
  pageViews.byPage[page]++;

  // Track by date
  const today = new Date().toISOString().split("T")[0];
  if (!pageViews.byDate[today]) {
    pageViews.byDate[today] = 0;
  }
  pageViews.byDate[today]++;
};

/**
 * Get current website statistics
 * @returns {Object} - The website statistics
 */
const getStats = () => {
  const today = new Date().toISOString().split("T")[0];

  // Find most popular page
  let popularPage = "";
  let maxViews = 0;

  Object.entries(pageViews.byPage).forEach(([page, views]) => {
    if (views > maxViews) {
      maxViews = views;
      popularPage = page;
    }
  });

  // Calculate uptime in days
  const uptimeDays = (Date.now() - startTime) / (24 * 60 * 60 * 1000);
  // Convert to percentage (capped at 100%)
  const uptimePercentage = Math.min(100, uptimeDays * 100).toFixed(2);

  return {
    visitorsToday: pageViews.byDate[today] || 0,
    pageViews: pageViews.total,
    popularPage: popularPage || "None",
    uptime: uptimePercentage,
  };
};

module.exports = {
  trackPageView,
  getStats,
};
