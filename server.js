#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// module dependencies
var express = require('express');

// get port from environment and store in Express
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file
// index page
app.get('/', function(req, res) {
	res.render('pages/index');
});

// about page
app.get('/about', function(req, res) {
	res.render('pages/about');
});

// info page
app.get('/info', function(req, res) {
	res.render('pages/info');
});

// Endpoint to send places.json
app.get('/places', (req, res) => {
    fs.readFile(path.join(__dirname, 'places.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to load places' });
        }
        res.json(JSON.parse(data));
    });
});

// Get port from environment and store in Express
var port = process.env.PORT || 3000;
app.listen(port)
console.log('Server is listening on port', port)
