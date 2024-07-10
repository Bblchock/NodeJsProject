import { logError, logInfo } from "../configs/loggers/index.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

export const getInfoHandler = (req, response) => {
  logInfo("getInfo");

  const result = "Обработанный ответ";

  response.json({ result });
};

export const getFileDataHandler = ({ query }, response) => {
  const { fileName } = query;

  logInfo("getFileData", fileName);

  // Определяем полный путь к файлу
  const filePath = path.join(rootDir, "files", fileName + ".json");

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
};

export const getFileHandler = ({ params }, response) => {
  const fileName = params.fileName;

  logInfo("getFile", fileName);

  const filePath = path.join(rootDir, "files", fileName);

  response.sendFile(filePath, (error) => {
    if (error) {
      const message = "Файл не найден";
      logError(message, error);

      response.status(404).send(message);
      return;
    }

    response.sendFile(filePath);
  });
};
