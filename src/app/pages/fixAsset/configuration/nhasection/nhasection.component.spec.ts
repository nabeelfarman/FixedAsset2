import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NHASectionComponent } from './nhasection.component';

describe('NHASectionComponent', () => {
  let component: NHASectionComponent;
  let fixture: ComponentFixture<NHASectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NHASectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NHASectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
