// src/server.ts
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { User } from './types/user';
import { handleAuthorization, handleMessage, handleMorseMessage } from './chat/messageUtils';

const app = express();
const server = http.createServer(app);
const io = new Server(server); // Створюємо екземпляр Server, передаючи HTTP сервер

const authorizedUsers: { [username: string]: User } = {};

// Обробка WebSocket з'єднань
io.on('connection', (socket: Socket) => {
  console.log('Підключення нового користувача');

  // Обробка події 'authorize', яка буде викликана, коли клієнт надішле запит на авторизацію
  socket.on('authorize', (username: string) => {
    if (!authorizedUsers[username]) {
      // Якщо ім'я користувача не існує у структурі даних, додаємо його за участю "user"
      authorizedUsers[username] = { role: 'user' };
      console.log(`Користувач "${username}" успішно авторизован.`);
    }

    // Надсилаємо клієнту підтвердження авторизації та його роль
    socket.emit('authorized', { username, role: authorizedUsers[username].role });
  });

  socket.on('message', (data: string) => {
    // Викликаємо функцію для обробки текстових повідомлень
    handleMessage(socket, data);
  });

  // Обробка події 'morseMessage', яка буде викликана, коли клієнт надішле повідомлення в азбуці Морзе
  socket.on('morseMessage', (morseCode: string) => {
    // Викликаємо функцію для обробки повідомлень в азбуці Морзе
    handleMorseMessage(socket, morseCode);
  });

  // Обробка події 'morseMessage', яка буде викликана, коли клієнт надішле повідомлення в азбуці Морзе
  socket.on('morseMessage', (morseCode: string) => {
    const { username } = socket.data;
    if (!authorizedUsers[username]) {
      console.log(`Користувач "${username}" не авторизований.`);
      return;
    }

    console.log(`Отримано повідомлення в азбуці Морзе від користувача "${username}":`, morseCode);

    // Надсилаємо отримане повідомлення всім клієнтам (broadcast)
    socket.broadcast.emit('message', { username, message: handleMorseMessage(socket, morseCode) });
  });

  // Обробка події 'disconnect', що виникає при відключенні клієнта
  socket.on('disconnect', () => {
    console.log('Користувача відключено');
  });
});

// Запускаємо сервер на порту 5000: http://localhost:5000
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Сервер стартонув з порту ${PORT}`);
});
