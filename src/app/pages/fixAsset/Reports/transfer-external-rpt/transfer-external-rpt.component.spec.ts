import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferExternalRptComponent } from './transfer-external-rpt.component';

describe('TransferExternalRptComponent', () => {
  let component: TransferExternalRptComponent;
  let fixture: ComponentFixture<TransferExternalRptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferExternalRptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferExternalRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
