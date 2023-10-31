import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppConfigService } from '../services/app-config.service';
import { DataTransferService } from '../services/data-transfer.service';
import { AutomatorAppGeneralConfig } from '../models/automatorAppGeneralConfig';
import { NewAppCreateConfig } from '../models/newAppCreateConfig';
import { AutomatorAppGeneralConfigKey } from '../models/automatorAppGeneralConfigKey';
import { ToastrService } from 'ngx-toastr';
import { AutomatorApiService } from '../services/automator-api.service';

import { ListEventMapping } from '../models/list-event-mapping.model';
import { AddSectionComponent } from '../add-section/add-section.component';
import { MatDialog} from '@angular/material';
import { ListHeirarchyEvents } from '../models/list-heirarachy-mapping.model';
import { DashboardService } from '../services/dashboard.service';

declare var $: any;
@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.css']
})
export class ApplicationDetailsComponent implements OnInit {
 @Output() applicationDetailCallback: EventEmitter<any> = new EventEmitter();
  droppedAppDetails: any;
  droppedAppConfig: AutomatorAppGeneralConfig;
  newAppCreateConfig: NewAppCreateConfig;
  arrayVals: any = {};
  selectedTabIndex = 0;
  existingAppConfig: any = {};
  existingAppConfigOptions: any = {};
  existingAppConfigWotOption: any = {};
  ChooseDropApps: any = [];
  showSelectedApps: any = [];
  checkedApps: any = [];
  routingEventType: string;
  startUpflag: Boolean = false;
  symbolicLink = '';
  AppHeadings = ['Application Name', 'Local Timeout', 'Remote Timeout', 'Mode', 'Type', 'Connection Protocol'];
  ListItems: any;
  ListItemKey: any = [];
  chooseItem: any;
  ApplicationTypeName: string;
  arrayListItems: any = [];
  showArrayList: Boolean = false;
  switchListEvents: any = ['dn', 'placeGroupDn', 'agentLogin', 'originationDN'];
  switchTypes: any;
  ListItemApiUrl: any;
  appRankList: any = [];
  appTypeList: any = [];
  appTypeItem: any;
  appRankListItem: any;
  searchText;

  appMediaTypeList: any = [];
  appServiceTypeList: any = [];
  appCustomerSegmentList: any = [];
  appITContractList: any = [];

  appMediaTypeItem: any;
  appServiceTypeItem: any;
  appCustomerSegmentItem: any;
  appITContractItem: any;

  switchAccessCodeList: any = [];
  routeTypeList: any = [];
  targetTypeList: any = [];
  heirarchyObject: any = {};

  constructor(
    private appConfigService: AppConfigService,
    private dataTransferService: DataTransferService,
    private dashboardService: DashboardService,
    private automatorApiService: AutomatorApiService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {  }

  public closeDetails() {
    // console.log('Close Details Called..');
    this.droppedAppDetails = {};
    // this.newAppCreateConfig["connectedServers"]= this.showSelectedApps;
    this.dataTransferService.changeNewAppActivity({
      'action': 'cancel',
      'data': Object.assign({}, this.newAppCreateConfig),
    });
    this.newAppCreateConfig = null;
  }

  public closeConfigDetails() {
   // console.log('Close Config Details Called..');
    this.existingAppConfig = {};
    $('div.host-app').removeClass('appActive');
  }

  getNewAppConfigDetails(dropAppDetail) {
    this.closeDetails();
    this.closeConfigDetails();
    this.droppedAppDetails = dropAppDetail;
    this.droppedAppConfig = new AutomatorAppGeneralConfig();
    if (this.droppedAppDetails.automatorApp) {
      this.newAppCreateConfig =
        new NewAppCreateConfig(
          this.droppedAppDetails.host.hostId,
          this.droppedAppDetails.automatorApp.automatorAppId,
          this.droppedAppDetails.automatorApp.label);
      this.appConfigService
        .getAutomatorAppConfigDetails(this.droppedAppDetails.automatorApp.automatorAppId)
        .subscribe((data) => {
          this.droppedAppConfig = data;
          this.showSelectedApps = [];

          this.appConfigService.getAutomatorAppVersionDetails(this.droppedAppDetails.automatorApp.automatorAppId)
          .subscribe(dataVersion => { this.droppedAppConfig.versions = dataVersion.versions; });
          this.newAppCreateConfig.config.version = data.versions.length > 0 ? data.versions[0] : '';
          data.keys.forEach(keyRec => this.addKeyIntoConfigClass(keyRec));
        });
    }
  }

  // addNewFor(key: string) {
  //   // api Call for the model(open)
  //   this.newAppCreateConfig.config[key].push(Object.assign({}, this.arrayVals[key]));
  // }
  getAllApps(event?: any) {
    if (event) {
    this.droppedAppConfig.keys = undefined;
    }
    // this.selectedAppNameModalFnName  = event != undefined ? 'connectedServerApps()' : 'showApps()';

    this.automatorApiService.getAllApps().subscribe(
      apps => {
        this.ChooseDropApps = apps;
        $('#myModal').modal('show');
      }
    );
  }

  setHeirarchyItems() {
    const event =  ListHeirarchyEvents.HeirarchyEvents[this.ListItemKey];
    const length = this.existingAppConfigWotOption[this.ListItemKey].length;
    const hierarcyArray = Object.values(this.heirarchyObject);
    if (hierarcyArray.length === 3) {
      for (const key in event) {
        const item = event[key].sequence;
        this.existingAppConfigWotOption[this.ListItemKey][length - 1][key] = this.heirarchyObject[item];
      }
    } else {
      this.existingAppConfigWotOption[this.ListItemKey].splice(length - 1, 1);
    }
    $('#trioListModel').modal('hide');
  }

  getListItems(event: any) {
    this.ListItemKey = event;
    const HeirarchyReference = ListHeirarchyEvents.HeirarchyEvents;
    const eventType = ListEventMapping.ListEventType[localStorage.getItem('selectedListEventType')];
    if (eventType[event].mappedKeyName === 'empty') {
            // usage for simple adding new rows
      const obj = {};
      const keys = Object.keys(this.existingAppConfigWotOption[event][0]);
      for (const key in keys) {
        obj[keys[key]] = '';
      }
    this.existingAppConfigWotOption[event].push(obj);
      // usage for the subheirarchy levels
      if (HeirarchyReference.hasOwnProperty(event)) {
        this.heirarchyObject = {};
          const heirarchyEvents = ListHeirarchyEvents.HeirarchyEvents[event];
          for (const key in heirarchyEvents) {
            this.automatorApiService.getListOfEventType(heirarchyEvents[key].api).subscribe(
              response => {
                if (response.type === 'targetType') {
                this.targetTypeList = response.list;
                } else if (response.type === 'routeType') { // routeType
                this.routeTypeList = response.list;
                     } else {
                this.switchAccessCodeList = response.list;
                     }
                if (this.targetTypeList.length > 0 && this.routeTypeList.length > 0 && this.switchAccessCodeList.length > 0) {
                  $('#trioListModel').modal('show');
                }
                console.log('response', response);
              }
            );
          }
      }


    } else {
      this.ListItemApiUrl = eventType[event].api;
      // handing switch events
      if (this.switchListEvents.includes(event)) {
        const apiPath = 'switches/' + sessionStorage.getItem('sesId');
        this.automatorApiService.getListOfEventType(apiPath).subscribe(
          response => {
              this.switchTypes = response;
              $('#selectSwitchType').modal('show');
          });
      } else {
        this.getListOfEventType(eventType);
      }
    }


  }

  submitSwitchId() {
    // if(this.existingAppConfigWotOption.dbid == 0){
    //   console.log(this.ListItemKey);
    // }
    this.ListItemApiUrl = this.ListItemApiUrl.replace('{switchid}', this.chooseItem);
    this.getListOfEventType(ListEventMapping.ListEventType[localStorage.getItem('selectedListEventType')]);
    $('#selectSwitchType').modal('hide');
  }

  openAppRankModel() {
    this.appRankList = [];
    this.appTypeList = [];
    this.appTypeItem = undefined;
    this.appRankListItem = undefined;
    $('#duoListModel').modal('show');
    const url = {
      'ApprankUrl' :  this.ListItemApiUrl,
      'appType' : 'list/allapplicationtype'
    };
  for (const key in url) {
    this.automatorApiService.getListOfEventType(url[key]).subscribe(
      response => {
       if (response.type === 'appRank') {
        this.appRankList = response.list;
       } else {
        this.appTypeList = response.list;
       }
      }
    );
  }

  }

  combineAppRanks() {
    if (this.ListItemKey ===  'switchAccessCode') {
        this.existingAppConfigWotOption[this.ListItemKey][0].routeType = this.appRankListItem;
        this.existingAppConfigWotOption[this.ListItemKey][0].targetType = this.appTypeItem;
    } else if (this.ListItemKey === 'appRank') {
      this.chooseItem = {'appType' : this.appTypeItem, 'appRank' : this.appRankListItem};

      this.showListSelectedItems();
    }
    $('#duoListModel').modal('hide');

  }


  openObjectiveRecordModel() {
    this.appMediaTypeList = [];
    this.appServiceTypeList = [];
    this.appCustomerSegmentList = [];
    this.appITContractList = [];

    this.appMediaTypeItem = undefined;
    this.appServiceTypeItem = undefined;
    this.appCustomerSegmentItem = undefined;
    this.appITContractItem = undefined;
    $('#ObjectiveRecordListModel').modal('show');
    const url = {
      'mediaType' : 'list/' + this.automatorApiService.getSessionId() + '/media',
      'serviceType' : 'list/' + this.automatorApiService.getSessionId() + '/serviceType',
      'customerSegment' : 'list/' + this.automatorApiService.getSessionId() + '/customersegment',
      'itContract' : 'list/' + this.automatorApiService.getSessionId() + '/getstattable'
    };
  for (const key in url) {
    this.automatorApiService.getListOfEventType(url[key]).subscribe(
      response => {
        if (response.type === 'mediaType') {
        this.appMediaTypeList = response.list;
        }
        if (response.type === 'serviceType') {
        this.appServiceTypeList = response.list;
        }
        if (response.type === 'segment') {
        this.appCustomerSegmentList = response.list;
        }
        if (response.type === 'getstattable') {
        this.appITContractList = response.list;
        }
      }
    );
  }
  }

 combineObjectiveRecord() {

   if (this.ListItemKey === 'objectiveRecords') {
      this.chooseItem = {'mediaType': this.appMediaTypeItem, 'serviceType': this.appServiceTypeItem, 'segment': this.appCustomerSegmentItem, 'contract' : this.appITContractItem };   // Here we have to add ItContract As well
      this.showListSelectedItems();
    }
    $('#ObjectiveRecordListModel').modal('hide');

  }

  getListOfEventType(eventType) {
      if (this.ListItemKey === 'appRank') {
        this.openAppRankModel();
      } else if (this.ListItemKey === 'objectiveRecords') {
            this.openObjectiveRecordModel();
      } else {
    this.automatorApiService.getListOfEventType(this.ListItemApiUrl).subscribe(
      response => {
       if (eventType[this.ListItemKey].mappedKeyName) {
        this.showArrayList = false;
        const result = response.hasOwnProperty('list') ? response.list : response;
        // for(var key in result){
        //   if(ListHeirarchyEvents.HeirarchyEvents.hasOwnProperty(key)){
        //       this.automatorApiService.getListOfEventType(ListHeirarchyEvents.HeirarchyEvents[key]).subscribe(
        //         subresponse => {
        //           console.log(subresponse);
        //         }
        //       )
        //   }
        // }

        this.ListItems = result;
       } else {
        this.showArrayList = true;
        this.arrayListItems = response.list;
       }
        $('#listEventsModal').modal('show');
      }
    );
           }
  }

  getValues(app) {
    return Object.values(app);
  }
  getKeys(app, index) {
    if (index === 0) {
    return Object.keys(app);
    }
  }

  chooseSelectedApps(event: any, eventlist: any, index) {
      if (event.target.checked) {
        this.checkedApps.push(eventlist[index]);
      } else {
        this.checkedApps.splice(index, 1);
      }
  }
  showApps() {
    if (this.droppedAppConfig.keys === undefined) {
      for (const key in this.checkedApps) {
        const obj = {};
        obj['appServerId'] = this.checkedApps[key].appId;
        obj['timeoutLocal'] = 30;
        obj['timeoutRemote'] = 60;
        obj['mode'] = 'CFGTMNoTraceMode';
        obj['id'] = 'default';
        obj['connProtocol'] = 'addp';
        obj['appServerName'] = this.checkedApps[key].appName;

        this.existingAppConfigWotOption.connectedServers.push(obj);
        // this.ConnectedServerAppsConfig.push(obj);
      }
    } else {
      const defaultValues = this.droppedAppConfig.keys[1].defaultValue; // Connected Server Default Value;
      for (const key in this.checkedApps) {
        const obj = {};
        obj['appServerId'] = this.checkedApps[key].appId;
        obj['id'] = 'default';
        obj['longField1'] = 0;
        obj['longField2'] = '5';
        obj['longField3'] = 0;
        obj['longField4'] = 0;
        obj['mode'] = 'CFGTMNoTraceMode';
        obj['timeoutLocal'] = 30;
        obj['timeoutRemote'] = 60;
        obj['appName'] = this.checkedApps[key].appName;
         obj['connProtocol'] = 'addp';

        this.showSelectedApps.push(obj);
      }
    }
    this.checkedApps = [];
    $('#myModal').modal('hide');

  }

  showListSelectedItems() {
    const eventType = ListEventMapping.ListEventType[localStorage.getItem('selectedListEventType')];
   if (eventType[this.ListItemKey].hasOwnProperty('mappedKeyName')) {
     if (typeof this.existingAppConfigWotOption[this.ListItemKey] === 'string' || typeof this.existingAppConfigWotOption[this.ListItemKey] === 'number') {
    this.existingAppConfigWotOption[this.ListItemKey] = this.chooseItem[eventType[this.ListItemKey].propertyName];
     } else if (typeof this.existingAppConfigWotOption[this.ListItemKey] === 'object') {
     this.existingAppConfigWotOption[this.ListItemKey].push(this.chooseItem);
          }
   } else {
      if (typeof this.existingAppConfigWotOption[this.ListItemKey] === 'string') {
    this.existingAppConfigWotOption[this.ListItemKey] = this.chooseItem;
      } else if (typeof this.existingAppConfigWotOption[this.ListItemKey] === 'object') {
     this.existingAppConfigWotOption[this.ListItemKey].push(this.chooseItem);
          }
    }
    $('#listEventsModal').modal('hide');
  }

  addKeyIntoConfigClass(keyRec: AutomatorAppGeneralConfigKey) {
    switch (keyRec.type) {
      case 'STRING':
      case 'INTEGER':
        this.newAppCreateConfig.addNewPropertyToConfig(keyRec.key, keyRec.defaultValue);
      break;
      case 'OBJECT':
        this.newAppCreateConfig.addNewPropertyToConfig(keyRec.key, Object.assign({}, keyRec.defaultValue));
      break;
      case 'ARRAY':
        this.arrayVals[keyRec.key] = keyRec.defaultValue;
        this.newAppCreateConfig.addNewPropertyToConfig(keyRec.key, []);
        // this.newAppCreateConfig.addNewPropertyToConfig(keyRec.key, [Object.assign({}, keyRec.defaultValue)]);
        break;
    }
  }

  objectKeys(obj) {
    return Object.keys(obj);
  }


  objectKeysNew(obj) {
    const keys = Object.keys(obj);
    const returnValue: string[] = [];
    for (const entry of keys) {
         if (entry === 'appServerId' || entry === 'timeoutLocal' || entry === 'timeoutRemote' || entry === 'mode' || entry === 'id' ) {
          returnValue.push(entry);
         }
    }

    return returnValue;
   // return Object.keys(obj);
  }


  saveAppConfig() {
   this.newAppCreateConfig.config['connectedServers'] = this.showSelectedApps;
   this.newAppCreateConfig.config['startUpFlag'] = this.startUpflag;
   this.newAppCreateConfig.config['symbolicLink'] = this.symbolicLink;

    this.dataTransferService.changeNewAppActivity({
      'action': 'save',
      'data': this.newAppCreateConfig
    });
    this.droppedAppDetails = {};
    this.toastr.success('New config saved', 'Success!');
  }

  isObjectOrArray(ketType: string) {
    return ketType === 'ARRAY' || ketType === 'OBJECT';
  }

  processConfigInfo(appConfig) {

    if (appConfig.length > 0) {
      const eventType = appConfig.eventType;
      appConfig = appConfig[0];
      appConfig.eventType = eventType;
    }

    this.existingAppConfig = appConfig;
    this.existingAppConfigOptions = Object.assign({}, appConfig.options);
    this.existingAppConfigWotOption = Object.assign({}, appConfig);

    if (this.existingAppConfigWotOption.hasOwnProperty('mappedKeyName') || this.existingAppConfigWotOption.hasOwnProperty('propertyName')) {
    this.ApplicationTypeName = 'ListEventType';
    }

    if (appConfig.hasOwnProperty('eventType')) {
      this.routingEventType = appConfig['eventType'].toLowerCase();
      delete this.existingAppConfigWotOption['eventType'];
    }

    delete this.existingAppConfigWotOption['options'];
  }

  optionsData(event) {
    this.existingAppConfigWotOption['options'] = event;

    this.automatorApiService.postExistingAppConfig(this.existingAppConfigWotOption.appId, this.existingAppConfigWotOption)
    .subscribe(result => {
      // this.toastr.success('New config saved! Please Refresh aftersometime', 'Success!');
      this.toastr.success('New config saved!', 'Success!');
      this.closeConfigDetails();
    });
  }

  modifyData(event: any) {

    if (event.dbid && event.dbid !== 0) {// update routing transaction
      if (this.existingAppConfigOptions) {
        event.options = this.existingAppConfigOptions;

     // event.options = [];
    // event.options.push(this.existingAppConfigOptions);
      }

    if (event.hasOwnProperty('format') && event.format === null) {
    event.format = '';
    }
      this.automatorApiService.updateRoutingType(event, this.routingEventType).subscribe(result => {

        this.toastr.success(this.routingEventType + ' Updated!', 'Success!');
        this.closeDetails();
      });
    } else if (event.dbid === 0) {// for every new routing type
      if (this.existingAppConfigOptions) {
        event.options = [];
        event.options.push(this.existingAppConfigOptions);
      }
      const config = [];
      config.push(event);
      this.automatorApiService.addNewRoutingType(config, this.routingEventType).subscribe(result => {
        this.toastr.success('New ' + this.routingEventType + ' Saved!', 'Success!');
        this.closeDetails();

          this.applicationDetailCallback.emit(this.routingEventType);
      });
    } else {
      if (event.hasOwnProperty('selectedVersion')) {
        event.version = event.selectedVersion;
        delete event.selectedVersion;
      }
      const appId =  event.appId;
      event.options = {};
      event.options = this.existingAppConfigOptions;
       // console.log(event);
       this.automatorApiService.postExistingAppConfig(appId, event)
       .subscribe(result => {
         // this.toastr.success('New config saved! Please Refresh aftersometime', 'Success!');
         this.toastr.success('New config saved!', 'Success!');
         this.closeDetails();
       });
    }

    this.closeConfigDetails();

  }

  addSection(): void {
    const dialogRef = this.dialog.open(AddSectionComponent, {
      data: 'testing',
      width: '500px',
      height: '380px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (Object.keys(result).length > 0) {
        if (!this.existingAppConfigOptions.hasOwnProperty(result.section) && (result.section !== undefined && result.name !== undefined)) {
          this.existingAppConfigOptions[result.section] = {};
          this.existingAppConfigOptions[result.section][result.name] = result.value;
        }
      }

    });
  }




  ngOnInit() {
    this.ApplicationTypeName = 'ApplicationDetail';
    this.dataTransferService.currentDropAppDetail
      .subscribe(dropAppDetail => this.getNewAppConfigDetails(dropAppDetail));

      // close current open config on loading any object-details.
      this.dashboardService.closeAppConfig.subscribe(result => {
       // this.closeDetails();
        this.closeConfigDetails();
      });

    this.dataTransferService.currentSelectAppDetail
      .subscribe(appConfig => {
        this.closeDetails();
        this.processConfigInfo(appConfig);
      });
  }

}
