/** @format */

const express = require("express");
const routes = require("./routes/API");

const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
app.use(bodyParser.json());
app.use(routes);
app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
});
mongoose.connect("mongodb://localhost/studentdb"); // will connect to mongoDb and will create this particular db the studentdb
app.listen(process.env.port || 4000, function () {
  console.log("Now LIstening fro requests on : http://localhost:4000");
});
