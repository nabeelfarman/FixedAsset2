import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMachineryRegisterComponent } from './admin-machinery-register.component';

describe('AdminMachineryRegisterComponent', () => {
  let component: AdminMachineryRegisterComponent;
  let fixture: ComponentFixture<AdminMachineryRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMachineryRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMachineryRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
