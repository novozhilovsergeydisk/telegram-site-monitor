// src/bot.js
const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const config = require("./config");
const checkSites = require("./monitor");
// console.log({ 'config.botToken': config.botToken });
console.log(process.env.API_BOT_TOKEN);
// Инициализация бота
const bot = new Telegraf(process.env.API_BOT_TOKEN);

// Запуск бота
bot.start((ctx) =>
  ctx.reply("Бот запущен! Для проверки используйте команду /check")
);

// Команда для ручной проверки
bot.command("check", async (ctx) => {
  ctx.reply("Проверяю сайты...");
  const results = await checkSites(config.sitesToCheck);
  results.forEach((result) => {
    // if (result.status == "ok") {
    //   bot.telegram.sendMessage(config.chatId, result.text);
    // } else if (result.status == "error") {
    //   console.log({ result });
    //   bot.telegram.sendMessage(config.chatId, result.text);
    // }

    // ctx.reply(result.text);

    console.log({ result });
  });
});

// Цикл проверки сайтов
setInterval(async () => {
  try {
    const results = await checkSites(config.sitesToCheck);
    results.forEach((result) => {
      // console.log({ result });
      if (result.status == "ok") {
        bot.telegram.sendMessage(config.chatId, result.text);
      } else if (result.status == "error") {
        console.log({ result });
        bot.telegram.sendMessage(config.chatId, result.text);
      }
    });
  } catch (error) {
    console.error("Ошибка при проверке сайтов:", error.message);
  }
}, config.checkInterval);

// Запуск бота
bot
  .launch()
  .then(() => console.log("Бот успешно запущен"))
  .catch((error) => {
    console.error("Ошибка при запуске бота:", error.message);
  });

// bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on(message('sticker'), (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
