import { Request, Response } from 'express';
import { User } from '../types/user';

// Обробник для отримання списку авторизованих користувачів
export function getAuthorizedUsers(req: Request, res: Response) {
  const authorizedUsers: { [username: string]: User } = req.app.get('authorizedUsers');
  const userList = Object.keys(authorizedUsers);

  res.status(200).json({ success: true, users: userList });
}

// Обробник для отримання інформації про роль користувача на ім'я
export function getUserRole(req: Request, res: Response) {
  const { username } = req.params;
  const authorizedUsers: { [username: string]: User } = req.app.get('authorizedUsers');

  if (authorizedUsers[username]) {
    const userRole = authorizedUsers[username].role;
    res.status(200).json({ success: true, role: userRole });
  } else {
    res.status(404).json({ success: false, message: 'Користувача не знайдено' });
  }
}

// Hello
