function containsNumbers(str) {
    return /\d/.test(str);
  }
  
  function containsUppercase(str) {
    return /[A-Z]/.test(str);
  }
  
  function containsSpecial(str) {
   return /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
  }
  
  function inputValidation(response, wordsBox) {
      if(!wordsBox) {
      return response.status(400).json("wordsBox is mandatory, it should have at least 4 words of 4 letters each"); 
    }
    if(containsNumbers(wordsBox)) {
      return response.status(400).json("Only lower case letters are allowed");
    }
    if(containsUppercase(wordsBox)) {
      return response.status(400).json("Only lower case letters are allowed");
    }
    if(wordsBox.some(e=>e.length < 4)) {
      return response.status(400).json("Each word should have at least 4 letters");
    }
    if(wordsBox.some(e=>containsSpecial(e))) {
        return response.status(400).json("Only lower case letters are allowed");
    }
    
    if(wordsBox.length !== wordsBox[0].length) {
      return response.status(400).json("The box must have the same number of rows and columns");
    }
    
    if(!wordsBox.every(e=>e.length === wordsBox[0].length)) {
      return response.status(400).json("All words should have the same length");
    }
   
  }
  
  function isVowel(letter) {
    return ['a', 'e', 'i', 'o', 'u'].includes(letter)
  }
  
  // TODO: This solution probably would fail for 8x8 wordBoxes, so It would be better 
  // to think in something else using slice...
  function getSecretWords(wordsBox) {
    const secretWords = []
    for(const word of wordsBox) {
       if(
         isVowel(word[word.length-4]) && isVowel(word[word.length-3]) && !isVowel(word[word.length-2]) && !isVowel(word[word.length-1])
       ) {
         secretWords.push(`${word[word.length-4]}${word[word.length-3]}${word[word.length-2]}${word[word.length-1]}`)
       } else if(
         isVowel(word[0]) && isVowel(word[1]) && !isVowel(word[word.length-2]) && !isVowel(word[word.length-1])
       ) {
         secretWords.push(`${word[0]}${word[1]}${word[word.length-2]}${word[word.length-1]}`)
       } else if(
         isVowel(word[0]) && isVowel(word[1]) && !isVowel(word[2]) && !isVowel(word[3])
       ) {
         secretWords.push(`${word[0]}${word[1]}${word[2]}${word[3]}`)
       }
    }
    return secretWords
  }
  
  module.exports = {
    containsNumbers,
    containsUppercase,
    containsSpecial,
    inputValidation,
    isVowel,
    getSecretWords
  }