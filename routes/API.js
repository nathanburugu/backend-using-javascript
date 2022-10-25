/** @format */

const express = require("express");
const routes = express.Router();
const Studentz = require("../models/students");
const userz = require("../models/user");
const createError = require("http-errors");
require("dotenv").config();
const { signAccessToken } = require("../auths/JWThelper");
const { verifyAccessToken } = require("../auths/JWThelper");
const { authSchema } = require("../auths/auth_schema");

// routes.post("/students", (req, res) => {
//   res.send({ type: "" });
// });
//get a list of students from the data base
routes.get("/students", verifyAccessToken, (req, res, next) => {
  Studentz.find({}).then((student) => {
    res.send(student);
  });
});

routes.post("/students", (req, res) => {
  Studentz.create(req.body).then((student) => {
    res.send(student);
  });
});
routes.delete("/students/:id", (req, res, next) => {
  Studentz.findByIdAndRemove({ _id: req.params.id }).then((student) => {
    res.send(student);
  });
});
routes.post("students", (req, res, next) => {
  Studentz.create(req.body)
    .then((student) => {
      res.send(student);
    })
    .catch(next);
});

//register a user
routes.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authSchema.validateAsync(req.body);

    const exists = await userz.findOne({ email: email });
    if (exists)
      throw createError.Conflict(`${email} has already been registered`);

    const user = new userz(result);
    const savedUser = await user.save();
    // res.send({ savedUser });
    const accessToken = await signAccessToken(savedUser.id);
    res.send({ accessToken });
  } catch (error) {
    next(error);
  }
});
//user login
routes.post("/login", async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const user = await userz.findOne({ email: result.email });
    if (!user) throw createError.NotFound("user not registered");

    const isMatch = await user.isValidPassword(result.password);
    if (!isMatch) throw createError.Unauthorized("user does not exist");

    const accessToken = await signAccessToken(user.id);

    res.send({ accessToken });
  } catch (error) {
    if (error.isJoi === true)
      return next(createError.BadRequest("invalid username or password"));
    next(error);
  }
});

module.exports = routes;
