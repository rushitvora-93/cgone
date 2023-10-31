import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AutomatorApiService } from '../../services/automator-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-option-dialog',
  templateUrl: './add-option-dialog.component.html',
  styleUrls: ['./add-option-dialog.component.css']
})
export class AddOptionDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddOptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public apiService: AutomatorApiService,
    private toastr: ToastrService) { }

  ngOnInit() {
    console.log('data', this.data);
  }

  public addOption(formValues) {
      console.log('values', formValues);

      const key = formValues.key;

      console.log(this.data.existingOptions);
      const existingOption = this.data.existingOptions.filter(o => o.key === key);

      if (existingOption && existingOption.length > 0) {
        this.toastr.error(`Key ${key} already exists`);
      } else {
        this.dialogRef.close(formValues);
      }
  }

  public onCancel() {
    this.dialogRef.close('cancel');
  }

  public dismiss() {
    this.dialogRef.close('cancel');
  }
}
