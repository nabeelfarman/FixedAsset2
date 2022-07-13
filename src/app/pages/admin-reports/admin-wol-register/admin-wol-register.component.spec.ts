import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWolRegisterComponent } from './admin-wol-register.component';

describe('AdminWolRegisterComponent', () => {
  let component: AdminWolRegisterComponent;
  let fixture: ComponentFixture<AdminWolRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminWolRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminWolRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
