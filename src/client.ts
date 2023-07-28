const io = require('socket.io-client'); 
const socket = io('http://localhost:5000');
 
socket.on('connect', () => { 
  console.log('Соединение установлено'); 
}); 
 
socket.on('message', (data: string) => { 
  console.log('Получено сообщение от сервера:', data); 
}); 
 
socket.on('disconnect', () => { 
  console.log('Соединение разорвано'); 
});