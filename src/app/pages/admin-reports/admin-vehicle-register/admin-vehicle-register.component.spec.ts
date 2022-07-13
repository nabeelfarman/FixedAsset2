import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVehicleRegisterComponent } from './admin-vehicle-register.component';

describe('AdminVehicleRegisterComponent', () => {
  let component: AdminVehicleRegisterComponent;
  let fixture: ComponentFixture<AdminVehicleRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminVehicleRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVehicleRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
