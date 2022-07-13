import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLandRegisterComponent } from './admin-land-register.component';

describe('AdminLandRegisterComponent', () => {
  let component: AdminLandRegisterComponent;
  let fixture: ComponentFixture<AdminLandRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLandRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLandRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
