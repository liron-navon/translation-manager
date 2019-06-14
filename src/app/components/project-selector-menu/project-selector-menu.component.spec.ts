import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSelectorMenuComponent } from './project-selector-menu.component';

describe('ProjectSelectorMenuComponent', () => {
  let component: ProjectSelectorMenuComponent;
  let fixture: ComponentFixture<ProjectSelectorMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectSelectorMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSelectorMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
