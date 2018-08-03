// script to scrape articles
// =============

// Require request and cheerio, to make scrapes possible
var request = require("request");
var cheerio = require("cheerio");

// This function will scrape https://www.developer-tech.com/ (cb is the callback)
var scrape = function(cb) {
	 // Use the request package to take in the body of the page's html
	request("https://www.coindesk.com/", function(err, res, body) {
		// body is the actual HTML on the page. Load this into cheerio
		console.log("scraping");
		  // Saving this to $ creates a virtual HTML page we can minipulate and
		  // traverse with the same methods as jQuery
		  var $ = cheerio.load(body);

		  // An empty array to save article info
		  var articles = [];

		  // Find and loop through each article element that has the "latest-container" id
		  $(".article").each(function(i, element) {
		    // grab the heading text of each article
		    var head = $(this).children(".post-info").children("h3").text();
		    // grab the summary of each article
		    var sum = $(this).children(".post-info").children("p").text();
		    // grab the link of each article
		    var lnk = $(this).children(".post-info").children("h3").children("a").attr("href");
		    // grab the image link of each article
		    var img = $(this).children(".picture").children("a").children("img").attr("data-cfsrc");
		    // console.log(img);
			  // So long as headline and sum aren't empty or undefined, do the following
			  if (head && sum && lnk && img) {

			    // This section uses regular expressions and the trim function to tidy the headlines and summaries
			    // Removing extra lines, extra spacing, extra tabs, etc.. to increase to typographical cleanliness.
			    var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
			    var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

			    // Initialize an object we will push to the articles array
			    var dataToAdd = {
			      headline: headNeat,
			      summary: sumNeat,
			      link: lnk,
			      image: img
			    };

			    // console.log(dataToAdd);

			    articles.push(dataToAdd);
			  }
		});
		// After loop is complete, send back the array of articles to the callback function
    	cb(articles);
	});
};


// Export the function, so other files in the backend can use it
module.exports = scrape;

