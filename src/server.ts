import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { User } from './types/user';
import { handleAuthorization, handleMessage, handleMorseMessage } from './chat/messageUtils';
import { router } from './api/routes';
import path from 'path';
import { UserRole } from './types/role';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
}); // Створюємо екземпляр Server, передаючи HTTP сервер

const authorizedUsers: User[] = [];

// Обробка WebSocket з'єднань
io.on('connection', (socket: Socket) => {
  console.log('Підключення нового користувача');

  // Обробка події 'authorize', яка буде викликана, коли клієнт надішле запит на авторизацію
  socket.on('authorize', (data: { username: string; role: UserRole }) => {
    const { username, role } = data;
    const isAuthorizedUser = authorizedUsers.some(user => user.username !== username)
    let newUser: User = {
      username: '',
      role: UserRole.User
    };

    if (isAuthorizedUser) {
       newUser = { username, role };
      // Якщо ім'я користувача не існує у структурі даних, додаємо його з вказаною роллю
      authorizedUsers.push(newUser);
      console.log(`Користувач "${newUser.username}" успішно авторизован з роллю "${newUser.role}".`);
    }

    // Надсилаємо клієнту підтвердження авторизації та його роль
    socket.emit('authorized', newUser);
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
  socket.on('morseMessage', (morseCode: string) => {
    const { username } = socket.data;
    const isAuthorizedUser = authorizedUsers.every(user => user.username !== username)
    if (isAuthorizedUser) {
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

  // Включаємо наші API маршрути
  app.use('/api', router);

  const publicPath = path.join(__dirname, '../FrontEnd/build');
  app.use(express.static(publicPath));

  // app.use(express.static('public'));

  // Розміщуємо сокет в об'єкті app, щоб його можна було використовувати у наших контролерах
  app.set('socket', socket);
});

// Запускаємо сервер на порту 5000: http://localhost:5000
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Сервер стартонув з порту ${PORT}`);
});