import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivilegesLookupComponent } from './privileges-lookup.component';

describe('PrivilegesLookupComponent', () => {
  let component: PrivilegesLookupComponent;
  let fixture: ComponentFixture<PrivilegesLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivilegesLookupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivilegesLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
