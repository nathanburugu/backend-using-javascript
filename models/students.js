/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const studentSchema = new Schema({
  firstname: {
    type: String,
    required: [true, "First Nmae is Required"],
  },
  lastname: {
    type: String,
    required: [true, "Last Name is Required"],
  },
  gender: {
    type: String,
  },
});
const studentz = mongoose.model("student", studentSchema);
module.exports = studentz;
