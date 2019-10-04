const express = require("express");
const logger = require("./logging");
const config = require("../config");

function initialize(app) {
  const router = express.Router();
  app.use("/api/v1", router);
  app.use("/api/v1/data", express.static(config.storage));
}

function start(app) {
  const port = config.port;
  app.listen(port, (error) => {
    if (error) {
      logger.error("Can't start server: ", error);
    }
    logger.info("Listening on port: ", port);
  });
}

module.exports = {
  "initialize": initialize,
  "start": start,
};
