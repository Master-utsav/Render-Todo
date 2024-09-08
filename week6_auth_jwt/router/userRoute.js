// make signinRouter
const express = require("express");
const { handelAddTodo , handelDeleteTodo , handelFetchTodo, handelMarkTodo, handelUpdateTodo } = require("../controller/userController.js");

const userRoute = express.Router();

userRoute.get("/" , handelFetchTodo);
userRoute.post("/add",  handelAddTodo);
userRoute.delete("/delete/:id" , handelDeleteTodo);
userRoute.patch("/update/:id" , handelMarkTodo);
userRoute.patch("/updateText/:id" , handelUpdateTodo);


module.exports = userRoute;

