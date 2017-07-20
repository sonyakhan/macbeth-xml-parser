'use strict';

var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var https = require('https');
var xml2js = require('xml2js');
var parser = new xml2js.Parser(); 
var concat = require('concat-stream');
var util = require('util');
var _ = require('lodash');
var MacbethParser = require('./macbethparser');
var request = require('request');
var fs = require('fs');


let url = 'https://www.ibiblio.org/xml/examples/shakespeare/macbeth.xml';

(function () {
    https.get(url, (res) => {
        var macbeth = new MacbethParser(res);
        macbeth.parseData();
        
        res.on('error', (e) => {
            console.error(e);
        });
    });
}());

app.use(express.static(path.join(__dirname, 'public')));

server.listen(process.env.PORT || 3000, () => {
    console.log('Running on port 3000');
});