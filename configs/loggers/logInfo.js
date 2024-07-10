import winston from "winston";
import { commonLogParams } from "./commonLogParams.js";

/** Конфиг логера общей инфы */
const loggerInfo = winston.createLogger({
  ...commonLogParams,
  level: "info",
  transports: [
    new winston.transports.File({ filename: "logs/server.log" }), // Файл для записи всех логов
  ],
});

export const logInfo = (message, data) => {
  loggerInfo.info(`Запрос на /api/${message}`, data);
  console.log(message, data ?? "");
};
