'use strict';

var expect = require('chai').expect;
var MacbethParser = require('../macbethparser');
var fs = require('fs');
var _ = require('lodash');


describe("MacbethParser", function() {
    
    // uncomment the commented code lines in each test case to view the data being tested
   
    it("should return an empty response if no xml was passed in to the parameter", function() {
        let macbeth = new MacbethParser();
//        console.log('Response was :', macbeth.response);
        expect(macbeth.response).to.be.undefined;
    });
    
    it("should turn the XML into JSON", function() {        
        let xml = fs.readFileSync(__dirname + '/macbeth.xml').toString();
        let macbeth = new MacbethParser(xml);
        macbeth.parseXMLToJSON(xml);
//        console.log('Data was :', macbeth.data);
        expect(macbeth.data).not.to.be.empty;
        expect(macbeth.data).not.to.be.undefined;
        expect(macbeth.data).to.be.instanceOf(Object);
    });
    
    it("should parse the JSON and return all the speeches", function() {
        let xml = fs.readFileSync(__dirname + '/macbeth.xml').toString();        
        let macbeth = new MacbethParser(xml);
        macbeth.parseXMLToJSON(xml);
        macbeth.getSpeeches(macbeth.data);
//        console.log('Speeches were :', macbeth.speeches);
        expect(macbeth.speeches).not.to.be.empty;
        expect(macbeth.speeches).not.to.be.undefined;
        expect(macbeth.speeches).to.be.instanceOf(Object);        
    });
    
    it("should populate the dictionary", function() {
        let xml = fs.readFileSync(__dirname + '/macbeth.xml').toString();        
        let macbeth = new MacbethParser(xml);
        macbeth.parseXMLToJSON(xml);
        macbeth.getSpeeches(macbeth.data);
        macbeth.countLines(macbeth.speeches, macbeth.dict);
//        console.log('Dict was :', macbeth.dict);
        expect(macbeth.dict).not.to.be.empty;
        expect(macbeth.dict).not.to.be.undefined;
        expect(macbeth.dict).to.be.instanceOf(Object);
    });
    
    it("should count the correct number of lines in a speech block", function() {
        let xml = fs.readFileSync(__dirname + '/macbeth.xml').toString();        
        let macbeth = new MacbethParser(xml);
        macbeth.parseXMLToJSON(xml);        
        macbeth.getSpeeches(macbeth.data);        
        let testSpeeches = [];
        let testDict = {};
        testSpeeches.push(macbeth.speeches[0]);
        testSpeeches.push(macbeth.speeches[1]);        
        macbeth.countLines(testSpeeches, testDict);
//        console.log('Test Speeches were :', testSpeeches);     
//        console.log('Test Dict was :', testDict);
        expect(testDict['First Witch']).to.equal(2);
        expect(testDict['Second Witch']).to.equal(2);   
    });
    
    it("should detect if more than one speaker is in a speech block", function() {
        let xml = fs.readFileSync(__dirname + '/macbeth.xml').toString();        
        let macbeth = new MacbethParser(xml);
        macbeth.parseXMLToJSON(xml);        
        macbeth.getSpeeches(macbeth.data);        
        let multSpeech = [];
        let testDict = {};
// determines where in the play multiple speakers spoke at same time
        _.forEach(macbeth.speeches, (speech) => {
            let speakers = speech.SPEAKER;
            if(speakers.length > 1) {
                multSpeech.push(speech);
//                console.log('The speech where multiple speakers spoke was :', multSpeech);
                return;
            }
        })
        macbeth.countLines(multSpeech, testDict);
//        console.log('Test Dict was :', testDict);
        expect(testDict['MACBETH']).to.equal(1);
        expect(testDict['LENNOX']).to.equal(1);
    });    
    
    it("should sort the dictionary from greatest to least number of lines spoken", function() {
        let xml = fs.readFileSync(__dirname + '/macbeth.xml').toString();        
        let macbeth = new MacbethParser(xml);
        macbeth.parseXMLToJSON(xml);
        macbeth.getSpeeches(macbeth.data);
        macbeth.countLines(macbeth.speeches, macbeth.dict);
        macbeth.sortLines(macbeth.dict);
        // make an array out of sortedDict comprised of only the values
        let lineNums = [];
        for (let [key, value] of macbeth.sortedDict) {
            lineNums.push(value);
        }
        // loop thru every item in lineNums arr and check that the current item > next item, while next item != undefined
        let inOrder = true;
        _.forEach(lineNums, (item, index) => {
            let lastIndex = lineNums.length;
            let nextItem = lineNums[index+1];
//            console.log('Curr Item :', item, 'Next Item :', nextItem);
            if(index+1 < lastIndex) {
                if((item < nextItem)) {
                    inOrder = false;
                    return;
                }
            }
        }); 
        expect(inOrder).to.be.true;
    });
    
    it("should check that there is no ALL speaker in dict", function() {
        let xml = fs.readFileSync(__dirname + '/macbeth.xml').toString();        
        let macbeth = new MacbethParser(xml);
        macbeth.parseXMLToJSON(xml);
        macbeth.getSpeeches(macbeth.data);
        macbeth.countLines(macbeth.speeches, macbeth.dict);
        macbeth.deleteAll(macbeth.dict);
        let allInDict = "ALL" in macbeth.dict;
        expect(allInDict).to.be.false;
    });    
    
});