$(document).ready(function() {
	// Setting a reference to the article-container div where all the dynamic content will go
	var articleContainer = $(".article-container");
  	// Event listener for dynamically created article delete buttons
  	$(document).on("click", ".btn.delete", handleArticleDelete);

	// initPage kicks everything off when the page is loaded
	initPage();

	function initPage() {
		// Empty the article container, run an AJAX request for any saved headlines
		articleContainer.empty();
		$.get("/api/headlines?saved=true").then(function(data) {
		  // If we have headlines, render them to the page
		  if (data && data.length) {
		    renderArticles(data);
		  } else {
		    // Otherwise render a message explaing we have no articles
		    renderEmpty();
		  }
		});
	}

	function renderArticles(articles) {
		// This function handles appending HTML containing our article data to the page
		// We are passed an array of JSON containing all available articles in our database
		var articlePanels = [];
		// We pass each article JSON object to the createPanel function which returns a bootstrap
		// panel with our article data inside
		for (var i = 0; i < articles.length; i++) {
		  articlePanels.push(createPanel(articles[i]));
		}
		// Once we have all of the HTML for the articles stored in our articlePanels array,
		// append them to the articlePanels container
		articleContainer.append(articlePanels);
	}	

	function createPanel(article) {
	    // This functiont takes in a single JSON object for an article/headline
	    // It constructs a jQuery element containing all of the formatted HTML for the
	    // article panel
	    var panel =
	      $(["<div class='panel panel-default'>",
	        "<div class='panel-heading'>",
	        "<h3>",
	        "<a href='",
	        article.link,
	        "' >",
	        article.headline,
	        "<a class='btn btn-danger delete'>",
			"Delete From Saved",
			"</a>",
			"<a class='btn btn-info notes'>Article Notes</a>",
	        "</h3>",
	        "</div>",
	        "<div class='panel-body'>",
	        "<img src=",
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
	    // This function renders some HTML to the page explaining we don't have any articles to view
	    // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
	    var emptyAlert =
	      $(["<div class='alert alert-warning text-center'>",
	        "<h4>Uh Oh. Looks like we don't have any saved articles.</h4>",
	        "</div>",
	        "<div class='panel panel-default'>",
	        "<div class='panel-heading text-center'>",
	        "<h3>Would You Like to Browse Available Articles?</h3>",
	        "</div>",
	        "<div class='panel-body text-center'>",
	        "<h4><a href='/'>Browse Articles</a></h4>",
	        "</div>",
	        "</div>"
	      ].join(""));
	    // Appending this data to the page
	    articleContainer.append(emptyAlert);
	}


	function handleArticleDelete() {
		// This function handles deleting articles/headlines
		// We grab the id of the article to delete from the panel element the delete button sits inside
		var articleToDelete = $(this).parents(".panel").data();
		// Using a delete method here just to be semantic since we are deleting an article/headline
		console.log(articleToDelete);
		$.ajax({
		  method: "DELETE",
		  url: "/api/headlines/" + articleToDelete._id
		}).then(function(data) {
		  // If this works out, run initPage again which will rerender our list of saved articles
		  if (data.ok) {
		    initPage();
		  }
		});
	}

});