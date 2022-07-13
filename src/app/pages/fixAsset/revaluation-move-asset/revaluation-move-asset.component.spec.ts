import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevaluationMoveAssetComponent } from './revaluation-move-asset.component';

describe('RevaluationMoveAssetComponent', () => {
  let component: RevaluationMoveAssetComponent;
  let fixture: ComponentFixture<RevaluationMoveAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevaluationMoveAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevaluationMoveAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
