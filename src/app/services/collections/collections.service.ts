import { Injectable } from '@angular/core';
import {Events} from '../../../../shared/eventsEnum';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {

  constructor() { }


  // public selectCollection() {
  //   const {data: { collection }} = await this.electronService.callIPC(Events.openTranslationCollection, {});
  //   this.collection = collection;
  // }
  //
  // public handleNewCollection() {
  //
  // }
}
