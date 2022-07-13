import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NHARoadsComponent } from './nharoads.component';

describe('NHARoadsComponent', () => {
  let component: NHARoadsComponent;
  let fixture: ComponentFixture<NHARoadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NHARoadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NHARoadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
