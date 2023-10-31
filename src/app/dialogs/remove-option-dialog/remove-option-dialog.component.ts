import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AutomatorApiService } from '../../services/automator-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-remove-option-dialog',
  templateUrl: './remove-option-dialog.component.html',
  styleUrls: ['./remove-option-dialog.component.css']
})
export class RemoveOptionDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RemoveOptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public apiService: AutomatorApiService,
    private toastr: ToastrService) { }

  ngOnInit() {
    console.log('data', this.data);
  }

  public deleteOption() {
      this.toastr.success(`Option ${this.data.optionName} deleted`);
      this.dialogRef.close('deleted');
  }

  public onCancel() {
    this.dialogRef.close('cancel');
  }

  public dismiss() {
    this.dialogRef.close('cancel');
  }
}
