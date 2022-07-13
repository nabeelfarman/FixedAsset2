import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalTransferReportComponent } from './external-transfer-report.component';

describe('ExternalTransferReportComponent', () => {
  let component: ExternalTransferReportComponent;
  let fixture: ComponentFixture<ExternalTransferReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalTransferReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalTransferReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
