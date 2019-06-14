import {File} from '../../../../shared/translationInterfaces';
import * as xml2js from 'xml2js';
import {stripHTML} from './stripHTML';
import * as get from 'lodash/get';

/*
Example of an output XML file
-----------------------------

<!--Auto generated values file for android, for the nl language [All notes are READ ONLY]-->
<resources>
  <!-- My little comment goes here -->
  <string name="Duration">Looptijd</string>
  <!-- I'm another note, look at me -->
  <string name="End date">Einddatum</string>
  <string name="Goal">Doel</string>
  <string name="Goal amount">Doelbedrag</string>
</resources>
 */


export const createAndroidXMLFile = (file: File, notes?: File) => {
  let xml = `
<!--Auto generated values file for android, for the ${file.name} language [All notes are READ ONLY]-->
<resources>
`;

  Object.entries(file.content).forEach(([ key, value ]) => {
    const note = get(notes, ['content', key]);
    // it may look funny, but this is the exact format that we want (see example at the top of the file)
    xml += `  ${note ? `<!-- ${stripHTML(note)} -->` : ''}
  <string name="${key}">${value}</string>`;
  });
  xml += `\n</resources>
`;
  return xml;
};

const xmlJsonToFileContent = (json: any) => {
  const strings = json.resources.string;
  const result = {};
  strings.forEach((str) => {
    const value = str._; // that's how we get the value
    const name = str.$.name; // an attribute called name
    result[name] = value;
  });
  return result;
};

export const parseAndroidXMLFile = (sourceLanguage: File, rawXML: string): Promise<File> => {
 return new Promise((resolve, reject) => {
   xml2js.parseString(rawXML, (error, json) => {
     if (error) {
       return reject(error);
     }
     const contentJSON = xmlJsonToFileContent(json);
     resolve({
       ...sourceLanguage,
       content: {
         ...sourceLanguage.content,
         ...contentJSON
       }
     });
   });
 });
};
