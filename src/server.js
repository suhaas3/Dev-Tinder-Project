// Import the express module
const express = require('express');

// Create an express app
const app = express();

// Define a port
const PORT = 3333;

//if don't write the 'b' it will work
app.get('/ab?cd',(req,res) => {
  console.log(res.query)
  res.send({firstname:"sai suhaas",lastname:"jatangi"});
})

//first letter is 'a' and then last letter is 'b' remaining any thing we write it will work
app.get('/a*b',(req,res) => {
  res.send({first:"sai",last:"suhaas"})
})

app.get('/a(bd)+c',(req,res) => {
  res.send({first:"jatangi",last:"sai suhaas"})
})

app.get('/user/:userId/:userName/:password',(req,res) => {
  console.log(req.params)
  res.send({firstname:'hardik',lastname:'pandya'})
})
//this will only handle  GET call to /test
app.get('/test',(req,res) => {
  res.send('tested data here there!');
})


app.post('/hello', async (req,res) => {
  console.log(req.body,'req body');
  //saving data to DB
  res.send("data posted succesfully!");
})

app.delete('/remove',(req,res) => {
  res.send("deleted data succesfully!");
})

//this will match all the HTTP method API calls to /test
app.use('/test',(req,res) => {
  res.send("data get from the Test!");
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
