"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var sendResponse = function sendResponse(res, status, data, error) {
  res.status(status).send({
    status: status,
    data: data || undefined,
    error: error || undefined
  });
};

exports.default = sendResponse;
//# sourceMappingURL=response.js.map