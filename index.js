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

/** Конфиг логера */
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "DD-MM-YYYY HH:mm:ss",
    }),
    winston.format.json(), // Формат записи в JSON
  ),
  transports: [
    new winston.transports.File({ filename: "logs/server.log" }), // Файл для записи всех логов
  ],
});

const logInfo = (message, data) => {
  logger.info(`Запрос на /api/${message}`, data);
  console.log(message, data ?? '');
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
      response.status(404).send("Файл не найден");
      return;
    }

    fs.readFile(filePath, "utf8", (error, data) => {
      if (error) {
        response.status(500).send("Ошибка при чтении файла");
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

  response.sendFile(filePath, (err) => {
    if (err) {
      response.status(404).send("Файл не найден");
      return;
    }

    response.sendFile(filePath);
  });
});

/** Старт сервера */
app.listen(PORT, () => {
  const message = `Сервер запущен на порту ${PORT}`;
  logInfo(message);
});
