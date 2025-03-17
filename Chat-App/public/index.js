const url = URL.parse(window.location.href)
const socket = new WebSocket(`wss://${url.host}`)

socket.onopen = function() {
  console.log("connected to server")
}

socket.onmessage = function(data) {
  const onlineCount = document.querySelector(".online-count")
  onlineCount.innerText = data.data
}

socket.onclose = function() {
  console.log("disconnected from server")
}

const button = document.querySelector("button")
button.onclick = function() {
  socket.send("Hello from client")
}
