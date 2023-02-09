const express = require("express");
const app = express();

function containsNumbers(str) {
  return /\d/.test(str);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/secret-words", (request, response) => {
  console.log('>', request.body.wordsBox, containsNumbers(request.body.wordsBox));
  return response.status(400).json("Only lower case letters are allowed");
  // return response.status(400).send('Only lower case letters are allowed');
  // if(containsNumbers(request.body.wordsBox)) {
  // }
  // response.end(201);
});

// app.listen(3009, () => {})
module.exports = app; 
