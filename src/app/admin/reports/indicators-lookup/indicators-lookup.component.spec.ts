import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorsLookupComponent } from './indicators-lookup.component';

describe('IndicatorsLookupComponent', () => {
  let component: IndicatorsLookupComponent;
  let fixture: ComponentFixture<IndicatorsLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorsLookupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorsLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
