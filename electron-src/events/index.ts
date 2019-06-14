import {BrowserWindow} from 'electron';

// events
import {registerSelectFolder} from './handlers/selectFolder';
import {registerSaveChanges} from './handlers/saveChanges';
import {registerUploadCSV} from './handlers/uploadCSV';
import {registerDownloadCSV} from './handlers/downloadFile';
import {registerOpenFolder} from './handlers/openFolder';
import {registerUploadPo} from './handlers/uploadPO';
import {registerUploadXML} from './handlers/uploadXML';
import {registerOpenTranslationCollection} from './handlers/openTranslationCollection';

export const registerEvents = (window: BrowserWindow) => {
  registerSelectFolder(window);
  registerSaveChanges(window);
  registerUploadCSV(window);
  registerDownloadCSV(window);
  registerOpenFolder(window);
  registerUploadPo(window);
  registerUploadXML(window);
  registerOpenTranslationCollection(window);
};
