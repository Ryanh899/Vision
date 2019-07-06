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
            console.log(response.data.responses[0].webDetection.webEntities)
            response.data.responses[0].webDetection.webEntities.forEach(function(element, i) {
                $('#info').append(`<button class="btn btn-primary m-2" data-attribute="${response.data.responses[0].webDetection.webEntities[i].description}" id="pic-${i}">${response.data.responses[0].webDetection.webEntities[i].description}</button>`)
            })
        });
})

