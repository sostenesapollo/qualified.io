// Uncomment the following to see STDERR of the server
// process.env.NODE_ENV = "dev";

const request = require("supertest");
const app = require("../src/app");

describe("Secret Words", () => {
  async function sendRegularRequest(requestBody) {
    const req = "/secret-words";
    const res = await request(app)
                          .post(req)
                          .send(requestBody)
                          .set('Accept', 'application/json');
    return res;
  }
  
  function runExpectValidations(res, statusCode, expectedBody) {
    try {
        expect(res.status).toEqual(statusCode);
        expect(res.body).toEqual(expectedBody)
        expect(res).toBe.json;
      }
    catch (err) { 
      throw err; 
    }
  }
  describe("Input validation", () => {
      it("should return error 400 given the request body doesn't have wordsBox attribute ", async () => {
      const expectedBody = "wordsBox is mandatory, it should have at least 4 words of 4 letters each";
      const res = await sendRegularRequest({});
      
      runExpectValidations(res, 400, expectedBody);
    });

    it("should return error 400 given wordsBox contains special characters ", async () => {
      const requestBody = {
        wordsBox: [
          "$bcd", "adbd", "aabc", "aaac"
        ]
      }
      const expectedBody = "Only lower case letters are allowed";
      const res = await sendRegularRequest(requestBody);
      runExpectValidations(res, 400, expectedBody);
    });

    it("should return error 400 given wordsBox contains uppercase characters ", async () => {
      const requestBody = {
        wordsBox: [
          "Abcd", "adbd", "aabc", "aaac"
        ]
      }
      const expectedBody = "Only lower case letters are allowed";
      const res = await sendRegularRequest(requestBody);
      runExpectValidations(res, 400, expectedBody);
    });

    it("should return error 400 given wordsBox contains numbers", async () => {
      const requestBody = {
        wordsBox: [
          "1bcd", "adbd", "aabc", "aaac"
        ]
      }
      const expectedBody = "Only lower case letters are allowed";
      const res = await sendRegularRequest(requestBody);
      runExpectValidations(res, 400, expectedBody);
    });

    it("should return error 400 given an element inside wordsBox contains length less than 4", async () => {
      const requestBody = {
        wordsBox: [
          "bcd", "adbd", "aabc", "aaac"
        ]
      }
      const expectedBody = "Each word should have at least 4 letters";
      const res = await sendRegularRequest(requestBody);
      runExpectValidations(res, 400, expectedBody);
    });
    
    it("should return error 400 given a wordsBox that its row's number and column's number are different", async () => {
      const requestBody = {
        wordsBox: [
          "aadc", "adbd", "aabc", "aaac", "aabc"
        ]
      }
      const expectedBody = "The box must have the same number of rows and columns";
      const res = await sendRegularRequest(requestBody);
      runExpectValidations(res, 400, expectedBody);
    });

    it("should return error 400 given an element inside wordsBox contains different length from the others", async () => {
      const requestBody = {
        wordsBox: [
          "bcda", "adbdb", "aabc", "aaac"
        ]
      }
      const expectedBody = "All words should have the same length";
      const res = await sendRegularRequest(requestBody);
      runExpectValidations(res, 400, expectedBody);
    });
  });
  
  describe("Word search rules work correctly", () => {
    it("should return code 200 and count 1 given an secretBox with one secret word", async () => {
      const expectedObject = {
        count: 1,
        secretWords: ["aabc"]
      }
      const requestBody = {
        wordsBox: [
          "bcda", "adbd", "aabc", "aaac"
        ]
      }
      const res = await sendRegularRequest(requestBody);
      runExpectValidations(res, 200, expectedObject);
    });
    
    it("should return code 200 and count 2 given an secretBox with two secret words", async () => {
      const expectedObject = {
        count: 2,
        secretWords: ["eebd", "aabc"]
      }
      const requestBody = {
        wordsBox: [
          "bcda", "eebd", "aabc", "aaac"
        ]
      }
      const res = await sendRegularRequest(requestBody);
      runExpectValidations(res, 200, expectedObject);
    });
    
    it("should return code 200 and count 3 given an secretBox with three secret words", async () => {
      const expectedObject = {
        count: 3,
        secretWords: ["eebd", "aabc", "iilx"]
      }
      const requestBody = {
        wordsBox: [
          "bcda", "eebd", "aabc", "iilx"
        ]
      }
      const res = await sendRegularRequest(requestBody);
      runExpectValidations(res, 200, expectedObject);
    });
    
    it("should return code 404 and count 0 given an secretBox with zero secret words", async () => {
      const expectedObject = {
        count: 0,
        secretWords: []
      }
      const requestBody = {
        wordsBox: [
          "bcda", "abcb", "abca", "aaba"
        ]
      }
      const res = await sendRegularRequest(requestBody);
      runExpectValidations(res, 404, expectedObject);
    });
    
    it("should return code 404 and count 0 given an secretBox with word the begins in one row but ends in the next one", async () => {
      const expectedObject = {
        count: 0,
        secretWords: []
      }
      const requestBody = {
        wordsBox: [
          "bcda", "abaa", "bcca", "aaba"
        ]
      }
      const res = await sendRegularRequest(requestBody);
      runExpectValidations(res, 404, expectedObject);
    });
  });
  
  describe("Works with a bigger wordsBox", () => {
      it("should return code 200 and count 3 given an 6x6 secretBox with three secret words", async () => {
        const expectedObject = {
          count: 3,
          secretWords: ['aabc', 'aabc', 'aaxl']
        }
        const requestBody = {
          wordsBox: [
            "bcdaaa", "auaabc", "aabcca", "aaxlaa", "opolpp", "sskkzl",
          ]
        }
        const res = await sendRegularRequest(requestBody);
        runExpectValidations(res, 200, expectedObject);
      });
    
      it("should return code 404 and count 0 given an 6x6 secretBox with zero secret words", async () => {
        const expectedObject = {
          count: 0,
          secretWords: []
        }
        const requestBody = {
          wordsBox: [
            "bcdaaa", "abalbc", "axbcca", "zaxlaa", "opolpp", "sskkzl",
          ]
        }
        const res = await sendRegularRequest(requestBody);
        runExpectValidations(res, 404, expectedObject);
      });
  });
});