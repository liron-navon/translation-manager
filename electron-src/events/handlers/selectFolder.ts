import {dialog, BrowserWindow} from 'electron';
import {Events} from '../../../shared/eventsEnum';
import {createEvent} from '../../helpers/createEvent';
import {getProject} from '../../helpers/getProject';

export const registerSelectFolder = (window: BrowserWindow) => {
  createEvent(Events.selectFolder, async () => {
    // open file
    const folders = dialog.showOpenDialog(window, {
      properties: ['openDirectory']
    });

    if (!folders) {
      throw new Error('no folder selected');
    }

    return getProject(folders[0]);
  });
};
