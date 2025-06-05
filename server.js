const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const fs = require("fs");
const path = require("path");

app.use(express.static("public"));

const MESSAGES_FILE = "messages.json";
let messages = [];

if (fs.existsSync(MESSAGES_FILE)) {
  messages = JSON.parse(fs.readFileSync(MESSAGES_FILE));
}

io.on("connection", (socket) => {
  console.log("یک کاربر وصل شد");

  socket.emit("load messages", messages);

  socket.on("chat message", (msg) => {
    const message = { text: msg, time: new Date().toISOString() };
    messages.push(message);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
    io.emit("chat message", message);
  });
});

http.listen(3000, () => {
  console.log("سرور روی پورت 3000 فعال است");
});