import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockaccountComponent } from './lockaccount.component';

describe('LockaccountComponent', () => {
  let component: LockaccountComponent;
  let fixture: ComponentFixture<LockaccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LockaccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LockaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
