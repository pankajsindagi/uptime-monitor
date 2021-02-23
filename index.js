/* 

Primary file for API

 */

// Dependencies
import { createServer } from 'http';
import { parse } from 'url';
import { StringDecoder } from 'string_decoder';

// The server should respond to all the requests with a string 
let server = createServer(function (req, res) {

    // Get the URL and parse it
    let parsedUrl = parse(req.url, true);

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