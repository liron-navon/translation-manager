import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import {ipcRenderer, webFrame, remote, Event} from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import {Events, getEventID} from '../../../shared/eventsEnum';

@Injectable()
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

  callIPC<T = any>(eventName: Events, request: any): Promise<{ event: Event, data: T, error?: string }> {
    const eventID = getEventID(eventName);
    return new Promise((resolve, reject) => {
      this.ipcRenderer.send(eventID.event, request);
      this.ipcRenderer.once(eventID.done, (event: Event, data: any) => {
        if (data.error) {
          reject(new Error(data.error));
        }
        resolve({
          event,
          data
        });
      });
    });
  }

}
