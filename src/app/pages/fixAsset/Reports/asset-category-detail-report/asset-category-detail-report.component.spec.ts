import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCategoryDetailReportComponent } from './asset-category-detail-report.component';

describe('AssetCategoryDetailReportComponent', () => {
  let component: AssetCategoryDetailReportComponent;
  let fixture: ComponentFixture<AssetCategoryDetailReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetCategoryDetailReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetCategoryDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
