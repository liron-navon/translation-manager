import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationViewComponent } from './translation-view.component';

describe('TranslationViewComponent', () => {
  let component: TranslationViewComponent;
  let fixture: ComponentFixture<TranslationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranslationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
