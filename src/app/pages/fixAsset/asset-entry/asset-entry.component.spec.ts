import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetEntryComponent } from './asset-entry.component';

describe('AssetEntryComponent', () => {
  let component: AssetEntryComponent;
  let fixture: ComponentFixture<AssetEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
