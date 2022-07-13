import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NHALocComponent } from './nhaloc.component';

describe('NHALocComponent', () => {
  let component: NHALocComponent;
  let fixture: ComponentFixture<NHALocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NHALocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NHALocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
