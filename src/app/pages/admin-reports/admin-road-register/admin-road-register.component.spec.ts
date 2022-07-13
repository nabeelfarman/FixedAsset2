import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoadRegisterComponent } from './admin-road-register.component';

describe('AdminRoadRegisterComponent', () => {
  let component: AdminRoadRegisterComponent;
  let fixture: ComponentFixture<AdminRoadRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRoadRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRoadRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
