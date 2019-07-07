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
    console.log()
    reader.onloadend = function () {
        baseCode = reader.result.replace(/^data:image\/[a-z]+;base64,/, "");
        newRequest(baseCode)
    }
    reader.readAsDataURL(file);
}
//on submit click makes axios call 
$('#submit-button').on('click', function () {
    var file = $('#file-upload').val()
    console.log(`File: ${file}`)
    console.log(`Filename: ${file.substr(12)}`)
    console.log(requestArr[0].request)

    // post method to google vision
    var bestLabel;
    $('#info').append('<div id="message">')
    $('#message').text(`File named "${file.substr(12)}" has been uploaded! One sec while we anaylze the image...`)
    axios.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBk4y2OKobnIOgdt4ggGlK8pbjHry4UpPI', requestArr[0].request)
        .then(function (response) {
            console.log(`response: ${response}`)
            bestLabel = response.data.responses[0].webDetection.bestGuessLabels[0].label;
            console.log(`bestLabel: ${bestLabel}`)

            // pass bestLabel into urban-dictionary-api
            var searchQuery = bestLabel;

            // tell user that it picked a keyword from image to find the definition for

            $('#message').text(`Based on the Image uploaded, it is strongly indicated that it's a "${searchQuery}".`)

            // creating variables and ajax call to get urban dictionary api
            var apiRoute = `http://api.urbandictionary.com/v0/define?term=${searchQuery}`;
            $.get({
                url: apiRoute
            }).done(function (urbanResponse) {
                // chose first item in array of definitions
                console.log(`Urban dictionary definition: ${urbanResponse.list[0].definition}`)
   
                // append response to dom
                $('#message').append(`<div id="definition" class="mt-5">`)
                $('#definition').text('Urban Dictionary Definition: ')
                $('#definition').append(`<div id="response-data">${urbanResponse.list[0].definition}`)
            });
        });
})