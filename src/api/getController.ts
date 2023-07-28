import { Request, Response } from 'express';
import { User } from '../types/user';
import { getUserByName } from '../helper/variables';

// Обробник для отримання списку авторизованих користувачів
export function getAuthorizedUsers(req: Request, res: Response) {
  const authorizedUsers: User[] = req.app.get('authorizedUsers');

  res.status(200).json({ success: true, users: authorizedUsers });
}

// Обробник для отримання інформації про роль користувача на ім'я
export function getUserRole(req: Request, res: Response) {
  const { username } = req.params;
  const authorizedUsers: User[] = req.app.get('authorizedUsers');

  if (getUserByName(username, authorizedUsers)) {
    const userRole = getUserByName(username, authorizedUsers)?.role;

    res.status(200).json({ success: true, role: userRole });
  } else {
    res.status(404).json({ success: false, message: 'Користувача не знайдено' });
  }
}
