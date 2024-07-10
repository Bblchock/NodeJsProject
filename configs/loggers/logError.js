import winston from "winston";
import { commonLogParams } from "./commonLogParams.js";

/** Конфиг логера ошибок */
const loggerError = winston.createLogger({
  ...commonLogParams,
  level: "error",
  transports: [
    new winston.transports.File({ filename: "logs/errors.log" }), // Отдельный файл для ошибок
  ],
});

export const logError = (message, data) => {
  loggerError.error(`Ошибка при обработке запроса: ${message}`, data);
  console.log(message, data ?? "");
};
