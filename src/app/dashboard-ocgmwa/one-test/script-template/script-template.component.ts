import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-script-template',
  templateUrl: './script-template.component.html',
  styleUrls: ['./script-template.component.scss']
})
export class ScriptTemplateComponent implements OnInit {

  testScript: FormGroup;
  beginTemplate = false;
  channelsList;

  constructor(private automatorApi: AutomatorApiService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    this.testScript = new FormGroup({
      scriptName: new FormControl(''),
      channelId: new FormControl(''),
      voiceNLUSupport: new FormControl(false),
      voiceDTMFSupport: new FormControl(false),
      messageDetails: new FormArray([])
    });

    this.automatorApi. listChannels().subscribe(res => {
      this.channelsList = res;
    }, err => {

    });

    this.addResponse()
  }

  setChannel(id) {
    this.testScript.get('channelId').patchValue(id);
  }

  setDTMF(value) {
    this.testScript.get('voiceDTMFSupport').patchValue(value);
  }

  setNLU(value) {
    this.testScript.get('voiceNLUSupport').patchValue(value);
  }

  addResponse() {
    const form = this.testScript.controls.messageDetails as FormArray;
    form.push(new FormGroup({
      expectedInput: new FormControl(),
      expectedResponse: new FormControl()
    }))
  }

  saveTemplate() {
    this.automatorApi.createOnetestTemplate(this.testScript.value).subscribe(res => {
      this.toastr.success("Template successfuly created");
      this.router.navigate(['dashboard', 'onetest', 'script']);
    }, err => {
      this.toastr.error("Error occured! Try again");
    });
  }

}
