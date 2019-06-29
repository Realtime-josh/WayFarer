'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('GET /', function () {
  it('should respond with welcome message', function (done) {
    (0, _supertest2.default)(_app2.default).get('/').set('Accept', 'application/json').expect(200).then(function (response) {
      (0, _expect2.default)(response.body.message).toContain('Welcome');
    });
    done();
  });
});

describe('*', function () {
  it('should respond with error message', function (done) {
    (0, _supertest2.default)(_app2.default).get('/noroute').set('Accept', 'application/json').expect(404).then(function (response) {
      (0, _expect2.default)(response.body.error).toContain('Invalid');
    });
    done();
  });
});
//# sourceMappingURL=app.test.js.map