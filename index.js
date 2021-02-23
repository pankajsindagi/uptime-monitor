/* 

Primary file for API

 */

// Dependencies
import { createServer } from 'http';
import { parse } from 'url';
import { StringDecoder } from 'string_decoder';
import { config } from './config';

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
    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();

        // Choose the handler this request should go to. If one is not found, use the not found handler.
        var chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };
        // Route the request to the handler specified in the router
        chosenHandler(data, function (statusCode, payload) {

            // Use the status code returned from the handler, or set the default status code to 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            // Use the payload returned from the handler, or set the default payload to an empty object
            payload = typeof (payload) == 'object' ? payload : {};

            // Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            // Return the response
            res.writeHead(statusCode);
            res.end(payloadString);

            // log the request path
            console.log('Request was recieved with this payload: ' + buffer);
        });
    });
});

server.listen(3000, function () {
    console.log('The server is listening on port 3000');
});

// Define the handlers
let handlers = {};

// Sample handlers
handlers.sample = function (data, callback) {
    // Callback a http status code, and a payload object
    callback(406, { 'name': 'sample handler' });
};

// Not found handler
handlers.notFound = function (data, callback) {
    callback(404);
};

// Define a request router
let router = {
    'sample': handlers.sample
}