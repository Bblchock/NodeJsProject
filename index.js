import express from "express";
import { logInfo } from "./configs/loggers/index.js";
import { corsConfig } from "./configs/cors/cors.js";
import {
  getFileDataHandler,
  getFileHandler,
  getInfoHandler,
} from "./handlers/handlers.js";

const app = express();
const PORT = 3000;

/** CORS политики */
app.use(corsConfig);

/** Получить какую-то инфу */
app.get("/api/getInfo", getInfoHandler);

/** Получить содержимое файла */
app.get("/api/getFileData", getFileDataHandler);

/** Получить файл */
app.get("/api/getFile/:fileName", getFileHandler);

/** Старт сервера */
app.listen(PORT, () => {
  logInfo(`Сервер запущен на порту ${PORT}`);
});
