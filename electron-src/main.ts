import {registerEvents} from './events';
import {BrowserWindow} from 'electron';

export const bootstrapElectronApp = (window: BrowserWindow) => {
  registerEvents(window);
};
