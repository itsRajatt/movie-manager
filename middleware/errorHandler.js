const fs = require("fs");
const path = require("path");

const logError = (error) => {
  const logPath = path.join(__dirname, "../logs/error.log");
  const logMessage = `${new Date().toISOString()} - ${error}\n`;
  fs.appendFileSync(logPath, logMessage);
};

const errorHandler = (err, req, res, next) => {
  logError(err.message);
  res.status(500).json({ message: "Internal Server Error" });
};

module.exports = errorHandler;
