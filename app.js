/*
$(function() {

  $('.upload').click( function(e) {
    e.preventDefault();
    processFile($);
    return false;
  });
});
*/


function sendXML() {
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var url = "http://localhost:4567/import";
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", url);
  xhttp.onreadystatechange = () => {
    //Callback function to be called when the state changes, and use an if statement to check whether the request was successful.
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      const res = xhttp.response;
    }
  };
  var xml = `<mcq-test-results>
        <mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
            <first-name>Jane</first-name>
            <last-name>Austen</last-name>
            <student-number>521585128</student-number>
            <test-id>1234</test-id>
            <summary-marks available="20" obtained="13" />
        </mcq-test-result>
    </mcq-test-results>`

  xhttp.setRequestHeader("Content-Type", "text/xml+markr");
  xhttp.send(xml);
}

function processFile(filename) {
  var fs = require('fs');;
  try{
    fs.readFile(filename, function(err,data){
      sendXML(data)
    })
    /*
    reader.onload = function(e) {
      xml = e.target.result;
      const beginXML = xml.search("<mcq-test-results");
      xml = xml.substring(beginXML, xml.length);
    */
      //sendXML(xml, name, jquery);
  }catch(err){
    console.error(err.message)
  }
}

var request = require('request');

var headers = {
    'Content-Type': 'text/xml+markr'
};

var dataString = `<mcq-test-results>
        <mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
            <first-name>Jane</first-name>
            <last-name>Austen</last-name>
            <student-number>521585128</student-number>
            <test-id>1234</test-id>
            <summary-marks available="20" obtained="13" />
        </mcq-test-result>
    </mcq-test-results>`

var options = {
    url: 'http://localhost:4567/import',
    method: 'POST',
    headers: headers,
    body: dataString
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
}

request(options, callback);