import { po } from 'gettext-parser';
import { readFileSync } from 'fs';

import {BrowserWindow, dialog} from 'electron';
import {Events} from '../../../shared/eventsEnum';
import {createEvent} from '../../helpers/createEvent';

export const registerUploadPo = (window: BrowserWindow) => {
  createEvent(Events.uploadPO, async () => {
    // open file
    const files = dialog.showOpenDialog(window, {
      properties: ['openFile'],
      filters: [
        { name: 'po', extensions: ['po'] }
      ]
    });

    if (!files || files.length === 0) {
      throw new Error('no file selected');
    }

    const poFileContent = readFileSync(files[0], 'utf8');
    const poFile = po.parse(poFileContent);
    delete poFile.translations['']['']; // delete the raw code part

    return {
      po: poFile
    };
  });
};

