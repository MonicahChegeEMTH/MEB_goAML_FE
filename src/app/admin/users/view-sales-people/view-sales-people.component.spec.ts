import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSalesPeopleComponent } from './view-sales-people.component';

describe('ViewSalesPeopleComponent', () => {
  let component: ViewSalesPeopleComponent;
  let fixture: ComponentFixture<ViewSalesPeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSalesPeopleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSalesPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
