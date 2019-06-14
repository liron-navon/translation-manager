import {FilesMap} from '../../../../shared/translationInterfaces';
import {File} from '../../../../shared/translationInterfaces';
import {stripHTML} from './stripHTML';
import * as get from 'lodash/get';

/*
Example of a .PO file generated from here (source in "nl" and translation in "en")
-----------------------------------------

msgid ""
msgstr ""

"Project-Id-Version: Lingohub 1.0.1\n"
"Language: en\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Content-Transfer-Encoding: 8bit\n"
"MIME-Version: 1.0\n"
"Plural-Forms:: nplurals=2; plural=(n != 1);\n"
"x-translate-manager-map: nl-nl::en-us\n"

#.[READ ONLY NOTE] My little comment goes here
msgid "Looptijd"
msgstr "Term"

#.[READ ONLY NOTE] I'm another note, look at me
msgid "Einddatum"
msgstr "End date"

msgid "Doel"
msgstr "Target"
 */

const mapperHeaderName = 'x-translate-manager-map';
const mapperHeaderSeperator = '::';

// given an object and a value, find the key that points to the value
const getKeyFromValue = (value, obj) => {
  return Object.keys(obj).find((key) => {
    return obj[key] === value;
  });
};

// given a PO file, and a filesMap, it will create a new language File from the PO content
export const parsePOFileToLanguage = (files: FilesMap, po: any): File => {
  const translations = po.translations[''];

  if (!po.headers[mapperHeaderName]) {
    throw new Error('Missing mapper header');
  }
  const [fromKey, toKey] = po.headers[mapperHeaderName].split(mapperHeaderSeperator);

  const sourceLanguage = fromKey === 'key' ? null : files[fromKey];

  // returns the actual key, from the key specified in the PO (can be a text in dutch for example)
  const getKey = (key) => {
    if (!sourceLanguage) {
      return key;
    }
    return getKeyFromValue(key, sourceLanguage.content);
  };

  const newFile = {
    ...files[toKey]
  };

  Object.keys(translations).forEach((poKey) => {
    const key = getKey(poKey);
    newFile.content[key] = translations[poKey].msgstr[0];
  });

  return newFile;
};

// given a source and output languages, it creates a PO file
export const createPOFile = (fromLanguage: File | null, toLanguage: File, notes?: File): string => {
  const eol = '\\n';
  const seperatorValue = `${fromLanguage && fromLanguage.name || 'key'}${mapperHeaderSeperator}${toLanguage.name}`;
  const headers = {
    'Project-Id-Version': 'Lingohub 1.0.1',
    'Language': toLanguage.name.substring(0, 2).toLowerCase(),
    'Content-Type': 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding': '8bit',
    'MIME-Version': '1.0',
    'Plural-Forms:': 'nplurals=2; plural=(n != 1);',
    [mapperHeaderName]: seperatorValue
  };
  const poHeaders = [];
  Object.keys(headers).forEach((key) => {
    poHeaders.push(`"${key}: ${headers[key]}${eol}"`);
  });

  // don't move the text, that's how we need it to be
  let poText = `msgid ""
msgstr ""
\n`;

  poText += poHeaders.join('\n');
  poText += `\n`;

  const getMsgid = (key) => {
    if (!fromLanguage || !fromLanguage.content) {
      return key;
    }
    return fromLanguage.content[key] || key;
  };

  const poLines = [];
  Object.keys(toLanguage.content).forEach((key) => {
    const note = get(notes, ['content', key]);
    poLines.push(
      `
${note ? `#.[READ ONLY NOTE] ${stripHTML(note)}` : ''}
msgid "${getMsgid(key)}"
msgstr "${toLanguage.content[key]}"
`);
  });

  poText += poLines.join('');
  return poText;
};
