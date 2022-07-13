import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterVehicleRptComponent } from './register-vehicle-rpt.component';

describe('RegisterVehicleRptComponent', () => {
  let component: RegisterVehicleRptComponent;
  let fixture: ComponentFixture<RegisterVehicleRptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterVehicleRptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterVehicleRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
