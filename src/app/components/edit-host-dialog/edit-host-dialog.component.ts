import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Host } from '../../models/host';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {AutomatorApiService} from '../../services/automator-api.service';
@Component({
  selector: 'app-edit-host-dialog',
  templateUrl: './edit-host-dialog.component.html',
  styleUrls: ['./edit-host-dialog.component.css']
})
export class EditHostDialogComponent implements OnInit {

  form: FormGroup;
  osTypes = [];
  sc = [];
  constructor(
    private fb: FormBuilder,
    private automatorApi: AutomatorApiService,
    public dialogRef: MatDialogRef<EditHostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Host) {
      console.log('host id', data.hostId);
      this.form = fb.group({
        hostName: [data.hostName, Validators.required],
        ip: [data.ip, Validators.required],
        osType: [data.osType, Validators.required],
        version: [data.version, Validators.required],
        lcaPort: [data.lcaPort, Validators.required],
        solutionControlCenter: [data.solutionControlCenter, Validators.required],
        startUpFlag: [data.startUpFlag],
        state: [data.state]
    });
  }
  update() {
    // console.log(this.form.value);
    this.dialogRef.close(this.form.value);
  }
  close() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.automatorApi.getHostInfo(this.data.hostId)
    .subscribe(resp=>{
      this.form.get('hostName').setValue(resp.hostName);
      this.form.get('ip').setValue(resp.ip);
      this.form.get('osType').setValue(resp.osType);
      this.form.get('version').setValue(resp.version);
      this.form.get('lcaPort').setValue(resp.lcaPort);
      this.form.get('solutionControlCenter').setValue(resp.solutionControlCenter);
      this.form.get('startUpFlag').setValue(resp.startUpFlag);
      this.form.get('state').setValue(resp.state);
    })
    this.automatorApi.getAllOSType().subscribe(response => {
      this.osTypes = response.list;
    });

    this.automatorApi.getAllSC().subscribe(response => {
      this.sc = response.list;
    });
  }
}
