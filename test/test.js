var assert = require('assert');

var should = require('chai').should(),
expect = require('chai').expect,
api = supertest('http://localhost:5000');

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});
