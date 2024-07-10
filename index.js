import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logInfo, logError } from "./configs/loggers/index.js";
import { corsConfig } from "./configs/cors/cors.js";

const app = express();
const PORT = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** CORS политики */
app.use(corsConfig);

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
