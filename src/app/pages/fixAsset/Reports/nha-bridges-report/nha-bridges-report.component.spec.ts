import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NhaBridgesReportComponent } from './nha-bridges-report.component';

describe('NhaBridgesReportComponent', () => {
  let component: NhaBridgesReportComponent;
  let fixture: ComponentFixture<NhaBridgesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NhaBridgesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NhaBridgesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
