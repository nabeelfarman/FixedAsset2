import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NHAProjectsComponent } from './nhaprojects.component';

describe('NHAProjectsComponent', () => {
  let component: NHAProjectsComponent;
  let fixture: ComponentFixture<NHAProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NHAProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NHAProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
