import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedusersComponent } from './uploadedusers.component';

describe('UploadedusersComponent', () => {
  let component: UploadedusersComponent;
  let fixture: ComponentFixture<UploadedusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadedusersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadedusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
