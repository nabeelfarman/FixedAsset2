import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmovableAssetRptComponent } from './immovable-asset-rpt.component';

describe('ImmovableAssetRptComponent', () => {
  let component: ImmovableAssetRptComponent;
  let fixture: ComponentFixture<ImmovableAssetRptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImmovableAssetRptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImmovableAssetRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
