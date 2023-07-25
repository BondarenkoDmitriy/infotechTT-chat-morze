import { Router } from 'express';
import { sendMessage, sendMorseMessage } from './controllers';

const router = Router();

// Маршрут для звичайного текстового повідомлення
router.post('/sendMessage', sendMessage);

// Маршрут для повідомлення абеткою Морзе
router.post('/sendMorseMessage', sendMorseMessage);

export default router;
