import { Server } from "socket.io"
import Http from "http";
import { configDotenv } from "dotenv"
import express from 'express';
import { SocketEvents } from "./socket.js";
const app = express();

configDotenv();

const server = new Http.createServer(app);
const { FRONT_URL } = process.env;




const io = new Server(server, {
    cors: [FRONT_URL, "https://localhost:3000"]
});


SocketEvents(io)

server.listen(8000, () => {
    console.log("Server listing");
})

