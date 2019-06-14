import { TestBed } from '@angular/core/testing';

import { TranslationsService } from './translations.service';

describe('TranslationsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TranslationsService = TestBed.get(TranslationsService);
    expect(service).toBeTruthy();
  });
});
