import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { AutomatorApiService } from '../services/automator-api.service';
// import { get } from 'lodash';
import _ from 'underscore';
import { ToastrService } from 'ngx-toastr';
import * as JSZipUtils from 'jszip-utils';
import * as JSZip from 'jszip';
import docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-promot-environment-wizard',
  templateUrl: './promot-environment-wizard.component.html',
  styleUrls: ['./promot-environment-wizard.component.css']
})
export class PromotEnvironmentWizardComponent implements OnInit {
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  selectPromoteType: FormGroup;
  environments: any;
  editMode: Boolean;
  editMode1 = false;
  promoteAppList: any = [];
  visiblePromoteAppList: any = [];
  hostIdNameMapping: any = [];
  promoteAppConfigList = [];
  configureAppList: any = [];
  visibleConfigureAppList: any = [];
  configurationAppConfigList: any = [];
  step5PromoteList: any = [];
  step4CombinedList: any = [];
  setp5ConfigurationList: any = [];
  name = 'Document download';
  // URL = 'http://localhost:4200/assets/templates/template2.docx';
  URL = 'assets/templates/template2.docx';
  secondStepSelectedValue: any;
  selectedItemsArray = { promotelist: [], configurationList: [] };
  selectPromoter = [];
  comparisonCtrl = { showComparison: false };

  fromDate: any;
  fromHour: any;
  fromMinute: any;
  fromSecond: any;
  toDate: any;
  toHour: any;
  toMinute: any;
  toSecond: any;
  hourList = [];
  minuteList = [];

  searchObjectName = '';
  searchObjectType = '';
  searchUserName = '';

  selectedEnvironmentID: number;
  selectedValue = [];
  selectPromoteTypeList = [{
    id: 1,
    value: 'App Promote'
  }, {
    id: 2,
    value: 'Configuration Promote'
  }];
  selectedHost: any;
  showComparsion = false;

  constructor(
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private automatorApi: AutomatorApiService) {

    const date = new Date();
    this.fromDate = date;
    this.toDate = date;
    this.fromHour = date.getHours() - 1;
    this.toHour = date.getHours();
    this.fromMinute = date.getMinutes();
    this.toMinute = date.getMinutes();
    this.fromSecond = 0;
    this.toSecond = 59;

    for (let i = 1; i <= 24; i++) {
      this.hourList.push(i);
    }
    for (let i = 1; i <= 59; i++) {
      this.minuteList.push(i);
    }
  }

  get firstCtrl() {
    return this.firstFormGroup.get('firstCtrl');
  }



  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: []
    });

    this.selectPromoteType = this._formBuilder.group({
      selectPromote: ['', Validators.required],
      selectDuration: ['', Validators.required],
    });
    // getEnvironmentListOnPromote();
    this.automatorApi.getEnvironmentListOnPromote().subscribe(result => {
      this.environments = result;
      // console.log(result);
    });
  }

  getHostNameMapping() {
    // getHostNames
    this.automatorApi.getHostName(this.firstFormGroup.value.firstCtrl).subscribe(
      hostname => {
        this.hostIdNameMapping = hostname;
        // console.log(this.hostIdNameMapping);
      });
  }
  next2(stepper: MatStepper) {
    stepper.next();
  }
  SelectPromoteType(event: any, id: number) {
    console.log("val " + this.selectPromoteType.controls['selectPromote'].value);
    if (this.selectPromoteType.controls['selectPromote'].value) {
      const obj = { key: id };
      this.selectPromoter.push(obj);
    } else {
      const item = _.findWhere(this.selectPromoter, { key: id });
      if (item) {
        this.selectPromoter = _.without(this.selectPromoter, item);
      }
    }
    this.selectedItemsArray = { promotelist: [], configurationList: [] };

  }
  next3(stepper: MatStepper) {
    if (this.selectPromoter.length > 0) {
      const from = new Date(this.fromDate).getDate() +
        '-' + (new Date(this.fromDate).getMonth() + 1) +
        '-' + new Date(this.fromDate).getFullYear() +
        ' ' + this.fromHour +
        ':' + this.fromMinute +
        ':' + this.fromSecond;
      const to = new Date(this.toDate).getDate() +
        '-' + (new Date(this.toDate).getMonth() + 1) +
        '-' + new Date(this.toDate).getFullYear() +
        ' ' + this.toHour +
        ':' + this.toMinute +
        ':' + this.toSecond;
      const data = {
        'toDate': to.toString(),
        'fromDate': from.toString()
      };
      this.promoteAppList = [];
      this.visiblePromoteAppList = [];
      this.configureAppList = [];
      this.visibleConfigureAppList = [];
      this.searchObjectName = '';
      this.searchObjectType = '';
      this.searchUserName = '';
      for (let i = 0; i < this.selectPromoter.length; i++) {
        if (this.selectPromoter[i].key === 1) {
          if (this.firstFormGroup.value.firstCtrl) {
            this.automatorApi
              .getPromoteAppList(this.firstFormGroup.value.firstCtrl, data)
              .subscribe(result => {
                this.promoteAppList = result || [];
                this.filterApplicationList();
                this.getHostNameMapping();
              });
          }
        } else if (this.selectPromoter[i].key === 2) {
          this.automatorApi
            .getConfigurePromoteList(this.firstFormGroup.value.firstCtrl, data)
            .subscribe(result => {
              this.configureAppList = result || [];
              this.filterApplicationList();
            });
        }
      }
      // this.getHostNameMapping();
      stepper.next();
    }
  }

  filterApplicationList() {
    this.visiblePromoteAppList = this.promoteAppList
      .filter(app => {
        let filter = true;
        if (this.searchObjectName) {
          const appName = app.config.appName;
          filter = appName.toLowerCase().includes(this.searchObjectName.toLowerCase());
        }
        if (filter && this.searchObjectType) {
          const objectType = 'application';
          filter = objectType.toLowerCase().includes(this.searchObjectType.toLowerCase());
        }
        if (filter && this.searchUserName) {
          const appUser = app.user;
          filter = appUser.toLowerCase().includes(this.searchUserName.toLowerCase());
        }
        return filter;
      });
    this.visibleConfigureAppList = this.configureAppList
      .filter(app => {
        let filter = true;
        if (this.searchObjectName) {
          const appName = app.objectName;
          filter = appName.toLowerCase().includes(this.searchObjectName.toLowerCase());
        }
        if (filter && this.searchObjectType) {
          const objectType = this.removeCFG(app.objectType);
          filter = objectType.toLowerCase().includes(this.searchObjectType.toLowerCase());
        }
        if (filter && this.searchUserName) {
          const appUser = app.user;
          filter = appUser.toLowerCase().includes(this.searchUserName.toLowerCase());
        }
        return filter;
      });
  }

  SelectApplication(event: any, id: number, eventlist: string) {
    console.log("val " + this.secondFormGroup.controls['secondCtrl'].value);
    if (this.secondFormGroup.controls['secondCtrl'].value) {
      const obj = { key: id };
      this.selectedItemsArray[eventlist].push(obj);
    } else {
      const item = _.findWhere(this.selectedItemsArray[eventlist], { key: id });
      if (item) {
        this.selectedItemsArray[eventlist] = _.without(this.selectedItemsArray[eventlist], item);
      }
    }
  }

  SelectApplicationNew(event: any, id: number, objectType: string, eventlist: string) {
    if (event.checked) {
      const obj = { key: id, objectType: objectType };
      this.selectedItemsArray[eventlist].push(obj);
    } else {
      const item = _.findWhere(this.selectedItemsArray[eventlist], { key: id, objectType: objectType });
      if (item) {
        this.selectedItemsArray[eventlist] = _.without(this.selectedItemsArray[eventlist], item);
      }
    }
  }

  next4(stepper: MatStepper) {
    this.promoteAppConfigList = [];
    this.configurationAppConfigList = [];
    if (this.selectedItemsArray.promotelist.length > 0) {
      const itemsArray = _.pluck(this.selectedItemsArray.promotelist, 'key');
      this.automatorApi.postPromoteAppConfig(itemsArray).subscribe(result => {
        this.promoteAppConfigList = this.mapListHostId(result);
        this.editMode = true;

        //  for(var i =0;i<this.promoteAppConfigList.length;i++){
        //    let obj = this.promoteAppConfigList[i];
        //    if(obj.hasOwnProperty('hostId')){
        //     obj['selectedHostName'] =  _.findWhere(obj.HostName,{
        //           hostId : obj.hostId
        //         });
        //         obj['selectedHostName'] = obj['selectedHostName'] == undefined ? obj.HostName[0].hostName : obj['selectedHostName'].hostName;
        //     }
        //  }
        this.combineListFormation();

      });
    }
    if (this.selectedItemsArray.configurationList.length > 0) {
      const configList = [];
      this.selectedItemsArray.configurationList.forEach(item => {
        const obj = {
          'dbId': item['key'],
          'objectType': item['objectType']
        };
        configList.push(obj);
      });

      this.automatorApi.postConfigurationAppConfig(configList, this.firstFormGroup.value.firstCtrl).subscribe(result => {
        this.configurationAppConfigList = result;
        this.editMode = true;
        this.combineListFormation();
      });

    }

    stepper.next();

  }

  combineListFormation() {
    if (this.configurationAppConfigList.length > 0 && this.promoteAppConfigList.length > 0) {
      this.step4CombinedList = [];
      this.step4CombinedList = this.modifyArrayElements(this.step4CombinedList, this.promoteAppConfigList);
      this.step4CombinedList = this.modifyArrayElements(this.step4CombinedList, this.configurationAppConfigList);
    }
  }

  modifyArrayElements(callback, fullArr) {
    for (let i = 0; i < fullArr.length; i++) {
      callback.push(fullArr[i]);
    }
    return callback;
  }

  mapListHostId(list) {

    for (const key in list) {
      list[key]['HostName'] = this.hostIdNameMapping;
      list[key]['selectedHostId'] = _.findWhere(this.hostIdNameMapping, {
        hostId: list.hostId
      });
    }

    return list;
  }
  Next5CombineItems(callback: any) {
    if (callback.PromoteType.length > 0) {
      callback.PromoteType.forEach(element => {
        element.hostId = element.selectedHostId !== undefined ? element.selectedHostId : this.hostIdNameMapping[0].hostId;
      });
    }
    this.step5PromoteList = callback.PromoteType;

    this.setp5ConfigurationList = callback.ConfigurationType;
    // console.log(callback);

    // alter your code according to the JSON.
  }

  next5(event: any) {
    this.setp5ConfigurationList = [];
    this.step5PromoteList = [];
    if (event.key === 'ConfigurationType') {
      this.setp5ConfigurationList = event.value;
      this.editMode = false;
      event.moveNext.next();

    } else if (event.key === 'PromoteType') {
      this.editMode = false;
      for (const key in event.value) {
        event.value[key].hostId = event.value[key].HostName.selectedHostId !== undefined ? event.value[key].HostName.selectedHostId : this.hostIdNameMapping[0].hostId;
      }
      this.step5PromoteList = event.value;
      event.moveNext.next();
      // this.JSONToCSVConvertor(this.step5PromoteList,'Final_PromoteList',true);
      // console.log('promoteList', this.step5PromoteList);
      // this.download2(this.step5PromoteList);
    }
  }
  backStep(stepper: MatStepper) {
    stepper.previous();
  }

  downloadPromote() {
    const config = {};
    config['objectConfig'] = [];
    config['appConfig'] = this.step5PromoteList;
    this.download2(config);
  }

  downloadConguration() {
    const config = {};
    config['objectConfig'] = this.setp5ConfigurationList;
    config['appConfig'] = [];
    this.download2(config);
  }

  downloadPromoteAsWellAsConfiguration() {
    const config = {};
    config['objectConfig'] = this.setp5ConfigurationList;
    config['appConfig'] = this.step5PromoteList;
    this.download2(config);
  }

  removeCFG(objectType) {
    if (objectType && objectType.substring(0, 3) === 'CFG') {
      return objectType.substring(3);
    }
    return '';
  }

  finalSubmission(stepper: MatStepper) {
    console.log(this.step5PromoteList);
    return;
    this.automatorApi.postFinalPromoteList(this.step5PromoteList, this.firstFormGroup.value.firstCtrl).
      subscribe(result => {
        if (result) {
          this.toastr.success('Your Request Saved', 'Success!');
          // //this.dialogRef.close();
          stepper.reset();

        }

      }, err => {
        this.toastr.error('Your Request Not Saved', 'Error!');
      });

    // if (this.step5PromoteList.length > 0) {
    //     this.step5PromoteList.forEach(element => {
    //       element.hostId=element.selectedHostId
    //        if (element.hasOwnProperty('selectedHostId')) {
    //           delete element.selectedHostId;
    //        }
    //     });
    //     // console.log(this.step5PromoteList);
    //     // return;
    //   this.automatorApi.postFinalPromoteList(this.step5PromoteList, this.firstFormGroup.value.firstCtrl).
    //   subscribe(result => {
    //     if (result) {
    //       this.toastr.success('Your Request Saved', 'Success!');
    //       //this.dialogRef.close();
    //       // stepper.reset();

    //     }

    //    });
    // }
    //   if (this.setp5ConfigurationList.length > 0) {
    //     this.automatorApi.postFinalConfigurationList(this.setp5ConfigurationList, this.firstFormGroup.value.firstCtrl).
    //     subscribe(result => {
    //       // this.toastr.success('Your Request Saved', 'Success!');
    //     } ,err=>{
    //       console.log(err);
    //     });
    //     //this.dialogRef.close();
    //   //  stepper.reset();
    // }
  }



  findIndexToUpdate(type) {
    return type.appId === this;
  }

  JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    const arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;
    let CSV = '';
    CSV += ReportTitle + '\r\n\n';
    // This condition will generate the Label/Header
    if (ShowLabel) {
      let row = '';
      // This loop will extract the label from 1st index of on array
      for (const index in arrData[0]) {
        // Now convert each value to string and comma-seprated
        row += index + ',';
      }
      row = row.slice(0, -1);
      // append Label row with line break
      CSV += row + '\r\n';
    }

    // 1st loop is to extract each row
    for (let i = 0; i < arrData.length; i++) {
      let row = '';

      // 2nd loop will extract each column and convert it in string comma-seprated
      for (const index in arrData[i]) {
        if (typeof arrData[i][index] === 'object' && arrData[i][index].length > 0) {
          row += '"' + JSON.stringify(arrData[i][index]) + '",';
        } else {
          row += '"' + arrData[i][index] + '",';
        }
      }

      row.slice(0, row.length - 1);

      // add a line break after each row
      CSV += row + '\r\n';
    }

    if (CSV === '') {
      alert('Invalid data');
      return;
    }

    // Generate a file name
    let fileName = 'MyReport_';
    // this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, '_');

    // Initialize file format you want csv or xls
    const uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    // this trick will generate a temp <a /> tag
    const link = document.createElement('a');
    link.href = uri;

    // set the visibility hidden so it will not effect on your web-layout
    // link.style = "visibility:hidden";
    link.download = fileName + '.csv';

    // this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public download2Old(configData: any): void {
    function loadFile(url, callback) {
      JSZipUtils.getBinaryContent(url, callback);
    }
    loadFile(this.URL, function (error, content) {
      if (error) { throw error; }
      const zip = new JSZip(content);
      const doc = new docxtemplater().loadZip(zip);
      doc.setData({
        data: configData
          .map((config, i) => Object.assign({ name: `Config ${i + 1}` }, config))
      });
      try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render();
      } catch (error) {
        const e = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          properties: error.properties,
        };
        console.log(JSON.stringify({ error: e }));
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
        throw error;
      }
      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      }); // Output the document using Data-URI
      saveAs(out, 'output.docx');
    });
  }

  public download2(configData: any): void {
    configData.objectConfig[0].appName = 'testapp';
    configData.objectConfig.forEach(c => {
      if (c.deltaValue) {
        c.deltaValue.forEach((dv, i) => {
          c.deltaValue[i] = Object.assign({}, c.deltaValue[i]);
          if (c.deltaValue[i].value && typeof c.deltaValue[i].value == 'object') {

            let str = '';
            Object.keys(c.deltaValue[i].value).forEach((k, i) => {
              str = str + `${k}:${c.deltaValue[i].value[k]}`;
              if (i < Object.keys(c.deltaValue[i].value).length - 1) {
                str = str + ',';
              }
            })
            c.deltaValue[i].value = str;
          }
        })

      }

    })
    console.log('test', configData);
    function loadFile(url, callback) {
      JSZipUtils.getBinaryContent(url, callback);
    }
    const assignConfigName =
      (config, i) => Object.assign({ name: `Config ${i + 1}` }, config);

    loadFile(this.URL,
      function (error, content) {
        if (error) { throw error; }
        const zip = new JSZip(content);
        const doc = new docxtemplater().loadZip(zip);

        // console.log('>>>', JSON.stringify({
        //   objectConfig: configData.objectConfig
        //     .map(assignConfigName),
        //   appConfig: configData.appConfig
        //     .map(assignConfigName)
        // }));
        doc.setData({
          objectConfig: configData.objectConfig
            .map(assignConfigName),
          appConfig: configData.appConfig
            .map(assignConfigName)
        });
        try {
          doc.render();
        } catch (error) {
          const e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
          };
          console.log(JSON.stringify({ error: e }));
          throw error;
        }
        const out = doc.getZip().generate({
          type: 'blob',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        }); // Output the document using Data-URI
        saveAs(out, 'output.docx');
      });
  }

  public downLoadPromoteAsWellAsConfig() {
    const promoteAndConfig = {};
    promoteAndConfig['step5PromoteList'] = this.step5PromoteList;
    promoteAndConfig['setp5ConfigurationList'] = this.setp5ConfigurationList;
    this.download2(promoteAndConfig);
  }



}
