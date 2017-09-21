// Server routes

// Bring in the Scrape function from scripts directory
var scrape = require("../scripts/scrape");

// Bring in headlines controller
var headlinesController = require("../controllers/headlines");

module.exports = function(router) {
  // This route renders the homepage
  router.get("/", function(req, res) {
    res.render("home");
  });

  // This route handles scraping articles to add to the db
  router.get("/api/fetch", function(req, res) {
  	// This method inside the headlinesController will try and scrap new articles
    // and save unique ones to the database
    headlinesController.fetch(function(err, docs) {
		// If we don't get any articles back, likely because there are no new
		// unique articles, send this message back to the user
		if (!docs || docs.insertedCount === 0) {
			res.json({
			  message: "No new articles today. Check back tomorrow!"
			});
		}
		// Otherwise send back a count of how many new articles there are
		else {
			res.json({
			  message: "Added " + docs.insertedCount + " new articles!"
			});
		}
    });
  });


};