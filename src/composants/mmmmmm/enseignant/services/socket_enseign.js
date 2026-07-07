import { io } from "socket.io-client";

// Connexion au serveur Socket.IO
const socket = io("http://localhost:3000", {
    autoConnect :false,
});

export default socket;

