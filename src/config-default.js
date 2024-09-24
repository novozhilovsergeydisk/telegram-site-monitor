// src/config.js
module.exports = {
  botToken: 'YOUR_BOT_TOKEN', // Токен вашего бота
  chatId: 'YOUR_CHAT_ID', // ID чата, куда отправлять результаты
  sitesToCheck: [
    'https://google.com',
    'https://github.com',
    'https://stackoverflow.com',
  ],
  checkInterval: 60000, // Интервал проверки в миллисекундах (1 минута)
};
