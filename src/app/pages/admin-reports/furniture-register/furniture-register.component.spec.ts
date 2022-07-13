import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FurnitureRegisterComponent } from './furniture-register.component';

describe('FurnitureRegisterComponent', () => {
  let component: FurnitureRegisterComponent;
  let fixture: ComponentFixture<FurnitureRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FurnitureRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FurnitureRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
