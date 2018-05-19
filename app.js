var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var router = express.Router();
var userRoutes = require("./routes/users");
var uploadRoutes = require("./routes/upload");
var authRoutes = require("./routes/auth");
var projectRoutes = require("./routes/projects");
var fileRoutes = require("./routes/files");
var morgan = require("morgan");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/files", fileRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  res.status(404);
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

mongoose.connect(
  "mongodb://dexhonsa:Awesomeo21!@cluster0-shard-00-00-puscy.mongodb.net:27017,cluster0-shard-00-01-puscy.mongodb.net:27017,cluster0-shard-00-02-puscy.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin"
);

module.exports = app;
