import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BridgesComponent } from './bridges.component';

describe('BridgesComponent', () => {
  let component: BridgesComponent;
  let fixture: ComponentFixture<BridgesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BridgesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BridgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
