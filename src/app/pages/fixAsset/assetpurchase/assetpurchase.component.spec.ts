import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetpurchaseComponent } from './assetpurchase.component';

describe('AssetpurchaseComponent', () => {
  let component: AssetpurchaseComponent;
  let fixture: ComponentFixture<AssetpurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetpurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetpurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
