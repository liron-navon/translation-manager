import {Injectable} from '@angular/core';
import {ElectronService} from '../../providers/electron.service';
import {Events} from '../../../../shared/eventsEnum';
import {
  File, FilesMap, Kvp, Project,
  TranslationServiceOptions, TranslationSet, StorageItem,
  Collection, Keyword, TextDescriptor
} from '../../../../shared/translationInterfaces';
import {StoreKeys, StoreService} from '../store/store.service';
import cloneDeep from 'lodash/cloneDeep';
import isUndefined from 'lodash/isUndefined';
import {join} from 'path';
import {createPOFile, parsePOFileToLanguage} from './poParser';
import {createAndroidXMLFile, parseAndroidXMLFile} from './androidXMLParser';
import {maxProjectPathParts, notesFileName} from '../../../../shared/projectConfigurations';

@Injectable({
  providedIn: 'root'
})
export class TranslationsService {
  public project: Project;
  public _options: TranslationServiceOptions = {
    trim: false,
    prettySource: false,
    disableNotes: false
  };

  public config = {
    notesFileName
  };

  public collection?: Collection;

  public keywords: Keyword[];
  public languages: string[];
  public title: string;
  public activeKeyword: string;
  public activeTranslationSet: TranslationSet[];
  public lastItems: StorageItem[]; // the last opened projects
  public keywordsWarnings = 0;

  public hasChanges = false;

  // since collection options always override user options
  // this returns a flag to disable the UI for that option
  public shouldDisableOption(name: string) {
    if (!this.collection) {
      return false;
    }
    return !isUndefined(this.collection.options[name]);
  }

  // expose only a shallow copy
  public get options(): TranslationServiceOptions {
    // collection options should override any user options
    if (this.collection) {
      return {
        ...this._options,
        ...this.collection.options
      };
    }
    return {...this._options};
  }

  public setOption(name: string, value: any, requiresReload = false) {
    this._options[name] = value;
    this.store.set(StoreKeys.translationOptions, this._options);
    if (requiresReload) {
      this.handleNewProject(this.project);
    }
  }

  private syncTranslations() {
    if (!this.activeTranslationSet) {
      return;
    }
    this.activeTranslationSet.forEach((set) => {
      let value = set.value || '';
      if (this.options.trim) {
        value = value.trim();
      }
      this.project.files[set.language].content[this.activeKeyword] = value;
    });
  }

  constructor(
    private electronService: ElectronService,
    private store: StoreService
  ) {
    this.init();
  }

  async importPO() {
    const {data: {po}} = await this.electronService.callIPC(Events.uploadPO, {});

    const newFile = parsePOFileToLanguage(this.project.files, po);
    const newProject = {
      ...this.project,
      files: {
        ...this.project.files,
        [newFile.name]: newFile
      }
    };
    this.handleNewProject(newProject);
  }

  exportPO(fromLanguage: string | null, toLanguage: string) {
    const {files} = this.project;
    const fromFile = fromLanguage ? files[fromLanguage] : null;
    const toFile = files[toLanguage];
    const poFileContent = createPOFile(fromFile, toFile, files[notesFileName]);

    const blob = new Blob([poFileContent], {type: 'text/x-gettext-translation;charset=utf-8;'});
    const url = URL.createObjectURL(blob);

    return this.electronService.callIPC(Events.downloadFile, {url, filename: ''});
  }

  async exportAndroidXMLFile(language: string) {
    const fileContent = createAndroidXMLFile(this.project.files[language], this.project.files[notesFileName]);
    const blob = new Blob([fileContent], {type: 'application/xml;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    return this.electronService.callIPC(Events.downloadFile, {url, filename: ''});
  }

  async importAndroidXMLFile(language: string) {
    const {data: {xml}} = await this.electronService.callIPC(Events.uploadXML, {});
    const newFile = await parseAndroidXMLFile(this.project.files[language], xml);

    const newProject = {
      ...this.project,
      files: {
        ...this.project.files,
        [newFile.name]: newFile
      }
    };
    this.handleNewProject(newProject);
  }

  public async openCollectionFromPath(path: string) {
    await this.selectCollection(path);
    const firstProject = this.collection.projects[0];
    if (!firstProject) {
      throw new Error('there are no files in this project');
    }
    return this.openProjectFromCollection(firstProject.name);
  }

  // pass a path to open without dialog
  public async selectCollection(path?: string) {
    const {data: {collection}} = await this.electronService.callIPC(Events.openTranslationCollection, {path});
    this.collection = collection;
    this.updateLastItems('collection');
  }

  public async openProjectFromCollection(projectName: string) {
    if (!this.collection) {
      throw new Error(`no collection ready`);
    }
    const project = this.collection.projects.find(({name}) => name === projectName);
    if (!project) {
      throw new Error(`no project with name ${projectName}`);
    }
    const path = join(this.collection.dirname, project.path);
    return this.openProjectToTranslate(path, project.name, true);
  }

  private async init() {
    this.getLastItemsFromStorage();
    // update the options from storage if possible
    this._options = this.store.get(StoreKeys.translationOptions, this._options);

    if (this.lastItems.length > 0) {
      try {
        const lastItem = this.lastItems[0];
        if (!lastItem) {
          return;
        }
        if (lastItem.type === 'project') {
          await this.openProjectToTranslate(lastItem.path, null, true);
        } else {
          await this.openCollectionFromPath(lastItem.path);
        }
      } catch (error) {
        console.error('unable to load initial project', error);
      }
    }
  }

  // is there a project loaded from file
  public get hasLoadedProject() {
    return this.project && this.project.folder;
  }

  // when changing the translations, this is called
  public onTranslationInput(language: string, value: string) {
    this.activeTranslationSet = this.activeTranslationSet.map((set) => {
      if (set.language === language) {
        set.value = value;
      }
      return set;
    });
    if (!this.hasChanges) {
      this.hasChanges = true;
    }
  }

  // when adding a new text (new key) this is called
  public addText(text: TextDescriptor) {
    const project = cloneDeep(this.project) as Project;
    this.languages.forEach((lang) => {
      project.files[lang].content[text.key] = text[lang] || '';
    });
    if (!this.hasChanges) {
      this.hasChanges = true;
    }
    this.handleNewProject(project);
  }

  // when selecting an active keyword, this is called
  public selectActiveKeyword(keyword: string) {
    if (this.activeTranslationSet) {
      this.syncTranslations();
    }
    this.activeKeyword = keyword;
    this.activeTranslationSet = this.createTranslationSet(keyword);
  }

  // fetches the last projects from persistent storage
  private getLastItemsFromStorage() {
    this.lastItems = this.store.get<StorageItem[]>(StoreKeys.lastItems, []);
  }

  // updates the last projects persistent storage,
  // adding and if needed deleting older project paths
  private updateLastItems(type: 'project' | 'collection') {
    const newItem = {
      type,
      path: type === 'project' ? this.project.folder : this.collection.path,
      name: type === 'project' ? this.title : this.collection.name
    };

    const newLastItems = this.lastItems.filter((item) => newItem.name !== item.name);
    newLastItems.unshift(newItem);

    if (newLastItems.length > 10) {
      newLastItems.pop();
    }

    this.lastItems = newLastItems;
    this.store.set(StoreKeys.lastItems, newLastItems);
  }

  // open a dialog to allow the user to select a project folder
  public async selectProjectToTranslate() {
    const {data} = await this.electronService.callIPC<Project>(Events.selectFolder, {});
    this.handleNewProject(data);
    this.updateLastItems('project');
  }

  // open a project folder from a given path
  public async openProjectToTranslate(path: string, title?: string, skipStorage = false) {
    const {data} = await this.electronService.callIPC<Project>(Events.openFolder, {path});
    this.handleNewProject(data, title);
    if (!skipStorage) {
      this.updateLastItems('project');
    }
  }

  // save the current changes to the file system
  public async saveChanges() {
    if (!this.hasLoadedProject) {
      throw new Error('Missing project, please load the project from a file system');
    }

    this.syncTranslations();
    const result = await this.electronService.callIPC(Events.saveChanges, {
      project: this.project,
      options: this.options
    });
    this.hasChanges = false;
    return result;
  }

  // creates a translation set for a keyword, the set includes a list
  // of language/value pairs and allows us to display the languages for translators
  private createTranslationSet(keyword: string): TranslationSet[] {
    const translationSet: TranslationSet[] = [];
    Object.values(this.project.files).forEach((file) => {
      translationSet.push({
        language: file.name,
        value: file.content[keyword] || ''
      });
    });
    return translationSet;
  }

  // add different defaults to the project when loaded from file
  setProjectDefaults(project: Project): Project {
    // Add a notes file if none exist
    if (!project.files[notesFileName]) {
      project.files[notesFileName] = {
        name: notesFileName,
        content: {},
        path: join(project.folder, `${notesFileName}.json`)
      };
    }
    return project;
  }

  // creates a list of language names, used for different lists for the UI
  createLanguagesList(files: FilesMap) {
    const list = Object.keys(files);
    return list.filter((fileName) => {
      return fileName !== notesFileName;
    });
  }

  // call this when loading a project (or importing)
  // to bootstrap the new project
  handleNewProject(project: Project, title?: string) {
    const projectWithDefaults = this.setProjectDefaults(project);
    const {files, folder} = projectWithDefaults;
    this.activeTranslationSet = undefined;
    this.activeKeyword = undefined;

    this.project = projectWithDefaults;
    this.keywords = this.createKeywords(files);
    this.languages = this.createLanguagesList(files);

    this.title = title ? title : this.createTitle(folder);
    if (this.keywords.length) {
      this.selectActiveKeyword(this.keywords[0].key);
    }
  }

  // create a title for the project
  public createTitle(projectPath: string) {
    const parts = projectPath.split('/');
    return parts.slice(parts.length - maxProjectPathParts).join('/');
  }

  // checks if a keyword exists in all the given files
  private isKeywordExistsInAllFiles(key: string, filesList: File[]) {
    let instances = 0;
    filesList.forEach(({content}) => {
      if (content[key]) {
        instances++;
      }
    });
    return instances === filesList.length;
  }

  // adds a new language to the project
  async addNewLanguage(newLanguage: string, defaultTo: string = 'none') {
    const newProject = cloneDeep(this.project) as Project;

    const content = {};
    this.keywords.forEach(({key}) => {
      if (defaultTo === 'key') {
        // default to the key
        content[key] = key;
      } else if (this.languages.includes(defaultTo)) {
        // default to some language
        content[key] = this.project.files[defaultTo].content[key] || '';
      } else {
        // default to an empty string
        content[key] = '';
      }
    });

    newProject.files[newLanguage] = {
      content: content,
      path: join(this.project.folder, `${newLanguage}.json`),
      name: newLanguage
    };

    this.handleNewProject(newProject);
    this.hasChanges = true;
  }

  deleteKeyword(key: string) {
    const newProject = {
      ...this.project
    };
    Object.keys(this.project.files).forEach((lang) => {
      delete newProject.files[lang].content[key];
    });
    this.hasChanges = true;
    this.handleNewProject(newProject);
  }

  // update the key names
  updateKeys(keyChanges: Kvp<string>) {
    const newProject = {
      ...this.project
    };
    const languages = Object.keys(newProject.files);
    Object.entries(keyChanges).forEach(([key, newKey]) => {
      languages.forEach((lang) => {
        const content = newProject.files[lang].content;
        const translation = content[key];
        delete content[key];
        content[newKey] = translation;
      });
    });
    this.handleNewProject(newProject);
  }

  // creates an array of analyzed keywords with errors and warnings
  private createKeywords(files: FilesMap): Keyword[] {
    const keywords = {};
    this.keywordsWarnings = 0;

    const languageFilesList = Object.values(files).filter((file) => {
      // no need to analyze the notes
      return file.name !== notesFileName;
    });

    languageFilesList.forEach((file, fileIndex) => {
      const keys = Object.keys(file.content);

      keys.forEach((key) => {
        const existingKeyword = keywords[key];
        if (existingKeyword) {
          return;
        }

        // this key doesn't exist on the first files,
        // but exist on the later files, it requires attention
        if (fileIndex > 0) {
          this.keywordsWarnings++;
          keywords[key] = {
            key,
            missingTranslation: true
          };
        }

        const isOK = this.isKeywordExistsInAllFiles(key, languageFilesList);
        if (isOK) {
          keywords[key] = {
            key
          };
        } else {
          // the keyword should exist in all files,
          // if it's missing after the first file we look at,
          // we need to show that it requires attention.
          this.keywordsWarnings++;
          keywords[key] = {
            key,
            missingTranslation: true
          };
        }
      });
    });
    return Object.values(keywords);
  }
}
