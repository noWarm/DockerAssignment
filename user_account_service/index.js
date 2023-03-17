//	index.js
//
//  Entrypoint to the application. Opens a repository to the MySQL
//  server and starts the server.
var server = require("./server/server");
var repository = require("./repository/repository");
var config = require("./config/config");

//  Lots of verbose logging when we're starting up...
console.log("--- Customer Service---");
console.log("Connecting to customer repository...");

//  Log unhandled exceptions.
process.on("uncaughtException", function (err) {
  console.error("Unhandled Exception", err);

  if (err.toString().includes("ECONNREFUSED")) {
    console.log("RESTARTING THE CONNECTION IN 20 SECONDS");
  }
});
process.on("unhandledRejection", function (err, promise) {
  console.error("Unhandled Rejection", err);
});

console.log({
  host: config.db.host,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  port: config.db.port,
});

repository
  .connect({
    host: config.db.host,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password,
    port: config.db.port, // make sure this port is the EXPOSED port of the db container 
                          // (the one visible by other containers in the docker network 
                          // and not the port for the host system)
  })
  .then((repo) => {
    console.log("Connected. Starting server...");

    return server.start({
      port: config.port,
      repository: repo,
    });
  })
  .then((app) => {
    console.log(
      "Server started successfully, running on port " + config.port + "."
    );
    app.on("close", () => {
      repository.disconnect();
    });
  });
