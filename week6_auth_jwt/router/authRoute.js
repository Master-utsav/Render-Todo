// make signinRouter
const express = require("express");
const { handelSignup, handelLogin } = require("../controller/authController.js");

const authRoute = express.Router();

authRoute.post("/signup", handelSignup );
authRoute.post("/login" , handelLogin);


module.exports = authRoute;

