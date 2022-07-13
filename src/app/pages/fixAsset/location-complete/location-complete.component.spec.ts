import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationCompleteComponent } from './location-complete.component';

describe('LocationCompleteComponent', () => {
  let component: LocationCompleteComponent;
  let fixture: ComponentFixture<LocationCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
