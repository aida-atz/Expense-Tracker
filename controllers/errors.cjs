function notFound(req, res, next) {
  res.status(404).json({ message: "Route not found." });
}
function errorHandler(err, req, res, next) {
  console.log(err);
  if (err.code === "P2003") {
    res.status(400).json({
      success: false,
      message: "Invalid Related Record",
    });
    return;
  }
  if (err.code == "P2025") {
    res.status(400).json({
      success: false,
      message: "Resource not found",
    });
    return;
  }
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internet Server Error" : err.message,
  });
}
module.exports = { notFound, errorHandler };
