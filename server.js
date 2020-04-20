const express = require('express');
const sqlite3 = require("sqlite3").verbose();
const xmlparser = require("express-xml-bodyparser");
xmlparser.regexp = /^text\/xml\+markr$/i;

const path = require('path')

const { ErrorHandler, handleError } = require("./error")
const { aggregate,buildQueriesList } = require("./server.helpers")
const {
  createScoresTable,
  scoreQueryBuilder,
  getTestID
} = require("./sql");


const port = 4567;

//Database connection
const DB_PATH = path.resolve(__dirname, 'scores.db')
const db = new sqlite3.Database(DB_PATH,  (err) => {

  if (err) {
    console.error(err.message);
    const error = new ErrorHandler(500, err.message)
    next(error)
  }

  console.log('Connected to ' + DB_PATH + ' database.')

});
db.run(`${createScoresTable}`);

//Middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xmlparser());


app.post('/import',(req,res,next) =>{	
	try{
		const results = req.body['mcq-test-results']['mcq-test-result'];
		const queriesList = buildQueriesList(results);
		if(queriesList == -1){
			console.log("Incorrect Document");
			next(new ErrorHandler(400, "Bad Request: Incorrect Document"));	
		}
		else{
			db.serialize(function(){
				db.exec("BEGIN");
				for(query of queriesList)
					db.run(query);
				db.exec("COMMIT")
			})
			console.log("Scores inserted in database")
			res.status(200).send("Scores inserted in database");
		}			
	}
	catch (err) {
		console.error(err.message);
		next(new ErrorHandler(400,"Bad Request: Incorrect Document"));
	}
});

app.get('/results/:testID/aggregate',(req,res,next)=>{
  	const testID = req.params.testID;
  	const query = getTestID(testID);
  	try{
		db.serialize(function(){
			db.all(`${query}`, function(err, rows) {
      			if (err){
      				console.error(err);
      				next(new ErrorHandler(400,"Bad Request: " + err));
      			}

      			else if(rows.length == 0){
      				console.error("Bad Request: Test ID required not available");
      				next(new ErrorHandler(400, "Bad Request: Test ID required not available"));
      			}
      			else{
	      			toReturn = aggregate(rows)
	      			res.json(toReturn);
	      		}
    		});
		})  		
  	}	
  	catch(error) {
  		console.error(err.message)
  		next(new ErrorHandler(500,err.message));
  	}
});

app.use((req, res, next) => {
 next(new ErrorHandler(404,"Not found"));
});

app.use((err, req, res, next) => {
  handleError(err, res);
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  //TRY TO SHUT DOWN THE DB AND SEE WHAT HAPPENS
  console.log(`server is listening on ${port}`)

})
