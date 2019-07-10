//variable for base64 images
var baseCode;

//incrementation variable
var n = 0;

//arr of requests
var requestArr = [];

//hash array
var hashArr = [];

//seo array
var seoArr = [];

//constructor for new request object to be passed into google vision
function addRequests(picData) {
  this.request = {};
  this.request.requests = [{}];
  this.request.requests[0].image = { content: picData };
  this.request.requests[0].features = [
    {
      type: "LABEL_DETECTION",
      maxResults: 1
    },
    {
      type: "FACE_DETECTION",
      maxResults: 10
    },
    {
      type: "OBJECT_LOCALIZATION",
      maxResults: 10
    },
    {
      type: "DOCUMENT_TEXT_DETECTION",
      maxResults: 10
    },
    {
      type: "LANDMARK_DETECTION",
      maxResults: 10
    },
    {
      type: "WEB_DETECTION",
      maxResults: 10
    },
    {
      type: "SAFE_SEARCH_DETECTION",
      maxResults: 10
    },
    {
      type: "IMAGE_PROPERTIES",
      maxResults: 10
    }
  ];
}

//pushes new requests to arr/ creates new request objs
function newRequest(img) {
  var addedRequest = new addRequests(img);
  requestArr.push(addedRequest);
}

//gets input file and converts to base64
function encodeImageFileAsURL(element) {
  var file = element.files[0];
  var reader = new FileReader();
  console.log(reader.result);
  reader.onloadend = function() {
    $("#picDiv").empty();
    baseCode = reader.result.replace(/^data:image\/[a-z]+;base64,/, "");
    newRequest(baseCode);
    $("#picDiv").append(
      `<img class="img-thumbnail img-responsive" src="${reader.result}">`
    );

    // empty buttoms and let user know that vision is searching for results
    $(".buttons").empty();
    $(".buttons").text("Searching for results");
    var file = $("#file-upload").val();
    console.log(file.substr(12));
    console.log(requestArr[n].request);

    // axios post method to vision api; pass in the constructed object for post request
    axios
      .post(
        "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBk4y2OKobnIOgdt4ggGlK8pbjHry4UpPI",
        requestArr[n].request
      )
      .then(function(response) {
        $(".buttons").empty();

        // get web entities and create new buttons for each web entity
        let webArray = response.data.responses[0].webDetection.webEntities;
        console.log(webArray);
        webArray.forEach(function(element) {
          console.log(element);
          let newButton = `<button class='btn newButton btn-primary mt-1 mb-1 ml-1 mr-1' value='${
            element.description
          }'> ${element.description}`;

          // taking new buttons made and append to buttons dom
          $(".buttons").append(newButton);
        });
      });
    n++;
  };
  reader.readAsDataURL(file);
}

// when one of the web entities is clicked, take button's value and search it in webster api for synonyms
$(document.body).on("click", ".newButton", function() {
  // empty out results when a web entity is picked
  $(".results").empty();
  $(".hashTag-results").empty();

  // search term
  var searchQuery = $(this).attr("value");
  console.log(searchQuery);

  // key to api
  var apiKey = "00c5bc8f-694b-401c-8e1a-3d53225e08f3";

  // search term with apikey
  var apiRoute = `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${searchQuery}?key=${apiKey}`;
  $.get({
    url: apiRoute
  }).done(function(response) {
    console.log(response);

    // webster's synonym's response as an array
    let synonymArray = response[0].def[0].sseq[0][0][1].syn_list[0];

    // loop through synonym array and create hashtags / seo and append it to the DOM
    synonymArray.forEach(function(element) {
      var result = element.wd;
      let addHash = "#";
      var hashTag = addHash.concat(result);
      console.log(`synonym: ${element.wd}`);
      //creating buttons to push into hash and seo arrays
      $(".results").append(
        `<button class="seo-pick btn-danger m-2" data-attribute="${result}"> ${result}`
      );
      $(".hashTag-results").append(
        `<button class="hash-pick btn-danger m-2" data-attribute="${hashTag}"> ${hashTag}`
      );
    });
  });

  // ajax get method to search words API and get list of synonyms
  $.get({
    url: `https://wordsapiv1.p.mashape.com/words/${searchQuery}`,
    headers: {
      "X-Mashape-Key": "d0365a5fecmsh001a788d875b48cp15f702jsn438745cf2e54",
      Accept: "application/json"
    }
  }).done(function(wordApi) {
    wordApi.results.forEach(function(item) {
      if (item.synonyms) {
        item.synonyms.forEach(function(item) {
          console.log(`***********${item}`);

          // add the synonyms to the dom
          $(".results").append(`<div> ${item}`);
          $(".hashTag-results").append(`<div> #${item}`);
        });
      }
    });
  });
});

//push results into SEO array
$(document.body).on("click", ".seo-pick", function() {
  var seoVal = $(this).attr("data-attribute");
  console.log(seoVal);
  if (!seoArr.includes(seoVal)) {
    seoArr.push(seoVal);
    console.log(seoArr);
  } else {
    console.log("already exists");
  }
});

//push results into hash array
$(document.body).on("click", ".hash-pick", function() {
  var hashVal = $(this).attr("data-attribute");
  console.log(hashVal);
  if (!hashArr.includes(hashVal)) {
    hashArr.push(hashVal);
    console.log(hashArr);
  } else {
    console.log("already exists");
  }
});

// Tabs Transition
jQuery(document).ready(function() {
  jQuery(".tabs .tab-links a").on("click", function(e) {
    var currentAttrValue = jQuery(this).attr("href");

    // Show/Hide Tabs
    jQuery(".tabs " + currentAttrValue)
      .fadeIn(1000)
      .siblings()
      .hide();

    // Change/remove current tab to active
    jQuery(this)
      .parent("li")
      .addClass("active")
      .siblings()
      .removeClass("active");

    e.preventDefault();
  });
});

//Copy Text to the Clipboard
function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}
