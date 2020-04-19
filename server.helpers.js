const { scoreQueryBuilder} = require("./sql");

const asc = arr => arr.sort((a, b) => a - b);
const sum = arr => arr.reduce((a, b) => a + b, 0);
const mean = arr => parseFloat((sum(arr) / arr.length).toFixed(2));

// sample standard deviation
const stddev = (arr) => {
    if(arr.length == 1) return 0;

    const mu = mean(arr);
    const diffArr = arr.map(a => (a - mu) ** 2);
    res = Math.sqrt(sum(diffArr) / (arr.length - 1));
    res = parseFloat(res.toFixed(2));
    return res;
};

const percentile = require("percentile");

const aggregate = rows => {
	var awards = [];
	var toReturn =  {}
	//TODO if rows.length == 0

	//Save the percentage of each obtained mark compared to the available mark
	for(i in rows){
		awards[i] = parseFloat(((rows[i].markObtained * 100)/rows[i].markAvailable).toFixed(2));
    }

    //console.log(awards);

    const meanValue = mean(awards);
    toReturn['mean'] = meanValue
    
    const stddevValue = stddev(awards);
    toReturn['stddev'] = stddevValue;

    const minValue = Math.min(...awards);
    toReturn['min'] = minValue;

    const maxValue = Math.max(...awards);
    toReturn['max'] = maxValue;

    const p25 = percentile(25, awards);
    toReturn['p25'] = p25;

    const p50 = percentile(50,awards);
    toReturn['p50'] = p50;

    const p75 = percentile(75,awards);
    toReturn['p75'] = p75;

    const count = rows.length;
    toReturn['count'] = count;

    //console.log(toReturn)

    return toReturn;

}
const checkNum = num => {
    if (isNaN(num) || num < 0) 
        return 0;
    return 1;
}

const buildQueriesList = xml => {
    var queriesList = []

    for(i in xml){
        //Get the data from parsed XML
        element = xml[i]
        const studentID = parseInt(element['student-number']);
        const testID = parseInt(element['test-id']);
        const firstName = element['first-name'];
        const lastName = element['last-name'];
        const summaryMarks= element['summary-marks'];
        let markAvailable;
        let markObtained;

        summaryMarks.forEach( mark => {
            markAvailable = parseInt(mark['$']['available']);
            markObtained = parseInt(mark['$']['obtained']);
            });

        const date = element['$']['scanned-on'];

        if(!checkNum(studentID) || !checkNum(testID) || !firstName || !lastName || !checkNum(markAvailable) || !checkNum(markObtained) || markObtained > markAvailable || !(date))
            return -1;

        const query = scoreQueryBuilder(studentID,testID,firstName,lastName,summaryMarks, markAvailable, markObtained,date);
        queriesList[i] = query;
    }
    return queriesList;
}

module.exports = { aggregate, buildQueriesList }
