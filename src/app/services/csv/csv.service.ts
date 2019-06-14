import {Injectable} from '@angular/core';
import {Events} from '../../../../shared/eventsEnum';
import {ElectronService} from '../../providers/electron.service';
import {TranslationsService} from '../translations/translations.service';
import {Project} from '../../../../shared/translationInterfaces';
import {join} from 'path';
import cloneDeep from 'lodash/cloneDeep';
import {notesFileName} from '../../../../shared/projectConfigurations';
import * as get from 'lodash/get';
import {stripHTML} from '../translations/stripHTML';

/*
Example of a file outputted from here
-------------------------------------

"key";"en-us";"nl-nl";"notes [READ ONLY]"
"Duration";"Term";"Looptijd";"I'm a little sample note"
"End date";"End date";"Einddatum";"I'm another sample note"
"Goal";"Target";"Doel";""
"Goal amount";"Target amount";"Doelbedrag";""
"Goal description";"Target name";"Doelnaam";""
 */

const CSVDelimiter = ';'; // delimiter for cells
const eol = '\r\n'; // end of line
const notesColumnTitle = 'notes';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor(
    private electronService: ElectronService,
    private translationsService: TranslationsService
  ) {
  }

  // creates a CSV from the project, and allows the user to download it
  createCSVExport() {
    const {project, keywords} = this.translationsService;
    const files = project.files;
    const languages = this.translationsService.languages;

    const lines = [
      ['key', ...languages, 'notes']
    ];

    keywords.map(({key}) => {
      const translations = languages.map((lang) => files[lang].content[key] || '');
      const note = get(files, [notesFileName, 'content', key]);
      // keep key first and note last
      lines.push([
        key,
        ...translations,
        note ? stripHTML(note) : '']);
    });

    const csvLines = lines.map((line) => {
      return line.map((item) => `"${item}"`).join(CSVDelimiter);
    });
    const fileContent = `${csvLines.join(eol)}`;

    const blob = new Blob([fileContent], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);

    return this.electronService.callIPC(Events.downloadFile, {url, filename: this.translationsService.title});
  }

  // allows the user to upload a CSV file, and loads it into the translation service
  async importCSV() {
    const {data: {csv}} = await this.electronService.callIPC(Events.uploadCSV, {});
    const project = cloneDeep(this.translationsService.project) as Project;

    // get the languages from the CSV file
    const languages = Object.keys(csv[0]).filter((l) => l !== 'key');

    // prepare the language files to be filled
    languages.forEach((lang) => {
      if (lang === notesColumnTitle) {
        return;
      }
      const existingFile = project.files[lang];
      if (existingFile) {
        // reset the contents of the file
        existingFile.content = {};
      } else {
        // create a new file, we got a new language from the CSV file
        project.files[lang] = {
          content: {},
          name: lang,
          path: join(project.folder, `${lang}.json`)
        };
      }
    });

    // fill in the content from the CSV file
    csv.forEach((line) => {
      languages.forEach((lang) => {
        if (lang === notesColumnTitle) {
          return;
        }
        project.files[lang].content[line.key] = line[lang];
      });
    });

    // load the newly created project
    this.translationsService.handleNewProject(project);
    this.translationsService.hasChanges = true;
  }
}
