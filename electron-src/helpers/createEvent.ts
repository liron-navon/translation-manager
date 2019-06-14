import {Events, getEventID} from '../../shared/eventsEnum';
import {Event, ipcMain} from 'electron';

export const createEvent = (eventName: Events, callback: any) => {
  const eventID = getEventID(eventName);
  ipcMain.on(eventID.event, async (e: Event, request: any) => {
    try {
      const data = await callback(request);
      e.sender.send(eventID.done, data);
    } catch (error) {
      console.log('[ERROR]', error);
      e.sender.send(eventID.done, {
        error: error.message
      });
    }
  });
};
