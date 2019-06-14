export interface Kvp<T = any> {
  [label: string]: T;
}

export interface File {
  name: string;
  path: string;
  content: any;
}

export interface FilesMap {
  [label: string]: File;
}

export interface TranslationSet {
  language: string;
  value: string;
}


export interface Project {
  files: FilesMap;
  folder: string;
}

export interface TranslationServiceOptions {
  trim: boolean;
  prettySource: boolean;
  disableNotes: boolean;
}

export interface Keyword {
  key: string;
  missingTranslation?: boolean;
}

export interface TextDescriptor {
  key: string;
  [language: string]: string;
}

export interface CollectionProject {
  name: string;
  path: string;
}

export interface Collection {
  name: string;
  path: string; // generated at runtime
  dirname: string; // generated at runtime
  projects: CollectionProject[];
  options: {

  }
}

export interface StorageItem {
  type: 'project' | 'collection';
  path: string;
  name: string;
}
