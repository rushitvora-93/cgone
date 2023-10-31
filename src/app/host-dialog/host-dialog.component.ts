import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Host } from '../models/host';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {AutomatorApiService} from '../services/automator-api.service';
@Component({
  selector: 'app-host-dialog',
  templateUrl: './host-dialog.component.html',
  styleUrls: ['./host-dialog.component.css']
})
export class HostDialogComponent implements OnInit {

  form: FormGroup;
  osTypes = [];
  sc = [];
  constructor(
    private fb: FormBuilder,
    private automatorApi: AutomatorApiService,
    public dialogRef: MatDialogRef<HostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) {hostName, ip,username,password, osType, version, lcaPort, solutionControlCenter, startUpflag, state}: Host) {
      // console.log('Data Injected popup Open>>', hostName, ip, osType, version, lcaPort, solutionControlCenter);
      this.form = fb.group({
        hostName: [hostName, Validators.required],
        ip: [ip, Validators.required],
        username: [username],
        password: [password],
        osType: [osType, Validators.required],
        version: [version, Validators.required],
        lcaPort: [lcaPort, Validators.required],
        solutionControlCenter: [solutionControlCenter, Validators.required],
        startUpflag: [startUpflag],
        state: [state]
    });
  }
  save() {
    // console.log(this.form.value);
    this.dialogRef.close(this.form.value);
  }
  close() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.automatorApi.getAllOSType().subscribe(response => {
      this.osTypes = response.list;
    });

    this.automatorApi.getAllSC().subscribe(response => {
      this.sc = response.list;
    });
  }
}
