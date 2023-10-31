import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrls: ['./new-user-dialog.component.css']
})
export class NewUserDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NewUserDialogComponent>) { }

  ngOnInit() {
  }

  addUserDetail(userInfo) {
    this.dialogRef.close(userInfo);
  }

  dismiss() {
    this.dialogRef.close();
  }

}
