import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWigetsComponent } from './user-wigets.component';

describe('UserWigetsComponent', () => {
  let component: UserWigetsComponent;
  let fixture: ComponentFixture<UserWigetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserWigetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWigetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
