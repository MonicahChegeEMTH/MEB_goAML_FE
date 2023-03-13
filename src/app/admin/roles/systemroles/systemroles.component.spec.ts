import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemrolesComponent } from './systemroles.component';

describe('SystemrolesComponent', () => {
  let component: SystemrolesComponent;
  let fixture: ComponentFixture<SystemrolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemrolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemrolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
