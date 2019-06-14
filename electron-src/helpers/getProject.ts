import * as fs from 'fs';
import {join} from 'path';

export const getProject = (path) => {
  const files: any = {};

  fs.readdirSync(path).forEach((file) => {
    if (file.endsWith('.json')) {
      try {
        const name = file.replace('.json', '');
        const filePath = join(path, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');

        files[name] = {
          name,
          path: filePath,
          content: JSON.parse(fileContent)
        };
      } catch (e) {
        console.error(e);
      }
    }
  });

  return {
    folder: path,
    files
  };
};
