const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '15MB' }))

const fs = require('fs')
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}

app.post('/', (req, res) => {
    console.log('post req', req.body)
    fs.writeFile(req.body.path + ".jpg", req.body.base64, 'base64', (err) => {
        if (err) throw err
    })
    res.status(200)
})

app.get('/', (req, res) => {
    console.log('get req', req.body)
    res.status(200)
})

console.log('starting...')
const https = require('https');
https.createServer(options, app).listen(8080);
