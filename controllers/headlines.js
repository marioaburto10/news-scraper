// Controller for headlines
// ============================

// Bring in scrape script 
var scrape = require("../scripts/scrape");

// Bring in the Headline mongoose model
var Headline = require("../models/Headline");

module.exports = {
	fetch: function(cb) {

		// Run scrape function
		scrape(function(data) {
			// Here data is an array of article objects with headlines and summaries
      		// Setting this to articles for clarity
			var articles = data;

			// Make sure each article object is not saved by default
			for (var i = 0; i < articles.length; i++) {
				articles[i].saved = false;
			}

			// Headline.collection gives access to the native Mongo insertMany method.
			// Using this instead of the mongoose create method because here it can be
			// specified whether this is an ordered or unordered insert
			// https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/
			// unordered inserts have the benefit of being faster, and errors are logged instead
			// of thrown. This means that even if some of the inserts fail, the rest will continue
			// An insert is expected to fail whenever there is a duplicate headline since that property
			// is marked unique on the mongoose model
			Headline.collection.insertMany(articles, { ordered: false }, function(err, docs) {
				cb(err, docs);
			});
		});
	},

	get: function(query, cb) {
	    // Prepare a query to get the data that was scraped,
	    // and sort starting from most recent (sorted by id num)
	    Headline.find(query)
			.sort({
				_id: 1
			})
			// Execute this query
			.exec(function(err, doc) {
				// Once finished, pass the list into the callback function
				cb(doc);
			});
  	},

	update: function(query, cb) {
		// Update the headline with the id supplied
		// set it to be equal to any new values we pass in on query
		Headline.update({ _id: query._id }, {
		  $set: query
		}, {}, cb);
	}

};
