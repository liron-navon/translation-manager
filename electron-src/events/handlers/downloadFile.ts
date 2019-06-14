import {BrowserWindow} from 'electron';
import {Events} from '../../../shared/eventsEnum';
import {createEvent} from '../../helpers/createEvent';
import { download } from 'electron-dl';

export const registerDownloadCSV = (window: BrowserWindow) => {
  createEvent(Events.downloadFile, async ({ url, filename }) => {
    const response = await download(window, url, {
      saveAs: true,
      showBadge: true,
      filename: filename
    });
    return {
      response
    };
  });
};

