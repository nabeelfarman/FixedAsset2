import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NhabuldingsComponent } from './nhabuldings.component';

describe('NhabuldingsComponent', () => {
  let component: NhabuldingsComponent;
  let fixture: ComponentFixture<NhabuldingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NhabuldingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NhabuldingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
