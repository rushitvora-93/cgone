import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPermissionComponent } from './audit-permission.component';

describe('AuditPermissionComponent', () => {
  let component: AuditPermissionComponent;
  let fixture: ComponentFixture<AuditPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
