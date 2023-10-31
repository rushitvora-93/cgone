import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AutomatorApiService } from '../../services/automator-api.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-section-dialog',
  templateUrl: './add-section-dialog.component.html',
  styleUrls: ['./add-section-dialog.component.css']
})
export class AddSectionDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddSectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public apiService: AutomatorApiService,
    private toastr: ToastrService) {
    this.formGroup = new FormGroup({
      section: new FormControl(),
      key: new FormControl(),
      value: new FormControl(),
    })
  }

  ngOnInit() {
  }

  public addSection() {
    this.dialogRef.close(this.formGroup.value);
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
