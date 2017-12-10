/**
 * Bare-bones HTTP server
 */
const http = require('http')
const fs = require('fs')
const formidable = require('formidable')
const path = require('path')
const port = process.env.PORT || 8085
const secret_token = process.env.SECRET_TOKEN || 'ignitedemo'

console.log('Listening on *:' + port)

http.createServer((req, res) => {
    if(req.url == '/upload?' + secret_token) {
        var form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            var oldpath = files.file.path;
            var newpath = path.join(__dirname, 'uploads/' + files.file.name);
            fs.rename(oldpath, newpath, (err) => {
                if(err) throw err;
                res.write('Uploaded')
                res.end()
            })
        })
    } else {
        var filePath = req.url;
        if(filePath.indexOf(secret_token) === -1) {
            res.writeHead(404, { 'Content-Type': 'text/html' })
            return res.end('Ignite.js Server')
        }
        else {
            filePath = filePath.replace('?' + secret_token, '')
        }
        if(filePath == '/') {
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write('Ignite.js Server')
            return res.end();
        }
        var contentType = 'application/x-tar'
        var newpath = path.join(__dirname, filePath)
        fs.readFile(newpath, (err, content) => {
            if(err) {
                res.writeHead(404, {'Content-Type': 'text/html'})
                res.write('File not found')
                return res.end()
            }
            res.setHeader(
                'Access-Control-Allow-Origin', '*'
            )
            res.setHeader(
                'Access-Control-Allow-Methods',
                'GET, POST, OPTIONS, PUT, PATCH, DELETE'
            )
            res.setHeader(
                'Access-Control-Allow-Headers', '*'
            )
            res.writeHead(200, {'Content-Type': contentType});
            return res.end(content)
        })
    }
}).listen(port)