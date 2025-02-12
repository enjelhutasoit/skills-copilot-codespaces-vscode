// Create web server
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

const hostname = '127.0.0.1';
const port = 3000;

let comments = [];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method.toUpperCase();
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', (chunk) => {
        buffer += decoder.write(chunk);
    });

    req.on('end', () => {
        buffer += decoder.end();

        if (path === '/comments' && method === 'GET') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(comments));
        } else if (path === '/comments' && method === 'POST') {
            const comment = JSON.parse(buffer);
            comments.push(comment);
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(comment));
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Not Found');
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});