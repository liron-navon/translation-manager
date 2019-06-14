import {BrowserWindow} from 'electron';
import {Events} from '../../../shared/eventsEnum';
import {createEvent} from '../../helpers/createEvent';
import {Project, TranslationServiceOptions} from '../../../shared/translationInterfaces';
import * as fs from 'fs';
import * as jsonStableStringify from 'json-stable-stringify';
import * as isEmpty from 'lodash/isEmpty';
import * as isString from 'lodash/isString';
import * as trim from 'lodash/trim';
import {notesFileName} from '../../../shared/projectConfigurations';

interface IRequest {
  options: TranslationServiceOptions;
  project: Project;
}

// filter the request before saving it to file
const filterRequest = (request: IRequest) => {
  const options = request.options;
  const project = { ...request.project };
  // don't creates a notes file if it's disabled
  if (options.disableNotes) {
    delete project.files[notesFileName];
  }

  // remove empty objects, to not create empty files
  Object.entries(project.files).forEach(([fileKey, file]) => {
    // delete empty strings
    Object.entries(file.content).forEach(([ keyword, text ]) => {
      if (trim(text).length === 0) {
        delete file.content[keyword];
      }
    });
    // delete empty objects
    if (isEmpty(file.content)) {
      delete project.files[fileKey];
    }
  });

  return {
    project,
    options
  };
};

export const registerSaveChanges = (window: BrowserWindow) => {
  createEvent(Events.saveChanges, async (request: IRequest) => {
    const {project, options} = filterRequest(request);

    // a function to replace and filter values
    const replacer = (name, value) => {
      // if the trim option is active, we can trim all spaces
      if (options.trim && isString(value)) {
        // don't store empty strings for no reason
        if (value.length === 0) {
          return undefined;
        }
        value = trim(value);
      }
      return value;
    };

    Object.values(project.files).forEach((file) => {
      // json-stable-stringify sorts the keys alphabetically for us
      // uppercase first, and than lower cased character
      //
      // {
      //   "$": 'special characters goes first',
      //   "A": 'HELLO',
      //   "B": 'WORLD'
      //   "a": 'hello'
      //   "b": 'world'
      // }
      const contentString = jsonStableStringify(file.content, {
        space: options.prettySource ? 2 : 0,
        replacer
      });
      fs.writeFileSync(file.path, contentString);
    });
    return {
      success: true
    };
  });
};
