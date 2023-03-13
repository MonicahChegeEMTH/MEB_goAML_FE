import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockaccountComponent } from './unlockaccount.component';

describe('UnlockaccountComponent', () => {
  let component: UnlockaccountComponent;
  let fixture: ComponentFixture<UnlockaccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnlockaccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlockaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
