const express = require('express');

const app = express();
const PORT = process.env.PORT || 65535

app.use(function (req, res) {
  res.send('Hello Obaro');
})

app.listen(PORT, function () {
  console.log("Server is live")
})