const express = require('express');
const sqlite3 = require("sqlite3").verbose(),
	  TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;
const xmlparser = require("express-xml-bodyparser");
const path = require('path')

const { ErrorHandler, handleError } = require("./server.helpers")
const {
  createScoresTable,
  scoreQueryBuilder
} = require("./sql");


const port = 4567;

//Database connection
const DB_PATH = path.resolve(__dirname, 'scores.db')
const db = new TransactionDatabase(new sqlite3.Database(DB_PATH,  (err) => {

  if (err) {
    console.error(err.message);
  }

  console.log('Connected to ' + DB_PATH + ' database.')

}));

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

//POST XML
app.post('/import',(req,res,next) => {
	try{
		const results = req.body['mcq-test-results']['mcq-test-result'];
		db.serialize(function() {
			db.beginTransaction(function(err, transaction){
				for(element of results){
					var insert_query = scoreQueryBuilder(element);
					transaction.run(insert_query, err => {
						if (err) {
							transaction.rollback()
							const error_message = 'StudentID:' + element['student-number'] + ' Test: ' + element['test-id']  + " NOT inserted because of " + err.message;
							const error = new ErrorHandler(400, error_message)
							console.error(error_message);	
							next(error)	
							return console.error("NO COMMIT")
						}
						else{
							console.log(tmp_message = 'StudentID:' + element['student-number'] + ' Test: ' + element['test-id']  + " successfully inserted");					//console.log(tmp_message);
						}
					})
				}
				transaction.commit(function(err){
					if (err) return console.log("Commit failed.", err);
	           		console.log("Commit() was successful.");
				})
			})
		})
	}
	catch(error){
		console.error(error.message)
		next(error)
	}
});

/*
app.get('/results',(req,res)=>{
    res.send("Script per processing results");
});

*/
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
  db.run(`${createScoresTable}`);
  console.log(`server is listening on ${port}`)

})