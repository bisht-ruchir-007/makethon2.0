require("dotenv").config();

const express = require("express");
const app = express();
const passport = require("./passport");
const session = require("express-session");
//const knex = require("./knex/knex.js");
const nodemailer = require("nodemailer");
const path = require("path");

const { db, Sequelize, Users, pharmacists } = require("./db");

app.set("view engine", "hbs");

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);
app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  next();
});

app.use(
  session({
    secret: "averylongstring",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000
    }
  })
);

app.use(passport.initialize());

app.use(passport.session());

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/adminlogin", (req, res) => {
  res.render("adminlogin");
});

app.get("/dashboard", (req, res) => {
  Users.findOne({
    where: {
      username: req.user.username
    }
  }).then(el => {
    res.render("dashboard", { el });
  });
});

app.post("/dashboard", (req, res) => {
  const name = req.body.name;
  const quantity = req.body.quantity;
  let transport = new nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    }
  });

  let ma = req.user.email;
  console.log(ma);

  //console.log(ans);

  let mail = {
    from: '"TeamMAIT" <gauravcherwal21@gmail.com>',
    to: ma,
    subject: "Confirmation of your order",
    text: `Your order is placed.
Your order is ${name} with quantity of ${quantity}`
  };

  transport.sendMail(mail, (err, data) => {
    if (err) console.log("error", err);
    else console.log("email sent");
  });

  res.send("placed");
});

app.get("/signup", (req, res) => {
  res.render("signup");
  //console.log(typeof Users);
});

app.post("/signup", (req, res) => {
  const newuser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.pass
  };

  Users.create(newuser)
    .then(el => {
      res.redirect("/login");
    })
    .catch(err => console.log(err));
  // .then(() => console.log('schema created'))
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true
  })
);
app.use(express.static(path.join(__dirname, "/public/styles")));

db.sync().then(() => {
  app.listen(5000, () => {
    console.log("listening to port 5000");
  });
});
