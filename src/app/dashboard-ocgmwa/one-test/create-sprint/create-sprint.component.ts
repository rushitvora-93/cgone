import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { OnetestService } from 'src/app/store/service/one-test.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-create-sprint',
  templateUrl: './create-sprint.component.html',
  styleUrls: ['./create-sprint.component.scss']
})
export class CreateSprintComponent implements OnInit {

  validSprintName = false;
  createSprintStep = 0;

  testingMethods = [
    {
      id: '1',
      name: 'Load Testing',
      description: 'You provide all the details related to channels, number of call agent call type etc',
      enable: {
        setEnv: true,
        channels: true,
        channelConfig: true,
        agents: true,
        interaction: true
      }
    },
    {
      id: '2',
      name: 'Scheduled Testing',
      description: 'You provide all the details related to channels, number of call agent call type etc and set a start date. The tests will start automatically on the day',
      enable: {
        setEnv: true,
        scheduler: true,
        channels: true,
        channelConfig: true,
        agents: true,
        interaction: true
      }
    },
    {
      id: '3',
      name: 'Automatic Testing',
      description: 'You select channels and test case and perform the testing automatically. Get the results',
      enable: {
        setEnv: true,
        channels: true,
        channelConfig: true,
        agents: true,
        interaction: true
      }
    },
    {
      id: '4',
      name: 'IVR Testing',
      description: 'You select the libe and script. We will perform the IVR testing and give youreport of the IVR flow.',
      enable: {
        setEnv: true,
        ivrService: true
      }
    }
  ];

  activeTestMethod = {};

  channelList = [];

  oldchn = [
    {
      id: 11,
      name: 'Voice Inbound'
    },
    {
      id: 1,
      name: 'Voice Outbound'
    },
    {
      id: 2,
      name: 'SMS'
    },
    {
      id: 3,
      name: 'Mobile Chat'
    },
    {
      id: 4,
      name: 'Email'
    },
    {
      id: 5,
      name: 'Facebook'
    },
    {
      id: 7,
      name: 'WhatsApp'
    }
  ];

  langList = [{ id: 'english', name: 'English' }, { id: 'german', name: 'German' }];

  environmentList: any = [];
  templateList = [];
  serviceList = [];

  createSprintForm: FormGroup;
  selectChannelsForm: FormGroup;
  interactionForm: FormGroup;
  voiceBoundForm: FormGroup;
  ivrForm: FormGroup;

  isCreateBusy = false;

  scheduleMethod: number = 1;
  scheduleRepeat: number = 0;
  repeatRange = [];
  showMultipleTimePicker = false;
  showEndTimePicker = false;
  showCustomTimePicker = false;

  constructor(private automatorApi: AutomatorApiService, private onetestService: OnetestService,
    private route: Router, private toastr: ToastrService) {

    this.createSprintForm = new FormGroup({
      sprintName: new FormControl('', [Validators.required]),
      method: new FormControl('', [Validators.required]),
      channel: new FormControl('', [Validators.required]),
      environment: new FormControl('', [Validators.required])
    });

    this.selectChannelsForm = new FormGroup({
      userIdPrefix: new FormControl('', [Validators.required]),
      noOfAgents: new FormControl('', [Validators.required]),
      placePrefix: new FormControl('', [Validators.required]),
      noOfPlaces: new FormControl('', [Validators.required]),
      loginSessionDuration: new FormControl('', [Validators.required]),
      agentLogout: new FormControl(false, [Validators.required])
    });

    this.interactionForm = new FormGroup({
      maxAccepTime: new FormControl('', [Validators.required]),
      minAcceptTime: new FormControl('', [Validators.required]),
      minHandlingTime: new FormControl('', [Validators.required]),
      maxHandlingTime: new FormControl('', [Validators.required]),
      minRejectTime: new FormControl('', [Validators.required]),
      maxRejectTime: new FormControl('', [Validators.required]),
      rejectPercentage: new FormControl('', [Validators.required]),
      queue: new FormControl('', [Validators.required]),

    });

    this.voiceBoundForm = new FormGroup({
      duration: new FormControl(0),
      noOfCalls: new FormControl(0),
      selectService: new FormControl(),
      template: new FormControl()
    });

    this.ivrForm = new FormGroup({
      language: new FormControl(''),
      selectService: new FormControl(),
      script: new FormControl()
    });

    this.automatorApi.listChannels().pipe(
      switchMap((res: any) => {
        this.channelList = res;
        return this.automatorApi.getAllEnv();
      }),
      switchMap((res: any) => {
        this.environmentList = res;
        return this.automatorApi.getOneTestTemplates();
      })
    ).subscribe((res: any) => {
      this.templateList = res;
    });

  }

  ngOnInit() {
  }

  setMethod(method) {
    this.activeTestMethod = method;
    this.createSprintForm.get('method').patchValue(method.id);

    // if ivr
    if (method.id == 4) {
      this.setChannel(4);
    }
  }

  setChannel(id) {
    this.createSprintForm.get('channel').patchValue(id);
  }

  setEnvironment(id) {
    this.createSprintForm.get('environment').patchValue(id);
  }


  agentLogout() {
    this.selectChannelsForm.get('agentLogout').patchValue(!this.selectChannelsForm.value.agentLogout);
  }

  setScheduleRepeat(check, val) {
    this.scheduleRepeat = check ? val : 0;
    if (!check) {
      this.repeatRange = [];
      this.scheduleRepeat = 0;
    } else {
      this.scheduleRepeat = val;
      this.showMultipleTimePicker = true;
    }
  }
  setScheduleMethod(val) {
    if (val == this.scheduleMethod) {
      return;
    }
    this.scheduleMethod = val;
    if (val == 2) {
      this.repeatRange = [];
      this.scheduleRepeat = 0;
    }
  }

  setRepeat(isMultiple = true, date) {
    this.repeatRange = [];
    if (isMultiple && this.scheduleRepeat != 4) {
      this.showEndTimePicker = true;
    }
    this.repeatRange.push({ scheduleDate: date });
    this.showMultipleTimePicker = false;
  }

  setRepeatCustom(date) {
    if (date) {
      this.repeatRange.push({ scheduleDate: date });
    }
    this.showCustomTimePicker = false;
  }

  setRepeatEnds(stopDate) {
    this.showEndTimePicker = false;

    if (!this.repeatRange.length) {
      return;
    }
    const strip = this.repeatRange[0].scheduleDate.split('-');
    const startDate = [strip[1], strip[0], strip[2]].join('-');
    const dateArray = new Array();
    let currentDate = new Date(startDate);

    stopDate = stopDate.split('-');
    stopDate = new Date([stopDate[1], stopDate[0], stopDate[2]].join('-'));
    while (currentDate <= stopDate) {
      const date = new Date(currentDate);
      dateArray.push({ scheduleDate: [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('-') + ' ' + [date.getHours(), date.getMinutes()].join(':') });
      switch (this.scheduleRepeat) {
        case 2: currentDate.setDate(currentDate.getDate() + 7); break;
        case 3: currentDate.setMonth(currentDate.getMonth() + 1); break;
        default: currentDate.setDate(currentDate.getDate() + 1); break;
      }

    }
    this.repeatRange = dateArray;
  }

  delDate(pos) {
    this.repeatRange.splice(pos, 1);
  }

  prevStep() {
    this.createSprintStep--;
  }

  nextStep() {
    this.createSprintStep++;
  }

  get labelForSelectedChannel() {
    const selected = this.channelList.filter(item => item.id === this.createSprintForm.value.channel);
    if (selected.length) {
      return selected[0].channelName;
    } else {
      return 'Undefined';
    }
  }

  createSprint() {
    this.isCreateBusy = true;
    let channelName = this.createSprintForm.value.method;

    if (this.createSprintForm.value.method != 2) {
      this.repeatRange = [];
    }

    if (this.createSprintForm.value.method == 4) {
      channelName = 'IVR NLU';
    }

    let testType = 'Load Testing';
    switch (this.createSprintForm.value.method) {
      case '2': testType = 'Scheduled Testing'; break;
      case '3': testType = 'Automatic Testing'; break;
      case '4': testType = 'IVR Testing'; break;
    }

    this.automatorApi.createOneTestSprint({
      "channels": {
        "channelDetails": {
          "voiceInbound": this.voiceBoundForm.value,
          "ivrNlu": this.ivrForm.value
        },
        "channelName": channelName,
        "channelId": this.createSprintForm.value.channel
      },
      "completedOn": "string",
      "sprintName": this.createSprintForm.value.sprintName,
      "testType": testType,
      "createdOn": "string",
      "id": this.createSprintForm.value.environment,
      "agetDetails": this.selectChannelsForm.value,
      "interactionDetails": [
        {
          ...this.interactionForm.value
        }
      ],
      "scheduleDateTime": this.repeatRange
    }).subscribe(res => {
      this.isCreateBusy = false;
      // this.onetestService.addSprint();
      this.toastr.success("Sprint successfuly created");
      this.route.navigateByUrl('/dashboard/onetest/sprint/' + res + '?testType=' + testType);
    }, err => {
      this.toastr.error("Error while creating sprint");
      this.isCreateBusy = false;
    });
  }

}
