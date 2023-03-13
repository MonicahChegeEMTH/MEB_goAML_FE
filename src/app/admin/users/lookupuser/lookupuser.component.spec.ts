import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupuserComponent } from './lookupuser.component';

describe('LookupuserComponent', () => {
  let component: LookupuserComponent;
  let fixture: ComponentFixture<LookupuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LookupuserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
