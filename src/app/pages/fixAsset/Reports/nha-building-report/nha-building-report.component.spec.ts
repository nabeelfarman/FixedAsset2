import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NhaBuildingReportComponent } from './nha-building-report.component';

describe('NhaBuildingReportComponent', () => {
  let component: NhaBuildingReportComponent;
  let fixture: ComponentFixture<NhaBuildingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NhaBuildingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NhaBuildingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
