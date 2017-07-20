'use strict';

let https = require('https');
let _ = require('lodash');
let xml2js = require('xml2js');
let parser = new xml2js.Parser(); 
let concat = require('concat-stream');
let util = require('util');


class MacbethParser {
    
    constructor(res) {
        this.response = res;
        this.data = {};
        this.speeches = {};        
        this.dict = {};
        this.sortedDict = {};
    }
    
    // setters and getters
    set response(r) {
        if(r) {
            this._response = r;
        }
    }
    
    get response() {
        return this._response;
    }     
    
    set data(d) {
        if(d) {
            this._data = d;
        }
    }
    
    get data() {
        return this._data;
    }   
    
    set speeches(s) {
        if(s) {
            this._speeches = s;
        }
    }
    
    get speeches() {
        return this._speeches;
    }
    
    set dict(d) {
        if(d) {
            this._dict = d;
        }
    }
    
    get dict() {
        return this._dict;
    }
    
    set sortedDict(sd) {
        if(sd) {
            this._sortedDict = sd;
        }
    }
    
    get sortedDict() {
        return this._sortedDict;
    }
        
    
    // parses the XML to JSON
    parseData() {
        parser.on('error', (err) => { 
            console.log('Parser error', err);
        });    
        this.response.on('error', (err) => {
            console.log('Error while reading', err);
        });
        this.response.pipe(concat((buffer) => {
            let xml = buffer.toString();
            this.parseXMLToJSON(xml);
            this.analyze();
        }));
    }
    
    // helper function to parseData()
    parseXMLToJSON(xml) {
        parser.parseString(xml, (err, result) => {
            this.data = result;
        });
    }     
    
    // main function in the app that gets called in app.js
    // calls the helper functions to do parsing, sorting, and computational work
    analyze() {
        this.getSpeeches(this.data);
        this.countLines(this.speeches, this.dict);
        this.deleteAll(this.dict);
        this.sortLines(this.dict);
        this.printSortedDict(this.sortedDict);
    }    
    
    // gets all of the speeches in the play to perform analysis on later
    getSpeeches(data) {
        let scenes = _.flatMap(data.PLAY.ACT, 'SCENE');
        let mappedSpeeches = _.flatMap(scenes, (scene) => {
            return scene.SPEECH;
        });
        this.speeches = mappedSpeeches;
    }
    
    // loops through all speeches, counts lines spoken by each character, and stores them in dictionary
    // nested loop for edge case of counting multiple speakers in one speech block
    countLines(speeches, dict) {
        _.forEach(speeches, (speech) => {
            let speakers = speech.SPEAKER;                
            _.forEach(speakers, (speaker) => {
                if(!(speaker in dict)) {
                    dict[speaker] = 0;
                }
                dict[speaker] += speech.LINE.length;
            });
        });
    }
    
    // deletes the key 'ALL' from the dictionary of speakers
    deleteAll(dict) {
        delete dict['ALL'];
    }
    
    // sorts the dictionary that is filled with each character and their # lines spoken
    sortLines(dict) {
        let sorted = Object.keys(dict).map((key) => {
           return [key, dict[key]]; 
        });
        sorted.sort((first, second) => {
           return second[1] - first[1]; 
        });
        this.sortedDict = sorted;
    }
    
    // prints the sorted dictionary
    printSortedDict(sortedDict) {
        for (let [key, value] of sortedDict) {
            console.log(value + ' ' + key);
        }
    }
}

module.exports = MacbethParser;



