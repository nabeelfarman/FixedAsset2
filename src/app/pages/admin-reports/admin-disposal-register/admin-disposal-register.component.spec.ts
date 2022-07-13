import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDisposalRegisterComponent } from './admin-disposal-register.component';

describe('AdminDisposalRegisterComponent', () => {
  let component: AdminDisposalRegisterComponent;
  let fixture: ComponentFixture<AdminDisposalRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDisposalRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDisposalRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
