import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-connected-server-dialog',
  templateUrl: './add-connected-server-dialog.component.html',
  styleUrls: ['./add-connected-server-dialog.component.css']
})
export class AddConnectedServerDialogComponent implements OnInit {

  public connectedServer: any = {};
  checked = false;
  env: any = {}
  constructor(public dialogRef: MatDialogRef<AddConnectedServerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }



  ngOnInit() { }



  saveConnectedServer(form) {
    this.connectedServer.appServerId = 0;
    this.connectedServer.id = 0;
    this.dialogRef.close(this.connectedServer);
  }


  cancelIgnoreList() {
    this.dialogRef.close(false);
  }
}
