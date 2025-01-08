const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const config = require("./config");
const checkSites = require("./monitor");

// Логируем токен для проверки (уберите в продакшне)
// console.log(config.token);

// Инициализация бота через process.env.API_BOT_TOKEN или config.token
const bot = new Telegraf(process.env.API_BOT_TOKEN);

// Команда /start
bot.start((ctx) =>
  ctx.reply("Бот запущен! Для проверки используйте команду /check")
);

// Команда для ручной проверки
bot.command("check", async (ctx) => {
  ctx.reply("Проверяю сайты...");
  const results = await checkSites(config.sitesToCheck);
  results.forEach((result) => {
    if (result.status === "ok") {
      bot.telegram.sendMessage(config.chatId, result.text);
    } else if (result.status === "error") {
      console.log({ result });
      bot.telegram.sendMessage(config.chatId, result.text);
    }
  });
});

// Цикл проверки сайтов
const intervalId = setInterval(async () => {
  try {
    const results = await checkSites(config.sitesToCheck);
    results.forEach((result) => {
      if (result.status === "error") {
        console.log({ result });
        bot.telegram.sendMessage(config.chatId, result.text);
      }
    });
  } catch (error) {
    console.error("Ошибка при проверке сайтов:", error.message);
  }
}, config.checkInterval);

// Функция для запуска бота
async function startBot() {
  console.log("Запуск бота...");  // Логируем начало запуска
  try {
    await bot.launch();
    console.log("Бот успешно запущен");
  } catch (error) {
    console.error("Ошибка при запуске бота:", error.message);
  }
}

// Запуск бота
startBot();

// Обработка сигналов завершения
process.once("SIGINT", async () => {
  console.log("Получен сигнал SIGINT. Завершаем работу...");
  clearInterval(intervalId); // Остановить цикл
  await bot.stop("SIGINT");  // Остановить бота
  process.exit(0);           // Завершить процесс
});

process.once("SIGTERM", async () => {
  console.log("Получен сигнал SIGTERM. Завершаем работу...");
  clearInterval(intervalId); // Остановить цикл
  await bot.stop("SIGTERM");  // Остановить бота
  process.exit(0);           // Завершить процесс
});
