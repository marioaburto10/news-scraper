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

  // This route renders the saved handledbars page
  router.get("/saved", function(req, res) {
    res.render("saved");
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

  // This route handles getting all headlines from the database
  router.get("/api/headlines", function(req, res) {
  	// If the client specifies a saved query parameter, ie "/api/headlines/?saved=true"
    // which is translated to just { saved: true } on req.query,
    // then set the query object equal to this
	var query = {};
    if (req.query.saved) {
      query = req.query;
    }

    // Run the headlinesController get method and pass in whether we want saved, unsaved,
    // (or all headlines by default)
    headlinesController.get(query, function(data) {
      // Send the article data back as JSON
      res.json(data);
    });

  });


};