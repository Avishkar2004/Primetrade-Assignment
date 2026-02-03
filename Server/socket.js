/**
 * Socket.io configuration (optional).
 * Attach to HTTP server when real-time features are needed.
 */
// import { Server } from 'socket.io';
// export function initSocket(httpServer) {
//   const io = new Server(httpServer, { cors: { origin: process.env.CLIENT_ORIGIN } });
//   io.on('connection', (socket) => { /* ... */ });
//   return io;
// }
export function initSocket() {
  return null;
}
