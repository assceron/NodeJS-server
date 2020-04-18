const express = require('express');
const sqlite3 = require("sqlite3").verbose();
const xmlparser = require("express-xml-bodyparser");
const path = require('path')

const { ErrorHandler, handleError } = require("./error")
const { aggregate,checkXML } = require("./server.helpers")
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

//Middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xmlparser());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/import',(req,res,next) =>{
	try{
		const results = req.body['mcq-test-results']['mcq-test-result'];
		const queriesList = checkXML(results);

		if(queriesList == -1){
			const error = new ErrorHandler(400, "Document is missing important bits");
			next(error);	
		}
		else{
			db.serialize(function(){
				for(query of queriesList)
					db.run(query);
			})
			res.status(200).send("Scores inserted in database");
		}			
	}
	catch (err) {
		next(err)
	}
})

app.get('/results/:testID/aggregate',(req,res,next)=>{

  	const testID = req.params.testID
  	const query = getTestID(testID)
  	try{
		db.serialize(function(){
			db.all(`${query}`, function(err, rows) {
      			if (err){
      				console.error(err);
      				const error = new ErrorHandler(err)
      				next(error)
      			}

      			if(rows.length == 0){
      				const error = new ErrorHandler(400, "Test ID required available")
      				next(error)
      			}

      			toReturn = aggregate(rows)
      			res.json(toReturn);
    		});
		})  		
  	}	
  	catch(error) {
  		next(err);
  	}
});

app.use((req, res, next) => {
 const error = new ErrorHandler(404,"Not found");
 next(error);
});

app.use((err, req, res, next) => {
  handleError(err, res);
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  //TRY TO SHUT DOWN THE DB AND SEE WHAT HAPPENS
  db.run(`${createScoresTable}`);
  console.log(`server is listening on ${port}`)

})