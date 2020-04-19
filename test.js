var request = require('request');
function postXML(xml){
  var headers = {
      'Content-Type': 'text/xml+markr'
  };
  var options = {
      url: 'http://localhost:4567/import',
      method: 'POST',
      headers: headers,
      body: xml
  };

  function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
      else{
        console.error(body);
      }
  }

  request(options, callback);

}

function getAggregate(testID){
    var options = {
      url: `http://localhost:4567/results/${testID}/aggregate`,
      method: 'GET',
  };
  function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
      else{
        console.error(body)
      }
  }

  request(options, callback);
}
/*
  Correct entry
*/
function test0(){
  console.log("Running test #0: Correct format");
  const xml = `<mcq-test-results>
                  <mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
                      <first-name>Jane</first-name>
                      <last-name>Austen</last-name>
                      <student-number>521585128</student-number>
                      <test-id>1234</test-id>
                      <summary-marks available="20" obtained="13" />
                  </mcq-test-result>
              </mcq-test-results>`;
  postXML(xml);

}

/*
  Empty XML
*/
function test1(){
  console.log("Running test #1: Empty XML");
  const xml = "";
  postXML(xml);
}

/*
  One missing field --> Entire document rejected
*/
function test2(){
  console.log("Running test #2: Missing field");
  const xml = `<mcq-test-results>
                  <mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
                      <first-name>Assunta</first-name>
                      <last-name>Cerone</last-name>

                      <test-id>1234</test-id>
                      <summary-marks available="20" obtained="14" />
                  </mcq-test-result>

                  <mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
                      <first-name>Fra</first-name>
                      <last-name>Cerone</last-name>
                      <student-number>1234</student-number>
                      <test-id>1234</test-id>
                      <summary-marks available="20" obtained="14" />
                  </mcq-test-result>

              </mcq-test-results>`;

  postXML(xml);
}

/*
  Insert same studentID,testID with higher score
*/
function test3(){
  console.log("Running test #3: Existent field with higher score");
  const xml = `<mcq-test-results>
                  <mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
                      <first-name>Jane</first-name>
                      <last-name>Austen</last-name>
                      <student-number>521585128</student-number>
                      <test-id>1234</test-id>
                      <summary-marks available="20" obtained="14" />
                  </mcq-test-result>
              </mcq-test-results>`;
  postXML(xml);
}

/*
  Get aggregate from existent test id
*/
function test4(){
  console.log("Running test #5: Aggregate results");
  getAggregate(1234);
}

/*
  Test ID not available
*/

function test5(){
  console.log("Running test #6: Test ID not available");
  getAggregate(0);
}

test0();
test1();
test2();
test3();
test4();
test5();