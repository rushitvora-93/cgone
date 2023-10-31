import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOcgmwaComponent } from './dashboard-ocgmwa.component';

describe('DashboardOcgmwaComponent', () => {
  let component: DashboardOcgmwaComponent;
  let fixture: ComponentFixture<DashboardOcgmwaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardOcgmwaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardOcgmwaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
