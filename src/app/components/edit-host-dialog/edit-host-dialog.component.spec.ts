import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHostDialogComponent } from './edit-host-dialog.component';

describe('HostDialogComponent', () => {
  let component: EditHostDialogComponent;
  let fixture: ComponentFixture<EditHostDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHostDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHostDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
