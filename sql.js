exports.createScoresTable = `CREATE TABLE IF NOT EXISTS scores( studentID INTEGER NOT NULL,
                                                  			   	testID INTEGER NOT NULL,
                                                  				firstName TEXT NOT NULL,
                                                  				lastName TEXT NOT NULL,
                                                  				markAvailable INTEGER NOT NULL,
                                                  				markObtained INTEGER NOT NULL,
                                                  				date TEXT NOT NULL,
                                                 				PRIMARY KEY(studentID,testID));`;

exports.scoreQueryBuilder = element => {
	//Get the data from parsed XML
	const studentID = parseInt(element['student-number'])
	const testID = parseInt(element['test-id'])
	const firstName = element['first-name']
	const lastName = element['last-name']
	const summaryMarks= element['summary-marks']
	let markAvailable
	let markObtained

	summaryMarks.forEach( mark => {
		markAvailable = parseInt(mark['$']['available'])
		markObtained = parseInt(mark['$']['obtained'])
		});

	const date = element['$']['scanned-on']

	//console.log("Query preparation")
	
	/* 
	Query:
	1. Insert new row if it doesn't exist in the db
	2. If (studentID,testID) already existing:
		if old.markObtained < current.markObtained OR old.markAvailable < current.markAvailable:
			REPLACE old marks with new marks
		else
			DO NOTHING
	*/	 
	var query = 'INSERT OR REPLACE INTO scores(studentID, testID, firstName, lastName, markAvailable, markObtained, date)'
	query += 'VALUES ('+ studentID + ','+ testID +',"'+ firstName + '","'+ lastName + '",' + markAvailable + ',' + markObtained + ',"' + date +'")'
	query += 'ON CONFLICT(studentID,testID) DO UPDATE SET '
	query += 'markObtained = excluded.markObtained, '
	query += 'markAvailable = excluded.markAvailable '
	query += 'WHERE excluded.markObtained > scores.markObtained OR excluded.markAvailable > scores.markAvailable;'

	//The "excluded." prefix refers to the new mark* values

	//console.log(query)

	return query;
};