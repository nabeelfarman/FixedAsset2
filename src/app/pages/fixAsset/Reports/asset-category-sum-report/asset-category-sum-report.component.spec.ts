import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCategorySumReportComponent } from './asset-category-sum-report.component';

describe('AssetCategorySumReportComponent', () => {
  let component: AssetCategorySumReportComponent;
  let fixture: ComponentFixture<AssetCategorySumReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetCategorySumReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetCategorySumReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
