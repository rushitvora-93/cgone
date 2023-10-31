import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ChangePasswordDialogComponent>) { }

  ngOnInit() {
  }

  changePasswordDetail(userInfo) {
    this.dialogRef.close(userInfo);
  }

  dismiss() {
    this.dialogRef.close();
  }

}
