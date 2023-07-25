import { Request, Response } from 'express';
import { Socket } from 'socket.io';
import { handleMessage, handleMorseMessage } from '../chat/messageUtils';

// Обробник для звичайного текстового повідомлення
export function sendMessage(req: Request, res: Response) {
  const { username, message } = req.body;

  const morseCode = '...';
  const socket = req.app.get('socket') as Socket;
  handleMorseMessage(socket, morseCode);

  res.status(200).json({ success: true, message: 'Повідомлення відправлено' });
}

// Обробник для повідомлення в абетці Морзе
export function sendMorseMessage(req: Request, res: Response) {
  const { username, morseCode } = req.body;

  const message = '...';
  const socket = req.app.get('socket') as Socket;
  handleMessage(socket, message);

  res.status(200).json({ success: true, message: 'Повідомлення відправлено' });
}
