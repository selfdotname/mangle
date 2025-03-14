const express = require("express")
const session = require("express-session")
require("dotenv").config({ path: "config/.env" })
const mongoose = require("mongoose")
const Account = require("./models/Account.js")

const app = express()
const PORT = process.env.PORT || 3000

app.set("view engine", "pug")

app.use(session({
  secret: process.env.MY_SECRET,
  resave: false,
  saveUninitialized: true,
}))

app.use(express.static("public"))

app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.render("index")
})

app.get("/signup", (req, res) => {
  res.render("signup")
})

app.post("/signup", async (req, res) => {
  const isUserNameValid = /^[A-Za-z0-9]{5,10}$/.test(req.body.username)
  if (!isUserNameValid) {
    const data = { msg: "Invalid username" }
    return res.render("signup", data)
  }
  const filter = { username: req.body.username }
  const user = await Account.findOne(filter)
  if (user) {
    const data = { msg: "Account exists for user, kindly login." }
    res.render("signup", data)
  } else {
    req.session.pendingUser = req.body.username
    res.render("password")
  }
})

app.post("/password", async (req, res) => {
  const doPasswordsTally = req.body.password == req.body.confirmPassword
  const isPasswordValid = /^[a-zA-Z0-9]{5,10}$/.test(req.body.password) && /^[a-zA-Z0-9]{5,10}$/.test(req.body.confirmPassword)
  if (!doPasswordsTally) {
    const data = { msg: "Passwords don't match" }
    return res.render("password", data)
  } else if (!isPasswordValid) {
    const data = { msg: "Invalid password characters" }
    return res.render("password", data)
  } else {
    const user = { username: req.session.pendingUser, password: req.body.password }
    const username = user.username
    await Account.create(user)

    req.session.pendingUser = null

    req.session.user = username
    res.redirect("/dashboard")

  }
})

app.get("/login", (req, res) => {
  res.render("login")
})

app.post("/login", async (req, res) => {
  const filter = { username: req.body.username, password: req.body.password }
  const user = await Account.findOne(filter)
  if (user) {
    req.session.user = filter.username
    res.redirect("/dashboard")
  } else {
    const data = { msg: "Incorrect credentials / No such user" }
    res.render("login", data)
  }
})

app.get("/dashboard", (req, res) => {
  if (req.session.user) {
    const data = { user: req.session.user }
    res.render("dashboard", data)
  } else {
    res.redirect("/login")
  }
})

app.get("/logout", (req, res) => {
  req.session.destroy()
  res.redirect("/login")
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`http://localhost:${PORT}`)))
  .catch(err => console.log(`Error connecting to database`))
