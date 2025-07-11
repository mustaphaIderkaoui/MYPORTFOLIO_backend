
import { configDotenv } from "dotenv"
configDotenv();

const list = new Map();
const MYUSERNAME = process.env.MYUSERNAME;
let UNREADMESSAGESDORMUS = [];
export const SocketEvents = io => {

    io.on("connection", socket => {
        console.log("User connected =>", socket.id);
        const { userName } = socket.handshake.auth;
        list.set(userName, socket.id)

        if (userName == MYUSERNAME) {

            // for (const [userId, id] of list.entries()) {
            socket.broadcast.emit("MustaphaConnected", { message: `Hello` });
            // }
            setTimeout(() => {

                UNREADMESSAGESDORMUS.map(m => {
                    console.log("Musta connected ", list.get(MYUSERNAME));
                    io.to(list.get(MYUSERNAME)).emit("MessageToMutapha", m);
                })
                UNREADMESSAGESDORMUS = []
            }, 1000)
            // Some logic here 
        }


        socket.on("MessageToMutapha", m => {
            console.log("MessageToMutapha");

            if (list.get(MYUSERNAME)) {
                socket.to(list.get(MYUSERNAME)).emit("MessageToMutapha", m)
            }
            else {
                console.log("Pushed to list ");

                UNREADMESSAGESDORMUS.push(m);
            }

        });

        socket.on("MessageFROMMutapha", m => {
            if (list.get(m.to)) {
                socket.to(list.get(m.to)).emit("MessageFROMMutapha", m)
            }
        });
        socket.on("disconnect", () => {
            list.delete(userName);
            if (userName == MYUSERNAME) {
                io.emit("MustaphaDisonnected", null)
            }
            console.log("Userd disconnecdted ");

        })

    });

}