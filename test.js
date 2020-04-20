var request = require('request-promise');

function getAggregate(testID){
    var options = {
      url: `http://localhost:4567/results/${testID}/aggregate`,
      method: 'GET',
  };

  return request(options);
}

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

  return request(options);
}

/*
  One missing field --> Entire document rejected
*/
function test0(){
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

  const mess = "Running test #0: Missing field\n";
  postXML(xml)
    .then( response =>{ console.log( mess + response +"\n")})
    .catch(error => {console.error(mess + error +"\n")})
}

/*
  Correct entry
*/
function test1(){
 
  const xml = `<mcq-test-results>
                  <mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
                      <first-name>Jane</first-name>
                      <last-name>Austen</last-name>
                      <student-number>521585128</student-number>
                      <test-id>1234</test-id>
                      <summary-marks available="20" obtained="13" />
                  </mcq-test-result>
              </mcq-test-results>`;

    const mess = "Running test #1: Correct XML\n" + "Response: ";
    postXML(xml)
    .then( response =>{ console.log(mess + response +"\n")})
    .catch(error => {console.error(mess + error + "\n")})
  
}

/*
  Empty XML
*/
function test2(){
  const xml = "";
  const mess = "Running test #2: Empty XML\n" + "Response: ";
  postXML(xml)
    .then( response =>{ console.log( mess + response +"\n")})
    .catch(error => {console.error(mess + error +"\n")})
}



/*
  Insert same studentID,testID with higher score
*/
function test3(){
  const xml = `<mcq-test-results>
                  <mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
                      <first-name>Jane</first-name>
                      <last-name>Austen</last-name>
                      <student-number>521585128</student-number>
                      <test-id>1234</test-id>
                      <summary-marks available="20" obtained="14" />
                  </mcq-test-result>
              </mcq-test-results>`;

  const mess = "Running test #3: Existent field with higher score\n";
  postXML(xml)
    .then( response =>{ console.log( mess + response +"\n")})
    .catch(error => { console.error(mess + error +"\n")})
}

/*
  Get aggregate from existent test id
*/
function test4(){
  const mess = "Running test #4: Aggregate results\n";
  getAggregate(1234)
    .then( response =>{ console.log( mess + response +"\n")})
    .catch(error => {console.error(mess + error +"\n")})
}

/*
  Test ID not available
*/

function test5(){
  const mess = "Running test #5: Test ID not available\n";
  getAggregate(0)
    .then( response =>{ console.log( mess + response +"\n")})
    .catch(error => {console.error(mess + error +"\n")})
}


async function testing(){
  const tests = [test0, test1,test2, test3, test4, test5];
  for (let test of tests){
    await test()
  }
}

testing()