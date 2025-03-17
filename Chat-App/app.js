const express = require("express")
const ws = require("ws")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3000
var clientsOnline = 0

app.use(express.static("public"))

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"))
})

const server = app.listen(PORT)
const webSocketServer = new ws.Server({ server })

webSocketServer.on("connection", function (socket) {
  clientsOnline += 1
  // console.log(`online: ${clientsOnline}`)
  broadcastClientsOnline()

  socket.on("message", function (data) {

  })

  socket.on("close", function () {
    clientsOnline -= 1
    // console.log(`online: ${clientsOnline}`)
    broadcastClientsOnline()
  })
})


function broadcastClientsOnline() {
  webSocketServer.clients.forEach(function (client) {
    if (client.readyState === ws.OPEN) {
      client.send(clientsOnline)
    }
  })
}