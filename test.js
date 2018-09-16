var assert = require('assert'), request = require('request'), miListTestFile = require("./mi-list.test.json"), unirest = require('unirest');

describe('/list Ressource', function() {
  describe('...POST /list', function() {
    
	it('send testfile (mi-list.test.json)?', function() {
      unirest.post('http://localhost:3000/list')
		.headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
		.send(miListTestFile)
		.end(function (response) {
			assert.equal(200, response.status);
		});
    });
	
  });
  describe('...GET /list', function() {
    
	it('got same testfile back?', function() {
      unirest.get('http://localhost:3000/list')
		.end(function (response) {
			assert.equal(200, response.status);
			assert.equal(response.body, miListTestFile);
		});
    });
	
  });
});
