import { io } from "socket.io-client";

// const socket = io(import.meta.env.VITE_CONNECT_BE, {
//   autoConnect: false,
//   withCredentials: true, // khớp với credentials: true bên BE
// });
const socket = io("http://localhost:3000", {
  autoConnect: false,
  withCredentials: true, // khớp với credentials: true bên BE
});

export default socket;