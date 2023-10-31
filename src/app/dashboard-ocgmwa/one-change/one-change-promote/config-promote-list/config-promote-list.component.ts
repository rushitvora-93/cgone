import { HostApp } from './../../../../models/hostApp';
import { AddSectionKeyValueComponent } from './../../../../add-section-key-value/add-section-key-value.component';
import { ConfirmationDialogService } from './../../../../confirmation-dialog.service';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { MatStepper } from '@angular/material';
import { AutomatorApiService } from '../../../../services/automator-api.service';
import { ListEventMapping } from '../../../../models/list-event-mapping.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import _ from 'underscore';
import { AppConfigService } from '../../../../services/app-config.service';
declare var $: any;


@Component({
  selector: 'app-config-promote-list',
  templateUrl: './config-promote-list.component.html',
  styleUrls: ['./config-promote-list.component.scss']
})
export class ConfigPromoteListComponent implements OnInit {

  @Input() config: any;
  @Input('SubmitEventName') SubmitEventName: string;
  @Input() eventType: string;
  @Input('editMode') editMode: Boolean;
  @Input() stepper: MatStepper;
  @Input('CancelEventName') CancelEventName: string;
  // selectedHostName : string;
  @Input() showCheckBox: Boolean;
  @Input() showDeleteIcon: Boolean;
  @Input() selectedEnv;
  connectedServer = ["App Server Id", "App Server Name", "Conn Protocol", "Id", "Mode", "Timeout Local", "Timeout Remote"];
  connectedServerName = ['appServerId', 'appServerName', 'connProtocol', 'id', 'mode', 'timeoutLocal', 'timeoutRemote'];
  @Output() BackStepper: EventEmitter<any> = new EventEmitter();
  @Output() callbackSelectedEvents: EventEmitter<any> = new EventEmitter();
  @Output() ApplicationDetailCallback: EventEmitter<any> = new EventEmitter();
  @Output() SelectConnectedServerApps: EventEmitter<any> = new EventEmitter();
  @Output() ListEventItemsConfig: EventEmitter<any> = new EventEmitter();
  @Output() SubmitListEventItems: EventEmitter<any> = new EventEmitter();
  @Input() showComparison = false;
  ListObjectHeadings: any;


  promoteHostListArray = {};
  selectedEvents: any = {};
  selectedApps: any;
  configurationSelectedItemList = [];
  bothTypeAppLists = [];
  fromDate: any;
  toDate: any;
  selectedIndexes = new Set();
  objectTypes = [];
  selectedObjectType: any;
  allEnvCompList: any;
  isresultNavVisible: boolean;
  environmentComparisson: any[];
  loadingComparison: boolean;
  loadingComparisonItems = false;
  firstEnvName: any;
  secondEnvName: any;
  shouldShowOnlyDifference = false;
  constructor(private automatorApiService: AutomatorApiService,
    private confirmationDialogService: ConfirmationDialogService,
    public dialog: MatDialog, private automatorApi: AutomatorApiService) {
  }

  ngOnInit() {
  }


  getConfigList(config, index, event) {
    if (event.checked) {
      let arr = this.eventType == 'BothEventsStep4' ? this.bothTypeAppLists : this.configurationSelectedItemList;
      arr.push(config[index]);
      this.selectedIndexes.add(index);
    }
    else {
      let arr = this.eventType == 'BothEventsStep4' ? this.bothTypeAppLists : this.configurationSelectedItemList;
      arr.splice(index, 1);
      this.selectedIndexes.delete(index);
      if (index == 0) {
        arr.splice(0, arr.length);
        this.selectedIndexes = new Set();
      }
    }

  }
  isString(value) {
    if (value === null) value = '';
    return typeof value === 'string' || value instanceof String;
  }

  isNumber(value) {
    return typeof value === 'number' && isFinite(value);
  }

  isBoolean(value) {
    return typeof value === 'boolean';
  }

  isArray(value) {
    let x = value && typeof value === 'object' && value.constructor === Array;
    return value && typeof value === 'object' && value.constructor === Array;
  }

  isObject(value) {
    let x = value && typeof value === 'object' && value.constructor === Object;
    return value && typeof value === 'object' && value.constructor === Object;
  }

  objectKeys(data) {
    if (data) {
      return Object.keys(data);
    } else {
      return [];
    }
  }
  objectKeysNew(obj) {
    for (let x of obj)
      return Object.keys(x)
  }

  getKeys(data) {
    if (data) {
      return Object.keys(data);
    } else {
      return [];
    }

  }

  objectValues(obj) {
    if (obj) {
      return Object.values(obj);
    } else {
      return [];
    }
  }
  onChange(event: any, data: string, obj: any) {
    let index = Object.values(obj).indexOf(data);
    obj[Object.keys(obj)[index]] = event.target.value;
  }
  getKeyLabel(key) {
    return key;
  }
  optionsKey(key: any, obj: any, event: any) {
    let swappedObject = _.invert(obj)

    // if(swappedObject.hasOwnProperty(this.config[key])){
    swappedObject[this.config[key]] = event.target.value;
    this.config = _.invert(swappedObject);
    //}

  }

  ifNotNull(array) {
    if (array.length > 0) {
      this.ListObjectHeadings = [];

      let newarr = [];
      let obj = _.first(array);
      let arr = Object.values(obj);
      this.ListObjectHeadings = Object.keys(obj);

      arr.map(x => {
        if (x != "") {
          newarr.push(x);
        }
      })

      if (newarr.length > 0)
        return true;
      else {
        array.splice(0, 1); // it will always splice first item, which will be there is create case;
        return false;
      }
    }

    return false;


  }


  AddNewRow(config) {
    this.SelectConnectedServerApps.emit(config);

  }



  openModel(key) {
    this.ListEventItemsConfig.emit(key);
  }

  changeKeyValue(key, event) {
    this.config[key] = event.target.value;
  }
  changeKeyText(key, event) {
    this.config[event.target.value] = this.config[key];
    delete this.config[key];
  }


  showArrayOfListEvents(key) {
    let eventType = ListEventMapping.ListEventType[localStorage.getItem('selectedListEventType')];
    if (eventType)
      if (eventType.hasOwnProperty(key))
        return false;

    return true;
  }
  parseConfigKey(key) {
    return JSON.parse(key);
  }
  removeListItems(key, index) {
    this.config[key].splice(index, 1);
  }
  widgets(key) {
    let eventType = ListEventMapping.ListEventType[localStorage.getItem('selectedListEventType')];
    if (eventType[key].api.includes('calendar'))
      return false;

    return true;
  }

  getHostId(event: any, config) {
    config["selectedHostId"] = parseInt(event.target.value);

  }
  statecheckbox(event) {
    this.config['state'] = event.checked ? 'CFGEnabled' : 'CFGDisabled';
  }

  upgradeVersion(event) {
    this.config['upgradeVersion'] = event.checked;
  }

  saveValue() {
    if (this.eventType == 'ApplicationDetail') {
      this.ApplicationDetailCallback.emit(this.config);
    }
    else if (this.eventType == 'ConfigurationType' || this.eventType == 'BothEventsStep4') {
      let arr = this.eventType == 'BothEventsStep4' ? this.bothTypeAppLists : this.configurationSelectedItemList;
      let obj = {}
      this.selectedEvents[this.eventType] = this.config;
      obj = { key: this.eventType, value: arr, moveNext: this.stepper }
      this.callbackSelectedEvents.emit(obj);
    }
    else if (this.eventType == 'PromoteType') {

      let obj = {};
      this.selectedEvents[this.eventType] = this.config;

      obj = {
        key: this.eventType,
        value: this.selectedEvents[this.eventType],
        moveNext: this.stepper
      }
      this.callbackSelectedEvents.emit(obj);
    }
    else if (this.eventType == 'ListEventType') {
      let listInfo = ListEventMapping.ListEventType[localStorage.getItem('selectedListEventType')];
      // set date time for the calendar entries inside the objective table

      if (listInfo.hasOwnProperty('contractStartTime') && listInfo.hasOwnProperty('contractEndTime')) {
        this.config['contractStartTime'] = this.fromDate;
        this.config['contractEndTime'] = this.toDate;
      }
      for (var key in this.config) {
        if (listInfo.hasOwnProperty(key)) {
          if (listInfo[key].hasOwnProperty('mappedKeyName')) {
            if (listInfo[key].mappedKeyName == 'empty')
              continue;

            let array = listInfo[key].result.hasOwnProperty('list') ? listInfo[key].result['list'] : listInfo[key].result;
            let item = array.filter(x => x[listInfo[key]['propertyName']] == this.config[key])[0];
            if (item)
              this.config[key] = item[listInfo[key]['mappedKeyName']];
          }
          // FOR type
          //  else if(listInfo[key].result.hasOwnProperty('list')){
          //   var mappedProperty = listInfo[key].result.list.find(element => {
          //     return element.propertyName === this.config[key]
          //   });
          //   this.config[key] = mappedProperty.mappedName;
          //  }
        }
      }
      this.SubmitListEventItems.emit(this.config);
    }

    else {
      let obj = {}
      this.selectedEvents[this.eventType] = this.config;
      // this.selectedEvents[this.eventType].push();
      obj = { key: this.eventType, value: this.selectedEvents[this.eventType], moveNext: this.stepper }
      this.callbackSelectedEvents.emit(obj);
    }

  }
  BackStep() {
    this.BackStepper.emit(this.stepper);
  }

  showArrayItems(key) {
    let eventType = ListEventMapping.ListEventType[localStorage.getItem('selectedListEventType')];
    if (eventType)
      if (!eventType[key].hasOwnProperty('mappedKeyName'))
        return true;

    return false;
  }

  public openConfirmationDialog(key) {
    this.confirmationDialogService.confirm('Please confirm!!', 'Do you really want to Delete ?')
      .then((confirmed) => {
        if (confirmed)
          delete this.config[key];
      }
      )
      .catch(() => console.log('close dialog!!'));
  }

  addSectionKeyValue(key): void {
    const dialogRef = this.dialog.open(AddSectionKeyValueComponent, {
      data: 'testing',
      width: '500px',
      height: '300px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!this.config[key].hasOwnProperty(result.name)) {
        this.config[key][result.name] = result.value;
      }
      else {
        alert('Property Already Exist');
      }
    });
  }

  isAnObject(data) {
    return typeof data == 'object';
  }

  toggleShowOnlyDifference() {
    if (this.shouldShowOnlyDifference) {
      this.shouldShowOnlyDifference = false;
    } else {
      this.shouldShowOnlyDifference = true;
    }
  }
}