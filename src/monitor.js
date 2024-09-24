// src/monitor.js

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Функция для проверки доступности сайта
async function checkSiteAvailability(site) {
  try {
    const response = await fetch(site);
    if (response.ok) {
      return 'OK'; // `${site} доступен (Статус: ${response.status})`;
    } else {
      throw new Error(`${site} недоступен (Статус: ${response.status})`);
    }
  } catch (error) {
    logError(error.message);
    return `${site} недоступен (Ошибка: ${error.message})`;
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
