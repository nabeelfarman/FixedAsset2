import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeEquipmentRegisterComponent } from './office-equipment-register.component';

describe('OfficeEquipmentRegisterComponent', () => {
  let component: OfficeEquipmentRegisterComponent;
  let fixture: ComponentFixture<OfficeEquipmentRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficeEquipmentRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeEquipmentRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
