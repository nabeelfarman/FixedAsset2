import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetRegisterRptComponent } from './asset-register-rpt.component';

describe('AssetRegisterRptComponent', () => {
  let component: AssetRegisterRptComponent;
  let fixture: ComponentFixture<AssetRegisterRptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetRegisterRptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetRegisterRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
