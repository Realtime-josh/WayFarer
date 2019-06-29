'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _auth = require('./routes/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var app = (0, _express2.default)();
app.use((0, _cors2.default)());
var port = process.env.PORT || 3000;

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use('/api/v1/auth', _auth2.default);
app.get('/', function (req, res) {
  res.send({ message: 'Welcome to WayFarer Transport Services' });
});
app.use('*', function (req, res) {
  res.status(404).send({ error: 'Invalid Route' });
});
app.listen(port, function () {
  console.log('Server started on port ' + port);
});

exports.default = app;
//# sourceMappingURL=app.js.map