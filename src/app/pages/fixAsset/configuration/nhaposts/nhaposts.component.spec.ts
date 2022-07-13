import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NHAPostsComponent } from './nhaposts.component';

describe('NHAPostsComponent', () => {
  let component: NHAPostsComponent;
  let fixture: ComponentFixture<NHAPostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NHAPostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NHAPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
