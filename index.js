const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const users = {};

io.on("connection", (socket) => {
    socket.on("chat message", (msg) => {
        const data = {
            message: msg,
            username: users[socket.id]
        }
        io.emit("chat message", data);
    });

    socket.on("new-user-joined", (name) => {
        users[socket.id] = name;
        const data = {
            message: "join the chat",
            username: name,
        };
        io.emit("user-join", data);
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});