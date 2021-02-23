/* 

Primary file for API

 */

// Dependencies
let http = require('http');
let https = require('https');
let url = require('url');
let StringDecoder = require('string_decoder').StringDecoder;
let config = require('./config');
let fs = require('fs');

// Instantiate the HTTP server 
let httpServer = http.createServer(function (req, res) {
    unifiedServer(req, res);
});

// Instantiate the HTTPS server 
let httpsServerOptions = {
    'key': fs.readFileSync('./ssl/key.pem', 'utf-8'),
    'cert': fs.readFileSync('./ssl/cert.pem', 'utf-8')
};
let httpsServer = https.createServer(httpsServerOptions, function (req, res) {
    unifiedServer(req, res);
});

// Start the HTTP server
httpServer.listen(config.httpPort, function () {
    console.log(`The server is listening on port ${config.httpPort} in ${config.envName} enviroment`);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, function () {
    console.log(`The server is listening on port ${config.httpsPort} in ${config.envName} enviroment`);
});

// All the server logic for both http and https server
let unifiedServer = function (req, res) {
    // Get the URL and parse it
    let parsedUrl = url.parse(req.url, true);

    // Get the path
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');

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
            res.writeHead(statusCode, { 'Content-Type': 'application/json' });
            res.end(payloadString);

            // log the request path
            console.log('Request was recieved with this payload: ' + buffer);
        });
    });
};

// Define the handlers
let handlers = {};

// ping handlers
handlers.ping = function (data, callback) {
    callback(200);
};

// Not found handler
handlers.notFound = function (data, callback) {
    callback(404);
};

// Hello handler
handlers.hello = function (data, callback) {
    callback(200, {
        'status': 200,
        'remarks': 'Ok',
        'data': {
            'message': 'Welcome to uptime monitor app'
        }
    })
}

// Define a request router
let router = {
    'ping': handlers.ping,
    'hello': handlers.hello
}