exports.createScoresTable = `CREATE TABLE IF NOT EXISTS scores( studentID INTEGER NOT NULL,
                                                  			   	testID INTEGER NOT NULL,
                                                  				firstName TEXT NOT NULL,
                                                  				lastName TEXT NOT NULL,
                                                  				markAvailable INTEGER NOT NULL,
                                                  				markObtained INTEGER NOT NULL,
                                                  				date TEXT NOT NULL,
                                                 				PRIMARY KEY(studentID,testID));`;


exports.scoreQueryBuilder = (studentID,testID,firstName,lastName,summaryMarks,markAvailable,markObtained,date) => {
	/* 
	Query explanation:
	1. Insert new row if it doesn't exist in the db
	2. If (studentID,testID) already exists:
		if old.markObtained < current.markObtained OR old.markAvailable < current.markAvailable:
			REPLACE old marks with new marks
	*/	 
	var query = `INSERT OR REPLACE INTO scores(studentID, testID, firstName, lastName, markAvailable, markObtained, date)
				 VALUES (${studentID},${testID},'${firstName}', '${lastName}',${markAvailable},${markObtained},'${date}')
				 ON CONFLICT(studentID,testID) DO UPDATE SET markObtained = excluded.markObtained, markAvailable = excluded.markAvailable
				 WHERE excluded.markObtained > scores.markObtained OR excluded.markAvailable > scores.markAvailable;`

	return query;
};

exports.getTestID = testID => {
	var query = `SELECT * FROM scores WHERE testID LIKE ${testID};`
	return query
}