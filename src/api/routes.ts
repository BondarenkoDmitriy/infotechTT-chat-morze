import { Router } from 'express';
import { sendMessage, sendMorseMessage } from './postControllers';
import { getAuthorizedUsers, getUserRole } from './getController';

export const router = Router();

// Маршрут для звичайного текстового повідомлення
router.post('/sendMessage', sendMessage);

// Маршрут для повідомлення абеткою Морзе
router.post('/sendMorseMessage', sendMorseMessage);

// Маршрут для отримання списку авторизованих користувачів
router.get('/users', getAuthorizedUsers);

// Маршрут для отримання інформації про роль користувача
router.get('/users/:username', getUserRole);
