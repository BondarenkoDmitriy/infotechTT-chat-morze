const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('chat message', (message) => {
  console.log('New message:', message);
  displayMessage(message);
});

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messageContainer = document.getElementById('message-container');

sendButton.addEventListener('click', () => {
  console.log('Send button clicked');
  const nameInput = document.getElementById('name-input');

  const message = messageInput.value.trim();
  if (message !== '') {
    socket.emit('chat message', {
        from: nameInput.value,
        text: message
    });
    messageInput.value = '';
  }
});

function displayMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  const nameInput = document.getElementById('name-input');

  if (message.from === nameInput.value) {
    messageElement.classList.add('sent');
  } else {
    messageElement.classList.add('received');
    const usernameElement = document.createElement('div');
    usernameElement.classList.add('message-username');
    usernameElement.textContent = message.from;
    messageElement.appendChild(usernameElement);
  }

  const contentElement = document.createElement('div');
  contentElement.classList.add('message-content');
  contentElement.textContent = message.text;
  messageElement.appendChild(contentElement);

  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
