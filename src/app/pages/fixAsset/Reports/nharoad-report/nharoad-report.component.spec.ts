import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NharoadReportComponent } from './nharoad-report.component';

describe('NharoadReportComponent', () => {
  let component: NharoadReportComponent;
  let fixture: ComponentFixture<NharoadReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NharoadReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NharoadReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
