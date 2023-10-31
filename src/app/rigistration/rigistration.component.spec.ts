import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RigistrationComponent } from './rigistration.component';

describe('RigistrationComponent', () => {
  let component: RigistrationComponent;
  let fixture: ComponentFixture<RigistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RigistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RigistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
