const express = require("express");
const fs = require("fs");
const path = require("path");
const winston = require("winston");
const cors = require('cors');

const app = express();
const PORT = 3000;

/** CORS политики */
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const commonLogParams = {
  format: winston.format.combine(
    winston.format.timestamp({
      format: "DD-MM-YYYY HH:mm:ss",
    }),
    winston.format.json(), // Формат записи в JSON
  ),
};

/** Конфиг логера общей инфы */
const logger = winston.createLogger({
  ...commonLogParams,
  level: "info",
  transports: [
    new winston.transports.File({ filename: "logs/server.log" }), // Файл для записи всех логов
  ],
});

/** Конфиг логера ошибок */
const errorLogger = winston.createLogger({
  ...commonLogParams,
  level: "error",
  transports: [
    new winston.transports.File({ filename: "logs/errors.log" }), // Отдельный файл для ошибок
  ],
});

const logInfo = (message, data) => {
  logger.info(`Запрос на /api/${message}`, data);
  console.log(message, data ?? "");
};
const logError = (message, data) => {
  errorLogger.error(`Ошибка при обработке запроса: ${message}`, data);
  console.log(message, data ?? "");
};

/** Получить какую-то инфу */
app.get("/api/getInfo", (req, response) => {
  logInfo("getInfo");

  const result = "Обработанный ответ";

  response.json({ result });
});

/** Получить содержимое файла */
app.get("/api/getFileData", ({ query }, response) => {
  const { fileName } = query;

  logInfo("getFileData", fileName);

  // Определяем полный путь к файлу
  const filePath = path.join(__dirname, "files", fileName + ".json");

  fs.access(filePath, fs.constants.F_OK, (error) => {
    if (error) {
      const message = "Файл не найден";
      logError(message, error);

      response.status(404).send(message);
      return;
    }

    fs.readFile(filePath, "utf8", (error, data) => {
      if (error) {
        const message = "Ошибка при чтении файла";
        logError(message, error);

        response.status(500).send(message);
        return;
      }

      response.send(data);
    });
  });
});

/** Получить файл */
app.get("/api/getFile/:fileName", ({ params }, response) => {
  const fileName = params.fileName;

  logInfo("getFile", fileName);

  const filePath = path.join(__dirname, "files", fileName);

  response.sendFile(filePath, (error) => {
    if (error) {
      const message = "Файл не найден";
      logError(message, error);

      response.status(404).send(message);
      return;
    }

    response.sendFile(filePath);
  });
});

/** Старт сервера */
app.listen(PORT, () => {
  logInfo(`Сервер запущен на порту ${PORT}`);
});
