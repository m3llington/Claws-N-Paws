// Get references to page elements
var $petType = $("#petType");
var $zip = $("#zip");
var $zipEntered = $("#zips");
var $phone = $("#phone");
var $name = $("#name");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");
var $zipButton = $("#zipSubmit");

// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function(example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/examples",
      data: JSON.stringify(example)
    });
  },
  getExamples: function() {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  getSitters: function() {
    return $.ajax({
      url: "api/profiles",
      type: "GET"
    });
  },
  getZip: function(zips) {
    return $.ajax({
      url: "api/profiles/" + zips,
      type: "POST",
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getExamples().then(function(data) {
    location = "/customer";
    var $examples = data.map(function(example) {
      var $a = $("<a>")
        .text(example.petType)
        .attr("href", "profiles");

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
 
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var example = {
    petType: $petType.val().trim(),
    zip: $zip.val().trim(),
    phone: $phone.val().trim(),
    name: $name.val().trim()
  };

  if (!(example.petType && example.zip && example.phone && example.name)) {
    alert("You must enter a pet type, zip code, phone number and Name");
    return;
  }

  API.saveExample(example).then(function() {
    refreshExamples();
  });
  
 
  $petType.val("");
  $zip.val("");
  $phone.val("");
  $name.val("");
};


var handleZipSubmit = function(event) {
  event.preventDefault();

  var zips = $zipEntered.val();

  API.getZip(zips);

  $zipEntered.val("");
  location = "/profiles/" + zips;
};


// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons

$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);
$zipButton.on("click", handleZipSubmit);
