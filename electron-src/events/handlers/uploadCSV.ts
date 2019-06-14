import {BrowserWindow, dialog} from 'electron';
import {Events} from '../../../shared/eventsEnum';
import {createEvent} from '../../helpers/createEvent';
import * as csvtojson from 'csvtojson/v2';

export const registerUploadCSV = (window: BrowserWindow) => {
  createEvent(Events.uploadCSV, async () => {
    // open file
    const files = dialog.showOpenDialog(window, {
      properties: ['openFile'],
      filters: [
        { name: 'csv', extensions: ['csv'] }
      ]
    });

    if (!files || files.length === 0) {
      throw new Error('no file selected');
    }

    const parserOptions = {
      delimiter: ';',
      trim: false,
    };

    const csv = await csvtojson(parserOptions).fromFile(files[0]);

    return {
      csv
    };
  });
};

