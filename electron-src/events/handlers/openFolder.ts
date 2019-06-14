import {dialog, BrowserWindow} from 'electron';
import {Events} from '../../../shared/eventsEnum';
import {createEvent} from '../../helpers/createEvent';
import {getProject} from '../../helpers/getProject';

export const registerOpenFolder = (window: BrowserWindow) => {
  createEvent(Events.openFolder, async ({ path }) => {
    return getProject(path);
  });
};
