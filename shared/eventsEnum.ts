export enum Events {
  selectFolder = 'selectFolder',
  openFolder = 'openFolder',
  saveChanges = 'saveChanges',
  uploadCSV = 'uploadCSV',
  uploadPO = 'uploadPO',
  uploadXML = 'uploadXML',
  downloadFile = 'downloadFile',
  openTranslationCollection = 'openTranslationCollection',
}

export const getEventID = (name: Events) => {
  return {
    event: name,
    done: `${name}:done`
  };
};
