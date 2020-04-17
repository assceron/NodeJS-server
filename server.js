const express = require('express');
const sqlite3 = require("sqlite3").verbose();
const xmlparser = require("express-xml-bodyparser");
const path = require('path')

const { buildResponse } = require("./server.helpers")
const {
  createScoresTable,
  scoreQueryBuilder
} = require("./sql");


const port = 4567;

//Database connection
const DB_PATH = path.resolve(__dirname, 'scores.db')
const db = new sqlite3.Database(DB_PATH,  (err) => {

  if (err) {
    console.error(err.message);
  }

  console.log('Connected to ' + DB_PATH + ' database.')

});

//Middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xmlparser());


//POST XML
app.post('/import',(req,res) => {
	const results = req.body['mcq-test-results']['mcq-test-result'];
	try{
		results.forEach(element => {
			const insert_query = scoreQueryBuilder(element);
			db.run(insert_query, err => {
				if (err) {
					//res.status(400).json(err.message)
					return console.error('StudentID:' + element['student-number'] + ' Test: ' + element['test-id']  + " NOT inserted because of " + err.message)
				}
				else{
					console.log('StudentID:' + element['student-number'] + ' Test: ' + element['test-id']  + " successfully inserted")
				}
			})
		})
		
	}
	catch(err){
		//
	}
});
/*
app.get('/results',(req,res)=>{
    res.send("Script per processing results");
});

app.get('/',function(req,res){
    res.send('No functions previste');
});
*/
app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  db.run(`${createScoresTable}`);
  console.log(`server is listening on ${port}`)

})