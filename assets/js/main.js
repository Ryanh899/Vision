//variable for base64 images 
var baseCode
//arr of requests 
var requestArr = [];
//constructor for new request objs 
function addRequests(picData) {
    this.request = {}
    this.request.requests = [{}]
    this.request.requests[0].image = { "content": picData }
    this.request.requests[0].features = [{
        "type": "LABEL_DETECTION",
        "maxResults": 1
    },
    {
        "type": "FACE_DETECTION",
        "maxResults": 10
    },
    {
        "type": "OBJECT_LOCALIZATION",
        "maxResults": 10
    },
    {
        "type": "DOCUMENT_TEXT_DETECTION",
        "maxResults": 10
    },
    {
        "type": "LANDMARK_DETECTION",
        "maxResults": 10
    },
    {
        "type": "WEB_DETECTION",
        "maxResults": 10
    },
    {
        "type": "SAFE_SEARCH_DETECTION",
        "maxResults": 10
    },
    {
        "type": "IMAGE_PROPERTIES",
        "maxResults": 10
    },]
}
//pushes new requests to arr/ creates new request objs 
function newRequest(img) {
    var addedRequest = new addRequests(img)
    requestArr.push(addedRequest)
}
//gets input file and converts to base64
function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    console.log(reader.result)
    reader.onloadend = function () {
        baseCode = reader.result.replace(/^data:image\/[a-z]+;base64,/, "");
        newRequest(baseCode)
        $('#picDiv').append(`<img src="${reader.result}">`)
    }
    reader.readAsDataURL(file);
}
//on submit click makes axios call 
$('#submit-button').on('click', function () {
    var file = $('#file-upload').val()
    console.log(file.substr(12))
    console.log(requestArr[0].request)
    axios.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBk4y2OKobnIOgdt4ggGlK8pbjHry4UpPI', requestArr[0].request)
        .then(function (response) {

            let webArray = response.data.responses[0].webDetection.webEntities

            console.log(webArray)

            webArray.forEach(function (element) {
                let newButton = (`<button class='btn newButton btn-primary mt-1 mb-1 ml-1 mr-1' value='${element.description}'> ${element.description}`)



                $('#buttons').append(newButton)

                console.log(element)


            });

        })
})


$(document.body).on("click", ".newButton", function () {


    // search term
    var searchQuery = $(this).attr('value')

    console.log(searchQuery)

    // key to api
    var apiKey = '00c5bc8f-694b-401c-8e1a-3d53225e08f3';

    // search term with apikey
    var apiRoute = `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${searchQuery}?key=${apiKey}`;
    $.get({
        url: apiRoute
    }).done(function (response) {
        // check console for return obj
        console.log(response);


        let synonymArray = response[0].def[0].sseq[0][0][1].syn_list[0]




        synonymArray.forEach(function (element) {
            console.log(element.wd)
            $('.results').append('<div>').append(element.wd)
        });
    });

//next api call



    
});

jQuery(document).ready(function() {
	jQuery('.tabs .tab-links a').on('click', function(e) {
		var currentAttrValue = jQuery(this).attr('href');

		// Show/Hide Tabs
		jQuery('.tabs ' + currentAttrValue).show().siblings().hide();

		// Change/remove current tab to active
		jQuery(this).parent('li').addClass('active').siblings().removeClass('active');

		e.preventDefault();
	});
});