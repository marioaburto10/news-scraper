// script to scrape articles
// =============

// Require request and cheerio, to make scrapes possible
var request = require("request");
var cheerio = require("cheerio");

// This function will scrape https://www.developer-tech.com/ (cb is the callback)
var scrape = function(cb) {
	// Use the request package to take in the body of the page's html
	request("https://www.developer-tech.com/", function(err, res, body) {
		// body is the actual HTML on the page. Load this into cheerio

	    // Saving this to $ creates a virtual HTML page we can minipulate and
	    // traverse with the same methods as jQuery
	    var $ = cheerio.load(body);

	    // An empty array to save article info
	    var articles = [];

	    // Find and loop through each article element that has the "latest-container" id
	    $("#latest-container article").each(function(i, element) {
	    	// grab the heading text of each article
	    	var head = $(this).children("h3").text().trim();
	    	// grab the summary of each article
	    	var sum = $(this).children(".summary").text().trim();
	    	// grab the link of each article
	    	var lnk = $(this).children("h3").attr("href");
		    // grab the image link of each article
	    	var img = $(this).children(".thumb").attr("src");

			// So long as headline and sum aren't empty or undefined, do the following
			if (head && sum && lnk && img) {

				// Initialize an object we will push to the articles array
				var dataToAdd = {
				  headline: headNeat,
				  summary: sumNeat,
				  link: lnk,
				  image: img
				};

				articles.push(dataToAdd);
			}
		});
	    // After loop is complete, send back the array of articles to the callback function
    	cb(articles);
	});

};


// Export the function, so other files in the backend can use it
module.exports = scrape;