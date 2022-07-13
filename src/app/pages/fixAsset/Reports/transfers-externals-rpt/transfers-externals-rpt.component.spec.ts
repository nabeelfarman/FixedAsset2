import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfersExternalsRptComponent } from './transfers-externals-rpt.component';

describe('TransfersExternalsRptComponent', () => {
  let component: TransfersExternalsRptComponent;
  let fixture: ComponentFixture<TransfersExternalsRptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfersExternalsRptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfersExternalsRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
