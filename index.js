import express from 'express'
import cors from 'cors'
import * as db from './querie.js'
import bcrypt from "bcrypt";
import passport from "passport";
import flash from "express-flash";
import session from "express-session";
import pl from "passport-local"
const LocalStrategy = pl.Strategy;
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
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // TTL for the session
    },
  })
);
app.use(cors())
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get("/login", checkAuthenticated, (req, res) => {
  // flash sets a messages variable. passport sets the error message
  // console.log(req.session.flash.error);
  console.log("alouu");
  console.log(req.session.passport);
  // res.render("login.ejs");
});
app.post("/signup", db.signup, (req, res) =>{
  console.log(req.session.flash.error);
});
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
// Ingredientes
app.get('/ingredientes', db.getIngredientes)
app.get('/ingredientes/:id', db.getIngredienteById)
app.get('/ingrediente/:type', db.getIngredienteByType)
app.post('/ingredientes', db.createIngrediente)
app.put('/ingredientes/:id', db.updateIngrediente)
app.delete('/ingredientes/:id', db.deleteIngrediente)

//lanches
app.get('/lanches', db.getLanches)
app.get('/lanches/:id', db.getLancheById)
app.post('/lanches', db.createLanche)
app.post('/lanches/ingredientes', db.createILRelationship)
app.put('/lanches/:id', db.updateLanche)
app.delete('/lanches/:id', db.deleteLanche)

//hamburger
app.get('/hamburgers/:id', db.getHamburgerIngredients)
app.post('/hamburgers', db.createHamburger)
app.put('/hamburgers/:id', db.updateHamburger)
app.delete('/hamburgers/:id', db.deleteHamburger)

//hamburger favoritos

app.get('/hamburgers-favorito/:id', db.getHamburgerIngredients)
app.put('/hamburgers-favorito/:id', db.updateHamburgerFavoritoByUser)

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("loga");
    return res.json({user: req.user});
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