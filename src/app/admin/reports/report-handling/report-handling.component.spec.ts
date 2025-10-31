import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportHandlingComponent } from './report-handling.component';

describe('ReportHandlingComponent', () => {
  let component: ReportHandlingComponent;
  let fixture: ComponentFixture<ReportHandlingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportHandlingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportHandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
