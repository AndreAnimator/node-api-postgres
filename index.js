import express from 'express'
import cors from 'cors'
import * as db from './querie.js'
import bcrypt from "bcrypt";
import passport from "passport";
import flash from "express-flash";
import session from "express-session";
const app = express()
const port = 3000

import * as initializePassport from "./passportConfig.js";

initializePassport.initialize(passport);

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(cors())
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get("/login", checkAuthenticated, (req, res) => {
  // flash sets a messages variable. passport sets the error message
  console.log(req.session.flash.error);
  // res.render("login.ejs");
});
app.post("/signup", db.signup);
app.get('/users', db.getUsers)
// app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)
app.post('/login', checkAuthenticated, passport.authenticate("local", {
    successRedirect: "/users",
    failureRedirect: "/login",
    failureFlash: true
  })
)

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res;
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return null;
}

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})