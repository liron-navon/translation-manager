import { readFileSync } from 'fs';

import {BrowserWindow, dialog} from 'electron';
import {Events} from '../../../shared/eventsEnum';
import {createEvent} from '../../helpers/createEvent';

export const registerUploadXML = (window: BrowserWindow) => {
  createEvent(Events.uploadXML, async () => {
    // open file
    const files = dialog.showOpenDialog(window, {
      properties: ['openFile'],
      filters: [
        { name: 'xml', extensions: ['xml'] }
      ]
    });

    if (!files || files.length === 0) {
      throw new Error('no file selected');
    }

    const fileContent = readFileSync(files[0], 'utf8');

    return {
      xml: fileContent
    };
  });
};

