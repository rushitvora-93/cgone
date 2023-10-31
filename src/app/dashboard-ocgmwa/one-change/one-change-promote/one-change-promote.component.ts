import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { switchMap, map } from 'rxjs/operators';
import _ from 'underscore';
import * as JSZipUtils from 'jszip-utils';
import * as JSZip from 'jszip';
import docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { pipe, of } from 'rxjs';

@Component({
  selector: 'app-one-change-promote',
  templateUrl: './one-change-promote.component.html',
  styleUrls: ['./one-change-promote.component.scss']
})
export class OneChangePromoteComponent implements OnInit {

  @ViewChild('OneChangePromote') OneChangePromote: ElementRef;

  formGroup: FormGroup;
  searchForm: FormGroup;

  showComparison = false;

  environments = [];
  selectPromoteTypeList = [{
    id: 1,
    label: 'App Promote'
  }, {
    id: 2,
    label: 'Configuration Promote'
  }];
  getCompareList = [];
  selectPromote = [];
  fromDateTrigger = false;
  toDateTrigger = false;

  objectTypes = [];


  promoteAppList = [];
  visiblePromoteAppList = []
  visibleConfigureAppList = [];
  selectedItemsArray = { promotelist: [], configurationList: [] };

  configureAppList = [];
  hostIdNameMapping = [];

  appListReady = false;
  configPromoteListReady = false;
  configPromoteList = [];
  finalPromoteList = [];
  showFinalStep = false;

  isBusy = false;
  URL = 'assets/templates/template2.docx';

  constructor(private toastr: ToastrService,
    private automatorApi: AutomatorApiService) {
    const date = new Date();
    this.formGroup = new FormGroup({
      firstCtrl: new FormControl(),
      selectDuration: new FormControl(date),
      selectDurationTo: new FormControl(date),
      selectPromote: new FormControl([])
    });

    this.searchForm = new FormGroup({
      searchObjectName: new FormControl(),
      searchObjectType: new FormControl(),
      searchUserName: new FormControl(),
    });

  }

  ngOnInit() {
    this.automatorApi.getEnvironmentListOnPromote().subscribe(result => {
      this.environments = result;
    });

    this.formGroup.valueChanges.subscribe(res => this.appListReady = false);

    this.searchForm.valueChanges.subscribe(res => this.filterApplicationList());

  }

  setEnv(id) {
    this.formGroup.controls.firstCtrl.patchValue(id);
  }
  setFromDate(val) {
    this.formGroup.controls.selectDuration.patchValue(val);
    this.fromDateTrigger = false;
  }
  setToDate(val) {
    this.formGroup.controls.selectDurationTo.patchValue(val);
    this.toDateTrigger = false;
  }

  setPromote(checked, id) {
    let values = this.formGroup.value.selectPromote;
    const found = values.indexOf(id);
    if (found > -1) {
      values.splice(found, 1);
    } else {
      values.push(id);
    }

    this.formGroup.get('selectPromote').setValue(values);
    // this.appListReady = false;
  }

  loadAppList(index) {
    if (index === 0) {
      this.configureAppList = [];
      this.promoteAppList = []
      this.visiblePromoteAppList = [];
      this.visibleConfigureAppList = [];
      this.selectedItemsArray.configurationList = [];
      this.selectedItemsArray.promotelist = [];
      this.configPromoteListReady = false;
      this.showFinalStep = false;
      this.showComparison = false;
    }
    this.appListReady = true;
    this.scrollToView('ocg-pro-applist');
    const items = this.formGroup.value.selectPromote.sort();
    if (items.length <= index) {
      this.filterApplicationList();
      return;
    }
    const formValue = this.formGroup.value;
    const from = formValue.selectDuration +
      ' ' + 0 +
      ':' + 0 +
      ':' + 0;
    const to = formValue.selectDurationTo +
      ' ' + 23 +
      ':' + 59 +
      ':' + 59;
    const data = {
      'toDate': to.toString(),
      'fromDate': from.toString()
    };


    if (items[index] === 1) {
      this.automatorApi
        .getPromoteAppList(this.formGroup.value.firstCtrl, data)
        .pipe(
          switchMap(res => {
            this.promoteAppList = res || [];
            return this.automatorApi.getHostName(this.formGroup.value.firstCtrl);
          })
        ).subscribe(hostname => {
          this.hostIdNameMapping = hostname;
          // callbackthe next array item
          this.loadAppList(index + 1);
        });
    } else if (items[index] === 2) {
      this.automatorApi
        .getConfigurePromoteList(this.formGroup.value.firstCtrl, data)
        .subscribe(result => {
          this.configureAppList = result || [];
          this.loadAppList(index + 1);
        });
    }
  }

  filterApplicationList() {
    const filterQuery = this.searchForm.value;

    this.visiblePromoteAppList = this.promoteAppList
      .filter(app => {
        let filter = true;
        if (filterQuery.searchObjectName) {
          const appName = app.config.appName;
          filter = appName.toLowerCase().includes(filterQuery.searchObjectName.toLowerCase());
        }
        if (filter && filterQuery.searchObjectType) {
          const objectType = 'application';
          filter = objectType.toLowerCase().includes(filterQuery.searchObjectType.toLowerCase());
        }
        if (filter && filterQuery.searchUserName) {
          const appUser = app.user;
          filter = appUser.toLowerCase().includes(filterQuery.searchUserName.toLowerCase());
        }
        return filter;
      });

    this.visibleConfigureAppList = this.configureAppList
      .filter(app => {
        let filter = true;
        if (filterQuery.searchObjectName) {
          const appName = app.objectName;
          filter = appName.toLowerCase().includes(filterQuery.searchObjectName.toLowerCase());
        }
        if (filter && filterQuery.searchObjectType) {
          const objectType = this.removeCFG(app.objectType);
          filter = objectType.toLowerCase().includes(filterQuery.searchObjectType.toLowerCase());
        }
        if (filter && filterQuery.searchUserName) {
          const appUser = app.user;
          filter = appUser.toLowerCase().includes(filterQuery.searchUserName.toLowerCase());
        }
        return filter;
      });
  }

  removeCFG(objectType) {
    if (objectType && objectType.substring(0, 3) === 'CFG') {
      return objectType.substring(3);
    }
    return '';
  }

  SelectApplication(id: number) {
    const found = this.selectedItemsArray.promotelist.indexOf(id);
    if (found > -1) {
      this.selectedItemsArray.promotelist.splice(found, 1)
    }
    else {
      this.selectedItemsArray.promotelist.push(id)
    }
    this.configPromoteListReady = false;
  }

  SelectConfigApplication(id: number) {
    const found = this.selectedItemsArray.configurationList.indexOf(id);
    if (found > -1) {
      this.selectedItemsArray.configurationList.splice(found, 1);
    } else {
      this.selectedItemsArray.configurationList.push(id);
    }
    this.configPromoteListReady = false;
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

  fetchResults() {
    this.configPromoteListReady = false;
    this.configPromoteList = [];
    if (this.selectedItemsArray.promotelist.length) {
      this.automatorApi.postPromoteAppConfig(this.selectedItemsArray.promotelist).subscribe(res => {
        this.configPromoteList = this.configPromoteList.concat(this.mapListHostId(res));
        this.configPromoteListReady = true;
        this.scrollToView('ocg-pro-config');
      });
    }

    if (this.selectedItemsArray.configurationList.length) {
      const param = [];
      this.configureAppList.map((item) => {
        if (this.selectedItemsArray.configurationList.indexOf(item.objectId) > -1) {
          param.push({ dbId: item.objectId, objectType: item.objectType })
        }
      });

      this.automatorApi.postConfigurationAppConfig(param, this.formGroup.value.firstCtrl).subscribe(result => {
        this.configPromoteList = this.configPromoteList.concat(result);

        result.forEach((config, i) => {
          if (this.getCompareList.map(t => t.objectName).indexOf(config.objectName) == -1) {
            this.getCompareList.push({ objectName: config.objectName, objectType: config.objectType, envId: config.envId });
          }
        });

        this.configPromoteListReady = true;
        this.scrollToView('ocg-pro-config');
      });
    }

    this.finalPromoteList = [];
  }

  addConfigItems(item) {
    const found = this.finalPromoteList.indexOf(item);
    if (found > -1) {
      this.finalPromoteList.splice(found, 1);
    } else {
      this.finalPromoteList.push(item);
    }
    this.showFinalStep = false;
  }

  showCompare() {
    this.showComparison = !this.showComparison;
  }
  // get getCompareList() {
  //   return this.finalPromoteList.map(r => this.configPromoteList[r]);
  // }

  setFinalStep() {
    this.showFinalStep = true;
    this.scrollToView('one-ch-pr-final');
  }

  processPromote() {
    if (this.isBusy) {
      return;
    }
    const paramConfig = [];
    const paramApps = [];

    let param = this.finalPromoteList.map(r => this.configPromoteList[r]);
    param.map(item => {
      if (item.selectedHostId) {
        item.hostId = item.selectedHostId;
      }
      if (item.hostId) {
        paramApps.push(item);
      } else {
        paramConfig.push(item);
      }
    });
    this.isBusy = true;

    of(0).pipe(
      switchMap(res => {
        if (paramApps.length) {
          return this.automatorApi.postFinalPromoteList(paramApps, this.formGroup.value.firstCtrl);
        } else {
          return of(true);
        }
      }),
      switchMap(res => {
        if (paramConfig.length) {
          return this.automatorApi.postFinalConfigurationList(paramConfig, this.formGroup.value.firstCtrl);
        } else {
          return of(true);
        }
      })
    ).subscribe(res => {
      this.toastr.success('Your Request Saved', 'Success!');
      this.isBusy = false;
    }, err => {
      this.toastr.error('Your Request Not Saved', 'Error!');
      this.isBusy = false;
    });
  }

  checkAllApps(check) {
    this.selectedItemsArray.configurationList = [];
    this.selectedItemsArray.promotelist = [];

    if (check) {
      this.visiblePromoteAppList.map(item => this.selectedItemsArray.promotelist.push(item.appId));
      this.visibleConfigureAppList.map(item => this.selectedItemsArray.configurationList.push(item.objectId));
    }
    this.configPromoteListReady = false;
  }

  checkAllConfigList(check) {
    this.finalPromoteList = [];
    if (check) {
      this.configPromoteList.map((item, index) => {
        this.finalPromoteList.push(index);
      })
    }
    this.showFinalStep = false;
  }


  downloadPromote() {
    const paramConfig = [];
    const paramApps = [];

    let param = this.finalPromoteList.map(r => this.configPromoteList[r]);
    param.map(item => {
      if (item.selectedHostId) {
        item.hostId = item.selectedHostId;
      }
      if (item.hostId) {
        paramApps.push(item);
      } else {
        paramConfig.push(item);
      }
    });

    const config = {};
    config['objectConfig'] = paramConfig;
    config['appConfig'] = paramApps;
    this.download2(config);
  }

  scrollToView(id) {
    setTimeout(() => this.OneChangePromote.nativeElement.querySelector('#' + id).scrollIntoView({ behavior: "smooth", block: "end" }), 100);
  }

  public download2(configData: any): void {
    console.log(configData)
    // configData.objectConfig[0].appName = 'testapp';
    configData.objectConfig.forEach(c => {
      if (c.deltaValue) {
        c.deltaValue.forEach((dv, i) => {
          c.deltaValue[i] = Object.assign({}, c.deltaValue[i]);
          if (c.deltaValue[i].value && typeof c.deltaValue[i].value == 'object') {

            let str = '';
            Object.keys(c.deltaValue[i].value).forEach((k, i) => {
              // fixx
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

          throw error;
        }
        const out = doc.getZip().generate({
          type: 'blob',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        }); // Output the document using Data-URI
        saveAs(out, 'output.docx');
      });
  }

}
