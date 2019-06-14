import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSelectorMenuComponent } from './item-selector-menu.component';

describe('ItemSelectorMenuComponent', () => {
  let component: ItemSelectorMenuComponent;
  let fixture: ComponentFixture<ItemSelectorMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemSelectorMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSelectorMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
