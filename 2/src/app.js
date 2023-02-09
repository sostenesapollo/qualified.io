const express = require("express");
const app = express();
const {
  containsNumbers,
  containsUppercase,
  containsSpecial,
  inputValidation,
  isVowel,
  getSecretWords
} = require("./utils")

app.use(express.json());

app.post("/secret-words", (request, response) => {
  const {wordsBox} = request.body
  inputValidation(response, wordsBox)

  if(wordsBox.length === 0) {
    return response.status(404).json("wordsBox is mandatory, it should have at least 4 words of 4 letters each");
  } 
  
  const secretWords = getSecretWords(wordsBox)
  
  response.status(secretWords.length === 0 ? 404 : 200).json({
    count: secretWords.length,
    secretWords
  })
});

module.exports = app; 
