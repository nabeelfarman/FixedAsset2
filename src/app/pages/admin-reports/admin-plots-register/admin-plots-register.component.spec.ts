import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPlotsRegisterComponent } from './admin-plots-register.component';

describe('AdminPlotsRegisterComponent', () => {
  let component: AdminPlotsRegisterComponent;
  let fixture: ComponentFixture<AdminPlotsRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPlotsRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPlotsRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
