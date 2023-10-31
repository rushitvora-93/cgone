import { Component, OnInit } from '@angular/core';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-od-create-env',
  templateUrl: './od-create-env.component.html',
  styleUrls: ['./od-create-env.component.scss']
})
export class OdCreateEnvComponent implements OnInit {
  createEnvForm: FormGroup;
  toggleChannelForm = false;
  channelVol = [];
  channelNameControl: FormControl = new FormControl();
  channelVolControl: FormControl = new FormControl();

  constructor(private automatorApi: AutomatorApiService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<OdCreateEnvComponent>) {
    this.createEnvForm = new FormGroup({
      envName: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      host: new FormControl('', [Validators.required]),
      port: new FormControl('', [Validators.required]),
      logdbUsername: new FormControl('', [Validators.required]),
      logdbPassword: new FormControl('', [Validators.required]),
      serviceName: new FormControl('', [Validators.required]),
      database: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
  }

  addChannel() {
    this.channelVol.push({
      channel: this.channelNameControl.value,
      volume: this.channelVolControl.value
    });

    this.channelNameControl.patchValue('');
    this.channelVolControl.patchValue('');
    this.toggleChannelForm = false;
  }

  delChannel(pos) {
    this.channelVol.splice(pos, 1);
  }

  create() {
    this.automatorApi.createNewEnv({ ...this.createEnvForm.value, channelVol: this.channelVol })
      .subscribe(res => {
        this.dialogRef.close(true);
        this.toastr.success(
          "New Environment Created Successfully...",
          "Success!"
        );
      }, err => {
        this.toastr.error(
          "Failed to process your request. Please check inputs and try again.",
          "Error!"
        );
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
