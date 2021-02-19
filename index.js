/* 

Primary file for API

 */

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all the requests with a string 
var server = http.createServer(function (req, res) {

    // Get the URL and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    let path = parsedUrl.pathname;
    let trimmedUrl = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    let queryStringObject = parsedUrl.query;

    // Get the http method
    let method = req.method.toLowerCase();

    // Get the headers as an object
    let headers = req.headers;

    // Get the payload, if any

    // Send the response
    res.end('Hello World\n');

    // log the request path
    console.log('Request recieved with url ' + trimmedUrl);
})

server.listen(3000, function () {
    console.log('The server is listening on port 3000');
});