$(document).ready(function() {
	// Setting a reference to the article-container div where all the dynamic content will go
	var articleContainer = $(".article-container");
  	// Event listener for dynamically created buttons
  	$(document).on("click", ".btn.delete", handleArticleDelete);
  	$(document).on("click", ".btn.notes", handleArticleNotes);
  	$(document).on("click", ".btn.save", handleNoteSave);
	$(document).on("click", ".btn.note-delete", handleNoteDelete);


	// initPage kicks everything off when the page is loaded
	initPage();

	function initPage() {
		// Empty the article container, run an AJAX request for any saved headlines
		articleContainer.empty();
		$.get("/api/headlines?saved=true").then(function(data) {
		  // If there are headlines, render them to the page
		  if (data && data.length) {
		    renderArticles(data);
		  } else {
		    // Otherwise render a message explaing there are no articles
		    renderEmpty();
		  }
		});
	}

	function renderArticles(articles) {
		// This function handles appending HTML containing article data to the page
		// Passing in array of JSON containing all available articles in the database
		var articlePanels = [];
		// Pass each article JSON object to the createPanel function which returns a bootstrap
		// panel with article data inside
		for (var i = 0; i < articles.length; i++) {
		  articlePanels.push(createPanel(articles[i]));
		}
		// Once all of the HTML for the articles is stored in the articlePanels array,
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
	    // Return the constructed panel jQuery element
	    return panel;
	}

	function renderEmpty() {
	    // This function renders some HTML to the page explaining there are no articles to view
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

	function renderNotesList(data) {
	    // This function handles rendering note list items to notes modal
	    // Setting up an array of notes to render after finished
	    // Also setting up a currentNote variable to temporarily store each note
	    var notesToRender = [];
	    var currentNote;
	    if (!data.notes.length) {
	      // If there are no notes, just display a message explaing this
	      currentNote = [
	        "<li class='list-group-item'>",
	        "No notes for this article yet.",
	        "</li>"
	      ].join("");
	      notesToRender.push(currentNote);
	    }
	    else {
	      // If there are notes, go through each one
	      for (var i = 0; i < data.notes.length; i++) {
	        // Constructs an li element to contain noteText and a delete button
	        currentNote = $([
	          "<li class='list-group-item note'>",
	          data.notes[i].noteText,
	          "<button class='btn btn-danger note-delete'>x</button>",
	          "</li>"
	        ].join(""));
	        // Store the note id on the delete button for easy access when trying to delete
	        currentNote.children("button").data("_id", data.notes[i]._id);
	        // Adding currentNote to the notesToRender array
	        notesToRender.push(currentNote);
	      }
	    }
	    // Now append the notesToRender to the note-container inside the note modal
	    $(".note-container").append(notesToRender);
	}


	function handleArticleDelete() {
		// This function handles deleting articles/headlines
		// Grab the id of the article to delete from the panel element the delete button sits inside
		var articleToDelete = $(this).parents(".panel").data();
		// Using a delete method here just to be semantic since an article/headline is being deleted
		console.log(articleToDelete);
		$.ajax({
		  method: "DELETE",
		  url: "/api/headlines/" + articleToDelete._id
		}).then(function(data) {
		  // If this works out, run initPage again which will rerender the list of saved articles
		  if (data.ok) {
		    initPage();
		  }
		});
	}

	function handleArticleNotes() {
	    // This function handles opending the notes modal and displaying notes
	    // Grab the id of the article to get notes for from the panel element the notes button sits inside
	    var currentArticle = $(this).parents(".panel").data();
	    console.log(currentArticle._id);
	    // Grab any notes with this headline/article id
	    $.get("/api/notes/" + currentArticle._id).then(function(data) {
	      // Constructing  initial HTML to add to the notes modal
	      var modalText = [
	        "<div class='container-fluid text-center'>",
	        "<h4>Notes For Article with ID: ",
	        currentArticle._id,
	        "</h4>",
	        "<hr />",
	        "<ul class='list-group note-container'>",
	        "</ul>",
	        "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
	        "<button class='btn btn-success save'>Save Note</button>",
	        "</div>"
	      ].join("");
	      // Adding the formatted HTML to the note modal
	      bootbox.dialog({
	        message: modalText,
	        closeButton: true
	      });
	      var noteData = {
	        _id: currentArticle._id,
	        notes: data || []
	      };
	      // Adding some information about the article and article notes to the save button for easy access
	      // When trying to add a new note
	      $(".btn.save").data("article", noteData);
	      // renderNotesList will populate the actual note HTML inside of the modal just created/opened
	      renderNotesList(noteData);
	      console.log(noteData)
	    });
  	}

	function handleNoteSave() {
		// This function handles what happens when a user tries to save a new note for an article
		// Setting a variable to hold some formatted data about our note,
		// grabbing the note typed into the input box
		var noteData;
		var newNote = $(".bootbox-body textarea").val().trim();
		// If we actually have data typed into the note input field, format it
		// and post it to the "/api/notes" route and send the formatted noteData as well
		console.log(newNote);
		if (newNote) {
		  noteData = {
		    _id: $(this).data("article")._id,
		    noteText: newNote
		  };
		  $.post("/api/notes", noteData).then(function() {
		    // When complete, close the modal
		    bootbox.hideAll();
		  });
		}
	}


	function handleNoteDelete() {
	    // This function handles the deletion of notes
	    // First grab the id of the note to be deleted
	    // This data was stored on the delete button when it was created
	    var noteToDelete = $(this).data("_id");
	    // Perform a DELETE request to "/api/notes/" with the id of the note being deleted as a parameter
	    
	    $.ajax({
	      url: "/api/notes/" + noteToDelete,
	      method: "DELETE"
	    }).then(function() {
	      // When done, hide the modal
	      bootbox.hideAll();
	    });
	}

});