
var jwt = require("jsonwebtoken");
var config = require("../config");

module.exports = function(req, res, next) {
  var token = req.headers["authorization"];
  token = token.split(" ");
  if (!token[1])
    next();
  
  jwt.verify(token[1], config.secret, function(err, decoded) {
    req.user = decoded;
    next();
  });
}