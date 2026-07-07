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

var whitelist = ['http://localhost:8100', "http://localhost:8100/login"]

app.use(
  cors({
    origin: function(origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true
  })
);
/*
app.use(cors());
*/
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
// app.use(cors({credentials: true, origin: 'http://localhost:8100'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get("/", cors(), (req, res) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
  res.status(201).json(req.user)
});
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
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
)
app.post('/logout', function(req, res, next){
  res.header('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
  req.logout(function(err) {
    if (err) {
      console.log("Deu erro");
      res.status(500).send("Something went wrong.");
      return next(err); 
    }
    console.log("LOGOUT");
    res.status(201).json(req.user);
  });
});
// Ingredientes
app.get('/ingredientes', db.getIngredientes)
app.get('/ingredient/:id', db.getIngredienteById)
app.get('/ingrediente/:type', db.getIngredienteByType)
app.post('/ingredientes', db.createIngrediente)
app.put('/ingredientes/:id', db.updateIngrediente)
app.delete('/ingredientes/:id', db.deleteIngrediente)

//lanches
app.get('/lanches', db.getLanches)
app.get('/lanchesusers', db.getLanchesByUser)
app.get('/lanches/:id', db.getLancheById)
app.post('/lanches', db.createLanche, (req, res) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
})
app.post('/lanches/ingredientes', db.createILRelationship)
app.get('/lanchesingredientes/:lanche_id', db.getILByID)
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