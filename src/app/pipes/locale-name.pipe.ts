import {Pipe, PipeTransform} from '@angular/core';
import {localesMap} from './localesMap';

export function getLocaleLanguage(code: string) {
  if (localesMap[code]) {
    return localesMap[code];
  }
  // we might have nl-nl, so this will take the first part (nl)
  if (code.includes('-')) {
    const baseCode = code.split('-')[0];
    return localesMap[baseCode] || code;
  }

  // we might have en_UK, so this will take the first part (en)
  if (code.includes('_')) {
    const baseCode = code.split('_')[0];
    return localesMap[baseCode] || code;
  }

  return code;
}

@Pipe({
  name: 'localeName'
})
export class LocaleNamePipe implements PipeTransform {
  transform(value: string): string {
    const language = getLocaleLanguage(value);
    if (language === value) {
      return language;
    }
    return `${value} (${language})`;
  }
}
