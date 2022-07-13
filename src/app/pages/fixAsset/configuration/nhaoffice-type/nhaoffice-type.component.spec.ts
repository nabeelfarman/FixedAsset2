import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NHAOfficeTypeComponent } from './nhaoffice-type.component';

describe('NHAOfficeTypeComponent', () => {
  let component: NHAOfficeTypeComponent;
  let fixture: ComponentFixture<NHAOfficeTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NHAOfficeTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NHAOfficeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
