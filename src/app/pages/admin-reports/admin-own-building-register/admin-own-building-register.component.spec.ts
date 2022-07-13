import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOwnBuildingRegisterComponent } from './admin-own-building-register.component';

describe('AdminOwnBuildingRegisterComponent', () => {
  let component: AdminOwnBuildingRegisterComponent;
  let fixture: ComponentFixture<AdminOwnBuildingRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOwnBuildingRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOwnBuildingRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
