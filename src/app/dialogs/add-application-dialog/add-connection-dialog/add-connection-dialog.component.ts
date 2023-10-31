import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-connection-dialog',
  templateUrl: './add-connection-dialog.component.html',
  styleUrls: ['./add-connection-dialog.component.css']
})
export class AddConnectionDialogComponent implements OnInit {

  public availableServers;
  public connectedServers;

  constructor(public dialogRef: MatDialogRef<AddConnectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.availableServers = this.data.availableServers.map(server => Object.assign({}, server, {
      isChecked: this.isServerSelected(server)
    }));
  }

  public isServerSelected(server) {
    return this.data.connectedServers.find(
      connectedServer => connectedServer.appId === server.appId);
  }

  public onSave(formValues) {

    const connectedTo = Object.keys(formValues).map(key => {
      const value = formValues[key];
      if (value) {
        return parseInt(key, 0);
      }
    }).filter(s => s > 0);

    this.dialogRef.close({
      connectedServersIds: connectedTo,
      connectedServers: this.data.availableServers.filter(
        server => connectedTo.includes(server.appId))
        .map(server => Object.assign({}, {
          localTimeout: 30,
          remoteTimeout: 60,
          mode: 'CFGTMNoTraceMode',
          type: 'default',
          connectionProtocol: 'addp'
        }, server))
    });
  }

  public onCancel() {
    this.dialogRef.close('cancel');
  }

  public dismiss() {
    this.dialogRef.close('cancel');
  }
}
