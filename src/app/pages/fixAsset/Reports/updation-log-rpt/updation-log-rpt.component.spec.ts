import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdationLogRptComponent } from './updation-log-rpt.component';

describe('UpdationLogRptComponent', () => {
  let component: UpdationLogRptComponent;
  let fixture: ComponentFixture<UpdationLogRptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdationLogRptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdationLogRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
