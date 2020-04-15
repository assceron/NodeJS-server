const express = require('express')
const app = express()
const port = 4567

app.route('/import').get(function(req,res)
{
    res.send("Script per importing XML");
});

app.route('/results').get(function(req,res)
{
    res.send("Script per processing results");
});

app.get('/',function(req,res){
    res.send('No functions previste');
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})