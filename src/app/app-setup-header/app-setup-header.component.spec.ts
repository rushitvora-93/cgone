import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSetupHeaderComponent } from './app-setup-header.component';

describe('AppHeaderComponent', () => {
  let component: AppSetupHeaderComponent;
  let fixture: ComponentFixture<AppSetupHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppSetupHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSetupHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
