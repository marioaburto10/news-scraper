// Headline model
// ==============

// Require mongoose
var mongoose = require("mongoose");

// Create a schema class using mongoose's schema method
var Schema = mongoose.Schema;

// Create the headlineSchema with our schema class
var headlineSchema = new Schema({
	// headline, a string, must be entered
	headline: {
		type: String,
		required: true,
		unique: true
	},
	// summary, a string, must be entered
	summary: {
		type: String,
		required: true
	},
	// link, a string, must be entered
	link: {
		type: String,
		required: true
	},
	// image, a string, must be entered
	image: {
		type: String,
		required: true
	},
	// Articles will not be marked saved when they are created.
	saved: {
		type: Boolean,
		default: false
	}
});

// Create the Headline model using the headlineSchema
var Headline = mongoose.model("Headline", headlineSchema);

// Export the Headline model
module.exports = Headline;