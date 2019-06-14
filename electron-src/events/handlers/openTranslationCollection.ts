import {dialog, BrowserWindow} from 'electron';
import {Events} from '../../../shared/eventsEnum';
import {createEvent} from '../../helpers/createEvent';
import * as json5 from 'json5';

import * as fs from 'fs';
import {dirname} from 'path';

export const registerOpenTranslationCollection = (window: BrowserWindow) => {
  createEvent(Events.openTranslationCollection, async ({ path }) => {
    let filePath = path;
    if (!filePath) {
      const files = dialog.showOpenDialog(window, {
        properties: ['openFile'],
        filters: [
          { name: 'translation collection', extensions: ['json5', 'json'] }
        ]
      });

      if (!files || files.length === 0) {
        throw new Error('no file selected');
      }
      filePath = files[0];
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const collection = json5.parse(fileContent);

    collection.dirname = dirname(filePath);
    collection.path = filePath;
    return {
      collection
    };
  });
};
