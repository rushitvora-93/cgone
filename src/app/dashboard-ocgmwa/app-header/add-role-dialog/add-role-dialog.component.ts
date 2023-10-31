import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-add-role-dialog',
  templateUrl: './add-role-dialog.component.html',
  styleUrls: ['./add-role-dialog.component.css']
})
export class AddRoleDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddRoleDialogComponent>) { }

  ngOnInit() { }

  addUserDetail(userInfo) {
    this.dialogRef.close(userInfo);
  }
  dismiss() {
    this.dialogRef.close();
  }
}
