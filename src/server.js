const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db.js");
const chatRoutes = require("./routes/chat.routes.js");
const errorMiddleware = require("./middleware/error.middleware.js");
const initSocket = require("./socket/socket.js");

const app = express();
const server = http.createServer(app);
initSocket(server);

// middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.static("public"));
app.use(morgan("dev"));

// routes
app.use("/api/chat", chatRoutes);

// health
app.get("/", (req, res) => res.send("Chat API Running"));

// error middleware
app.use(errorMiddleware);

//DB + server start
connectDB();
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
