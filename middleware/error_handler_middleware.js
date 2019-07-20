module.exports = function(err, req, res, next) {
  if (err && err.name === "HTTPError") {
      return res.status(err.statusCode).json(err.message);
  }

  return next(err);
}