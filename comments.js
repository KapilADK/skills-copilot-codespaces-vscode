// create web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const commentsPath = path.join(__dirname, 'comments.json');

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/comments') {
        fs.readFile(commentsPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Server error'}));
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(data);
        });
    } else if (req.method === 'POST' && req.url === '/comments') { 
        let body = [];
        req.on('data', chunk => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            let comments;
            try {
                comments = JSON.parse(body);
            } catch (e) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Invalid JSON'}));
                return;
            }
            fs.readFile(commentsPath, 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Server error'}));
                    return;
                }
                let commentsArray;
                try {
                    commentsArray = JSON.parse(data);
                } catch (e) {
                    commentsArray = [];
                }
                commentsArray.push(comments);
                fs.writeFile(commentsPath, JSON.stringify(commentsArray), err => {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({error: 'Server error'}));
                        return;
                    }
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(commentsArray));
                });
            });
        });
    } else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Not found'}));
    }
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});