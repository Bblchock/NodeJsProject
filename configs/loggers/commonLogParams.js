import winston from "winston";

export const commonLogParams = {
  format: winston.format.combine(
    winston.format.timestamp({
      format: "DD-MM-YYYY HH:mm:ss",
    }),
    winston.format.json(), // Формат записи в JSON
  ),
};
