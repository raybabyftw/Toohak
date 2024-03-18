// Function that will reset the state of the application
// back to the start
import fs from 'fs';
import path from 'path';
import { setData, DataStore, getTimers, setTimers } from './dataStore';

export const clear = (): Record<string, never> => {
  const timerIds = getTimers();
  for (const id of timerIds) {
    clearTimeout(id);
  }

  const data: DataStore = {
    users: [],
    quizzes: [],
    sessions: [],
    isTimerRunning: false,
  };

  deleteAllFilesInDir('./thumbnails');
  setTimers([]);
  setData(data);
  return {};
};

function deleteAllFilesInDir(dirPath: string) {
  fs.readdirSync(dirPath).forEach(file => {
    fs.rmSync(path.join(dirPath, file));
  });
}
