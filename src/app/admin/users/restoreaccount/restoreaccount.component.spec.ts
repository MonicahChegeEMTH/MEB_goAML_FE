import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoreaccountComponent } from './restoreaccount.component';

describe('RestoreaccountComponent', () => {
  let component: RestoreaccountComponent;
  let fixture: ComponentFixture<RestoreaccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestoreaccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoreaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
