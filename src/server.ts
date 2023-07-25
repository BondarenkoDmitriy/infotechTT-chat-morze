// src/server.ts
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server); // Створюємо екземпляр Server, передаючи HTTP сервер

// Обробка WebSocket з'єднань
io.on('connection', (socket: Socket) => {
  console.log('Новый клиент подключился');

  // Обробка події 'message', яка буде викликана, коли клієнт надішле повідомлення
  socket.on('message', (data: string) => {
    console.log('Получено сообщение от клиента:', data);

    // Надсилаємо отримане повідомлення всім клієнтам (broadcast)
    socket.broadcast.emit('message', data);
  });

  // Обробка події 'disconnect', що виникає при відключенні клієнта
  socket.on('disconnect', () => {
    console.log('Клиент отключился');
  });
});

// Запускаємо сервер на порту 5000: http://localhost:5000
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
