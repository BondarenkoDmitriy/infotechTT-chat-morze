import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { User } from './types/user';
import { handleMessage } from './helper/messageUtils';
import { router } from './api/routes';
import path from 'path';
import { UserRole } from './types/role';
import { getUserByName, isAuthorizedUser } from './helper/variables';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
}); // Створюємо екземпляр Server, передаючи HTTP сервер

export let authorizedUsers: User[] | any = [];
const uniqueUser = new Map();

// Обробка WebSocket з'єднань
io.on('connection', (socket: Socket) => {
  console.log('Підключення нового користувача');

  // Обробка події 'authorize', яка буде викликана, коли клієнт надішле запит на авторизацію
  socket.on('authorized', (data: { username: string; role: UserRole }) => {
    console.log('start');
    const { username, role } = data;
    let autorizedUser = { username, role };
    authorizedUsers.push({user: autorizedUser, socket: socket});
    uniqueUser.set(username, socket);

    console.log(authorizedUsers);

    if (isAuthorizedUser(autorizedUser.username, authorizedUsers)) {
      // Якщо ім'я користувача не існує у структурі даних, додаємо його з вказаною роллю
      console.log(`Користувач "${autorizedUser.username}" успішно авторизован з роллю "${autorizedUser.role}".`);
    }

    // Надсилаємо клієнту підтвердження авторизації та його роль
    socket.emit('authorized', autorizedUser);
  });

  socket.on('privateMessage', (data: { toUsername: string, message: string, from: string }) => {
    // const recipientUser = uniqueUser.get(data.toUsername);
    console.log('data', data);
    const recipientUser = authorizedUsers.find((item: any) => item.user.username == data.toUsername)

    console.log('user', recipientUser.user);

    if (recipientUser) {
      try {
        console.log('++++++++++++++++');
        recipientUser.socket.emit('message123', {from: data.from, text: data.message});
      } catch (error) {
        console.log('error', error);
      }
      
    } else {
      socket.emit('recipientNotConnected', 'Not found this user')
    }
  });

  socket.on('chat message', (message) => {
    console.log('start message');
    console.log('Получено сообщение:', message);
    io.emit('chat message', message); // Отправка сообщения всем подключенным клиентам
  });

  socket.on('message', (data: string) => {
    // Викликаємо функцію для обробки текстових повідомлень
    handleMessage(socket, data);
  });

  // Обробка події 'morseMessage', яка буде викликана, коли клієнт надішле повідомлення в азбуці Морзе
  socket.on('morseMessage', (morseCode: string) => {
    const { username, message } = socket.data;

    console.log(`Отримано повідомлення в азбуці Морзе від користувача "${username}":`, morseCode);

    // Надсилаємо отримане повідомлення всім клієнтам (broadcast)
    socket.broadcast.emit('message', { username, message });
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