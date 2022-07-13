import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetToBeCreateComponent } from './asset-to-be-create.component';

describe('AssetToBeCreateComponent', () => {
  let component: AssetToBeCreateComponent;
  let fixture: ComponentFixture<AssetToBeCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetToBeCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetToBeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
