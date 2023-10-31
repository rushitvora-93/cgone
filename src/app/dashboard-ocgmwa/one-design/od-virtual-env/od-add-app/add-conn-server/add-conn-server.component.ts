import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-conn-server',
  templateUrl: './add-conn-server.component.html',
  styleUrls: ['./add-conn-server.component.scss']
})
export class AddConnServerComponent implements OnInit {
  addServerForm: FormGroup;

  constructor(private automatorApi: AutomatorApiService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddConnServerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.addServerForm = new FormGroup({
      appServerName: new FormControl('', [Validators.required]),
      connProtocol: new FormControl(),
      id: new FormControl(0),
      mode: new FormControl(),
      timeoutLocal: new FormControl(),
      timeoutRemote: new FormControl(),
    });
  }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.addServerForm.value);
  }

}
