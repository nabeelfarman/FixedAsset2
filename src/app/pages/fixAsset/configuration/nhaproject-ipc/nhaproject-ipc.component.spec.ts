import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NHAProjectIPCComponent } from './nhaproject-ipc.component';

describe('NHAProjectIPCComponent', () => {
  let component: NHAProjectIPCComponent;
  let fixture: ComponentFixture<NHAProjectIPCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NHAProjectIPCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NHAProjectIPCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
