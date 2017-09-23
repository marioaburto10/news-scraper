/* gloabl bootbox */
$(document).ready(function() {
	// Setting a reference to the article-container div where all the dynamic content will go
	var articleContainer = $(".article-container");

	// Adding event listeners to any dynamically generated "save article" and
	//"scrape new article" button
	$(document).on("click", ".btn.save", handleArticleSave);
	$(document).on("click", ".scrape-new", handleArticleScrape);

	// Once the page is ready, run the initPage function to kick things off
	initPage();

	function initPage() {
		// Empty the article container, run an AJAX request for any saved = false headlines
    	articleContainer.empty();
    	$.get("/api/headlines?saved=false")
	      .then(function(data) {
	        // If there are headlines coming back, render them to the page
	        if (data && data.length) {
	          renderArticles(data);
	        }
	        else {
	          // Otherwise render a message explaing there are no new articles
	          renderEmpty();
	        }
	      });
	}

	function renderArticles(articles) {
	    // This function handles appending HTML containing article data to the page
	    // An array of JSON containing all available articles in the database is being passed as articles
	    var articlePanels = [];
	    // Pass each article JSON object to the createPanel function which returns a bootstrap
	    // panel with article data inside
	    for (var i = 0; i < articles.length; i++) {
	      articlePanels.push(createPanel(articles[i]));
	    }
	    // Once all of the HTML is available for the articles stored in our articlePanels array,
	    // append them to the article container
	    articleContainer.append(articlePanels);
	}

	function createPanel(article) {
	    // This functiont takes in a single JSON object for an article/headline
	    // It constructs a jQuery element containing all of the formatted HTML for the
	    // article panel
	    var panel =
	      $(["<div class='panel panel-default'>",
	        "<div class='panel-heading'>",
	        "<h3 class='text-center'>",
	        "<a href='",
	        article.link,
	        "' >",
	        article.headline,
	        "</a>",
	        "<a class='btn btn-success save'>",
	        "Save Article",
	        "</a>",
	        "</h3>",
	        "</div>",
	        "<div class='panel-body text-center'>",
	        "<img class='center-block' src=",
	        article.image,
	        ">",
	        "<h4 class='article-summary'>",
	        article.summary,
	        "</h4>",
	        "</div>",
	        "</div>"
	      ].join(""));
	      // Attach the article's id to the jQuery element
	      // Will be used when trying to figure out which article the user wants to save
	    panel.data("_id", article._id);
	    // We return the constructed panel jQuery element
	    return panel;
	}

	function renderEmpty() {
	    // This function renders some HTML to the page explaining that there are no articles to view
	    // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
	    var emptyAlert =
	      $(["<div class='alert alert-warning text-center'>",
	        "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
	        "</div>",
	        "<div class='panel panel-default'>",
	        "<div class='panel-heading text-center'>",
	        "<h3>What Would You Like To Do?</h3>",
	        "</div>",
	        "<div class='panel-body text-center'>",
	        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
	        "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
	        "</div>",
	        "</div>"
	      ].join(""));
	    // Appending this data to the page
	    articleContainer.append(emptyAlert);
	}

	function handleArticleSave() {
    // This function is triggered when the user wants to save an article
    // When the article was rendered initially, a javascript object containing the headline id was attached
    // to the element using the .data method. Here it is retrieved.
	var articleToSave = $(this).parents(".panel").data();
    articleToSave.saved = true;
    // Using a patch method to be semantic since this is an update to an existing record in the collection
    $.ajax({
      method: "PATCH",
      url: "/api/headlines",
      data: articleToSave
    })
    .then(function(data) {
      // If successful, mongoose will send back an object containing a key of "ok" with the value of 1
      // (which casts to 'true')
      if (data.ok) {
        // Run the initPage function again. This will reload the entire list of articles
        initPage();
      }
    });
	}


	function handleArticleScrape() {
	    // This function handles the user clicking any "scrape new article" buttons
	    $.get("/api/fetch")
	      .then(function(data) {
	        // If scrape works and can compare scarped articles to those
	        // already in the collection, re render the articles on the page
	        // and let the user know how many unique articles we were able to save
	        initPage();
	        bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
	      });
	 }


});