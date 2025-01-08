// src/monitor.js

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Функция для проверки доступности сайта
async function checkSiteAvailability(site) {
  try {
    const response = await fetch(site);
    if (response.ok) {
      return { 'text': `Сайт ${site} доступен`, 'status': 'ok' };  // Упрощённое сообщение
    } else {
      return { 'text': `Сайт ${site} недоступен`, 'status': 'error' };  // Упрощённое сообщение
    }
  } catch (error) {
    logError(error.message);
    return { 'text': `Сайт ${site} недоступен`, 'status': 'error' };  // Упрощённое сообщение
  }
}

// Логирование ошибок в файл
function logError(errorMessage) {
  const logFilePath = path.join(__dirname, '../logs/errors.log');
  const logMessage = `${new Date().toISOString()} - ${errorMessage}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) console.error('Не удалось записать лог ошибки:', err.message);
  });
}

// Функция для проверки всех сайтов
async function checkSites(sites) {
  const results = [];

  for (const site of sites) {
    const result = await checkSiteAvailability(site);
    results.push(result);
  }

  return results;
}

module.exports = checkSites;
