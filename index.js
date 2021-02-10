const express = require('express');
const bodyParser = require('body-parser')
const pdf = require('./pdfGenerator')
const server = express()
const router = express.Router()

server.use(bodyParser.json())
router.get('/getPDF', pdf.pdfGenerator)
server.use(router)
server.listen(3001)