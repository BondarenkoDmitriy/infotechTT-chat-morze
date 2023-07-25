import { Server, Socket } from 'socket.io';
import { textToMorse, morseToText } from './morseUtils';
import { User } from '../types/user';

const authorizedUsers: { [username: string]: User } = {};

export function handleAuthorization(socket: Socket, username: string) {
  if (!authorizedUsers[username]) {
    // Якщо ім'я користувача не існує у структурі даних, додаємо його за участю "user"
    authorizedUsers[username] = { role: 'user' };
    console.log(`Користувач "${username}" успішно авторизован.`);
  }

  // Надсилаємо клієнту підтвердження авторизації та його роль
  socket.emit('authorized', { username, role: authorizedUsers[username].role });
}

export function handleMessage(socket: Socket, data: string) {
  const { username } = socket.data;
  const morseCode = textToMorse(data);
  console.log(`Користувач "${username}" відправив повідомлення:`, data);

  // Надсилаємо отримане повідомлення всім клієнтам (broadcast)
  socket.broadcast.emit('message', { username, message: data, morseCode });
}

export function handleMorseMessage(socket: Socket, morseCode: string) {
  const { username } = socket.data;
  const text = morseToText(morseCode);
  console.log(`Користувач "${username}" відправив повідомлення азбукою Морзе:`, morseCode);

  // Надсилаємо отримане повідомлення всім клієнтам (broadcast)
  socket.broadcast.emit('message', { username, message: text, morseCode });
}
