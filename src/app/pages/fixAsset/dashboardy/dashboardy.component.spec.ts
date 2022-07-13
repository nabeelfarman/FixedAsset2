import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardyComponent } from './dashboardy.component';

describe('DashboardyComponent', () => {
  let component: DashboardyComponent;
  let fixture: ComponentFixture<DashboardyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
