const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config({ path: "./config/.env" })
const cookieParser = require("cookie-parser")
const crypto = require("crypto")

const Question = require("./models/Question")
const TotalPolls = require("./models/TotalPolls")


const app = express()
const PORT = process.env.PORT || 3000
const KEY = crypto.randomBytes(32)
const IV = crypto.randomBytes(16)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.set("view engine", "pug")

    app.use(express.urlencoded({ extended: true }))

    app.use(express.static("public"))

    app.use(cookieParser())

    app.get("/", async (req, res) => {
      if (req.cookies.sid && req.cookies.sid.length == 32) {
        const decipher = crypto.createDecipheriv(process.env.ALGO, KEY, IV)
        const dec = decipher.update(req.cookies.sid, "hex", "utf8") + decipher.final("utf8")

        if (dec == process.env.DATA)
          return res.redirect("/results")
      }

      try {
        const questions = await Question.find()
        const data = { questions }
        res.render("index", data)
      } catch (err) {
        console.log(err)
      }
    })

    app.post("/submit-survey", async (req, res) => {
      const arrayOfQuestions = Object.keys(req.body)
      const arrayOfAnswers = Object.values(req.body)
      const numOfQuestions = await Question.find().countDocuments()

      if (
        arrayOfQuestions.length != numOfQuestions &&
        arrayOfAnswers.length != numOfQuestions
      ) {
        const questions = await Question.find()
        const data = { msg: "Retake Survey", questions }
        return res.render("index", data)
      }

      for (var question in req.body) {
        const filter = { question, "options.text": req.body[question] }
        const update = { $inc: { "options.$.poll": 1 } }
        await Question.updateOne(filter, update)
      }

      await TotalPolls.updateOne({}, { $inc: { totalPoll: 1 } })

      const cipher = crypto.createCipheriv(process.env.ALGO, KEY, IV)
      const enc = cipher.update(process.env.DATA, "utf8", "hex") + cipher.final("hex")

      res.cookie("sid", enc, { maxAge: 1000 * 60 * 60 * 24 * 365 })
      res.redirect("/results")
    })

    app.get("/results", async (req, res) => {
      if (req.cookies.sid && req.cookies.sid.length == 32) {
        const decipher = crypto.createDecipheriv(process.env.ALGO, KEY, IV)
        const dec = decipher.update(req.cookies.sid, "hex", "utf8") + decipher.final("utf8")

        if (dec == process.env.DATA) {
          const questions = await Question.find()
          const data = { questions }
          res.render("result", data)
        }
      } else {
        res.redirect("/")
      }
    })

    app.get("/api/totalpoll", async (req, res) => {
      const totalPoll = await TotalPolls.find()
      res.send(totalPoll[0].totalPoll.toString())
    })

    app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
  })
  .catch(err => console.log(err))
