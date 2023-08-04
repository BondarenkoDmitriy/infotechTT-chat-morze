import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { User } from './types/user';
import { handleMessage } from './helper/messageUtils';
import { router } from './api/routes';
import path from 'path';
import { UserRole } from './types/role';
import { morseToText } from './helper/morseUtils';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
}); // Створюємо екземпляр Server, передаючи HTTP сервер

export let authorizedUsers: User[] = [];

let usersWithSocket: { user: User; socketId: string }[] = [];

// Обробка WebSocket з'єднань
io.on('connection', (socket: Socket) => {
  console.log('Connection new user');

  // Обробка події 'authorize', яка буде викликана, коли клієнт надішле запит на авторизацію
  socket.on('authorize', (data: { username: string; role: UserRole }) => {
    console.log('start');
    const { username, role } = data;
    let autorizedUser = { username, role };
    //add user to usersWithSocket
    usersWithSocket.push({ user: autorizedUser, socketId: socket.id });

    // Надсилаємо клієнту підтвердження авторизації та його роль
    socket.emit('authorized', autorizedUser);
  });

  socket.on('getAllUsers', () => {
    console.log('Отримати список усіх користувачів');
      console.log('authorizedUsers', authorizedUsers);
      socket.emit('allUsers', usersWithSocket);
  });

  socket.on('chat message', (message) => {
    console.log('Получено сообщение:', message);
    io.emit('chat message', message); // Отправка сообщения всем подключенным клиентам
  });

  socket.on('message', (data: string) => {
    // Викликаємо функцію для обробки текстових повідомлень
    handleMessage(socket, data);
  });

  // Обробка події 'morseMessage', яка буде викликана, коли клієнт надішле повідомлення в азбуці Морзе
  socket.on('decoderMorseMessage', (data: {from: string, text: string, messageId: string}) => {
    let fromSocketId = usersWithSocket.find((user) => user.user.username == data.from)?.socketId;

    console.log(`Отримано повідомлення в азбуці Морзе від користувача:`, data, fromSocketId);

    // Надсилаємо отримане повідомлення всім клієнтам (broadcast)
    if (fromSocketId) {
      io.to(fromSocketId).emit('updateMessage', { messageId: data.messageId, text: morseToText(data.text) });
    }
  });

  socket.on('privateMessage', (data: { toUser: string; fromUser: string, text: string }) => {
    console.log('Получено приватное сообщение:', data);
    //search user in usersWithSocket
    console.log('usersWithSocket', usersWithSocket);
    // find socket by username
    let socketId = usersWithSocket.find((user) => user.user.username == data.toUser)?.socketId;
    let fromSocketId = usersWithSocket.find((user) => user.user.username == data.fromUser)?.socketId;
    console.log('socketId', socketId);
    if (socketId && fromSocketId) {
      io.to([socketId, fromSocketId]).emit('privateMessage', {
        toUser: data.toUser,
        fromUser: data.fromUser,
        message: data.text,
      });
    }
    else {
      //send message to user
      socket.emit('onUserNotFound', {from: data.fromUser, message: 'Пользователь не найден' });
    }
  });

  // Обробка події 'disconnect', що виникає при відключенні клієнта
  socket.on('disconnect', () => {
    console.log('Користувача відключено');
    usersWithSocket = usersWithSocket.filter((item) => item.socketId !== socket.id);

  });

  // Включаємо наші API маршрути
  app.use('/api', router);

  const publicPath = path.join(__dirname, '../FrontEnd/build');
  app.use(express.static(publicPath));

  // Розміщуємо сокет в об'єкті app, щоб його можна було використовувати у наших контролерах
  app.set('socket', socket);
});

// Запускаємо сервер на порту 5000: http://localhost:5000
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Сервер стартонув з порту ${PORT}`);
});