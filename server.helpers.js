const asc = arr => arr.sort((a, b) => a - b);
const sum = arr => arr.reduce((a, b) => a + b, 0);
const mean = arr => parseFloat(sum(arr) / arr.length);

// sample standard deviation
const stddev = (arr) => {
    const mu = mean(arr);
    const diffArr = arr.map(a => (a - mu) ** 2);
    res = Math.sqrt(sum(diffArr) / (arr.length - 1));
    if (isNaN(res)) res = 0;

    res = parseFloat(res.toPrecision(2));

    return res;
};

const percentile = require("percentile");

const aggregate = rows => {
	var awards = [];
	var toReturn =  {}
	//TODO if rows.length == 0

	//Save the percentage of each obtained mark compared to the available mark
	for(i in rows){
		awards[i] = parseFloat(((rows[i].markObtained * 100)/rows[i].markAvailable).toPrecision(2));
    }


    const meanValue = mean(awards);
    toReturn['mean'] = meanValue
    
    const stddevValue = stddev(awards);
    toReturn['stddev'] = stddevValue;

    const minValue = Math.min(awards);
    toReturn['min'] = minValue;

    const maxValue = Math.max(awards);
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

module.exports = { aggregate }
