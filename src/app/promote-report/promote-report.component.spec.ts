import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoteReportComponent } from './promote-report.component';

describe('PromoteReportComponent', () => {
  let component: PromoteReportComponent;
  let fixture: ComponentFixture<PromoteReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoteReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
