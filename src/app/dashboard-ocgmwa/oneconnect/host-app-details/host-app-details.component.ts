import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AutomatorApiService } from '../../../services/automator-api.service';
import { AddConnectionDialogComponent } from '../../../dialogs/add-application-dialog/add-connection-dialog/add-connection-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { AddOptionDialogComponent } from '../../../dialogs/add-option-dialog/add-option-dialog.component';
import { RemoveOptionDialogComponent } from '../../../dialogs/remove-option-dialog/remove-option-dialog.component';
import { AddSectionDialogComponent } from '../../../dialogs/add-section-dialog/add-section-dialog.component';
import { AddConnectedServerDialogComponent } from '../../../components/create-new-connected-server-dialog/add-connected-server-dialog.component';

@Component({
  selector: 'app-host-app-details',
  templateUrl: './host-app-details.component.html',
  styleUrls: ['./host-app-details.component.scss']
})
export class HostAppDetailsComponent implements OnChanges {

  appOptions: any[] = [];

  public filterKeyword: string;

  public availableServers: any[] = [];
  public connectedServers: any[] = [];
  appConfigForm: any;

  @Input() appId: number;
  @Input() chkFlag: number;
  @Input() appConfig: any;
  @Input() isVirtual: any;
  @Input() appName: string;
  @Input() id: string;
  @Input() hostId: string;
  @Input() shouldShow: string;
  @Input() isUpgrade = false;
  @Input() dontShowFlag: boolean;
  @Input() cfgServId: boolean;
  @Input() allTypes: any = [];
  @Output() itemstate = new EventEmitter<string>();
  @Output() updated = new EventEmitter<any>();
  appState: boolean;
  versions = [];
  envOptions: any;
  // appConfigType:string;
  // appConfigVersion:string;
  allPluginVersions = [];
  allPlugins = [];

  constructor(private apiService: AutomatorApiService,
    public dialog: MatDialog,
    public toastr: ToastrService) {

  }


  ngOnChanges(changes) {
    if (this.chkFlag > 0 && this.shouldShow) {
      this.getAllAppType();
    }

    if (this.appConfig) {
      this.appState = this.appConfig.state == 'CFGEnabled';
      this.appConfigForm = this.appConfig;
    }
    if (this.shouldShow && this.appId != null) {
      this.loadData();
      this.apiService.appPlugins().subscribe(
        res => {
          this.allPlugins = res;
        });
    }
    if (this.appConfig && this.appConfig.dependencyType && this.shouldShow) {
      this.getPlugins({ value: this.appConfig.dependencyType });
    }
  }



  public loadData() {

    if (this.dontShowFlag == false) {
      this.apiService.getExistingAppConfig(this.appId ? this.appId : this.id).subscribe(
        (appConfig: any) => {
          console.log('responsee', appConfig);
          this.itemstate.emit(appConfig.state);
          appConfig.versions = [appConfig.version]
          if (this.isUpgrade) {
            this.apiService.oneConnectAppVersions(appConfig.type.replace('CFG', ''))
              .subscribe(res => {
                appConfig.versions = res;
              }, err => {

              })
          }
          if (appConfig && appConfig.version && appConfig.versions[0]) {
            this.appConfig = appConfig;
          }
          this.appState = this.appConfig.state == 'CFGEnabled';
          this.appOptions = this.loadAppOptions(appConfig);
          if (this.appConfig && this.appConfig.connectedServers) {
            this.connectedServers = this.appConfig.connectedServers.map(
              server => Object.assign({}, {
                appId: server.appServerId,
                appName: server.appServerName
              })
            );
          }


          this.apiService.getAllApps().subscribe(
            allApps => {
              console.log('allapps', allApps);
              this.availableServers = allApps.map(server => Object.assign({}, server, {
                isChecked: this.connectedServers.filter(cs => cs === server.appName).length > 0
              }));
              console.log('availservers', this.availableServers);
            });
        });
    }

    if (this.dontShowFlag == true) {

      this.appOptions = this.loadAppOptions(this.appConfig);

      this.apiService.getAllApps().subscribe(
        allApps => {
          console.log('allapps', allApps);
          this.availableServers = allApps.map(server => Object.assign({}, server, {
            isChecked: this.connectedServers.filter(cs => cs === server.appName).length > 0
          }));
          console.log('availservers', this.availableServers);
        });
    }

  }

  public loadAppOptions(appConfig) {
    const options = [];
    if (appConfig && appConfig.options) {
      Object.keys(appConfig.options).forEach(mainKey => {
        const suboptions = appConfig.options[mainKey];
        const optionsList = [];

        Object.keys(suboptions).forEach(subkey => {
          const suboption = suboptions[subkey];
          optionsList.push({
            key: subkey,
            value: suboption
          });
        });

        options.push({
          name: mainKey,
          optionsList
        });
      });
    }

    return options;
  }

  public onSearchChanged(event) {
    const keyword = event.target.value;
    this.filterKeyword = keyword;
    this.filterAppOptions(keyword);
  }

  public filterAppOptions(keyword) {
    this.appOptions = this.appOptions.map(appOption => {
      if (appOption && appOption.optionsList) {
        appOption.optionsList = appOption.optionsList.map(option => {
          return Object.assign({}, option, {
            doesMatchKeyword: (option.key && option.key.toLowerCase().includes(keyword))
              || (option.value && option.value.toLowerCase().includes(keyword))
          });
        });
      }

      return appOption;
    });
  }

  public hasOptionChanged(option) {
    const changedOption = option.optionsList.filter(o => o.doesMatchKeyword);
    return changedOption && changedOption.length > 0;
  }

  getPlugins(value) {
    const val = value.value;
    if (!val || val === '') {
      return;
    }
    this.apiService.pluginVersions(val).subscribe(
      res => {
        this.allPluginVersions = res;
      });
  }
  public onAddConnection() {
    if (this.isVirtual) {
      const dialogRef = this.dialog.open(AddConnectedServerDialogComponent, {
        data: {
          appName: this.appConfig.appName
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (!this.appConfig.connectedServers) {
            this.appConfig.connectedServers = [];
          }
          this.appConfig.connectedServers.push(result);
        }
      })
      return;
    }
    const dialogRef = this.dialog.open(AddConnectionDialogComponent,
      {
        panelClass: 'mwa-dialog',
        data: {
          appName: this.appConfig.appName,
          availableServers: this.availableServers,
          connectedServers: this.connectedServers
        },
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.connectedServers) {
        console.log('resulted', result);
        this.connectedServers = result.connectedServers;
        console.log('connectedServers', this.connectedServers);

        this.appConfig.connectedServers = this.appConfig.connectedServers.filter(
          server => !!this.connectedServers.find(cs => cs.appId === server.appServerId)
        );
        this.connectedServers.forEach(cs => {
          const server = this.appConfig.connectedServers.find(s => s.appServerId === cs.appId);

          if (!server) {
            this.appConfig.connectedServers.push({
              appServerName: cs.appName,
              appServerId: cs.appId,
              connProtocol: cs.connectionProtocol,
              id: cs && cs.id ? cs.id : 'default',
              mode: cs.mode,
              timeoutLocal: cs.localTimeout,
              timeoutRemote: cs.remoteTimeout
            });
          }
        });
      }
    });
  }

  delConnServer(pos) {
    this.appConfig.connectedServers.splice(pos, 1);
    this.connectedServers.splice(pos, 1);
  }

  setUpgradeValue(event) {
    this.isUpgrade = event.checked;
  }

  public onSubmit(formValues) {
    if (this.isVirtual) {
      this.submitVirtualApp(formValues);
      return;
    }
    const data = {
      appId: formValues['application-id'],
      appName: formValues['application-name'],
      appPrototypeDBID: formValues['app-prototype-db-id'],
      applicationTemplate: formValues['application-template'],
      commandLine: formValues['command-line'],
      connectedServers: this.getConnectedServers(formValues),
      options: this.parseOptions(formValues),
      port: formValues['port'],
      redundancyType: formValues['redundancy-type'],
      serverInfo: {
        attempts: formValues['server-info-attempts'],
        backupServerDBID: formValues['server-info-backup-server-db-id'],
        host: formValues['server-info-host'],
        hostDBID: formValues['server-info-host-db-id'],
        name: formValues['server-info-name'],
        port: formValues['server-info-port'],
        timeout: formValues['server-info-timeout']
      },
      shutdownTimeout: formValues['shutdown-timeout'],
      startUpFlag: formValues['startup-flag'] && formValues['startup-flag'] !== '' ? true : false,
      startupTimeout: formValues['startup-timeout'],
      state: formValues['appState'] ? 'CFGEnabled' : 'CFGDisabled',
      tenantInfo: this.getTenantInfo(formValues),
      type: formValues['type'],
      upgradeVersion: formValues['upgrade-version'] && formValues['upgrade-version'] !== '' ? true : false,
      version: formValues['version'],
      workingDirectory: formValues['working-directory']
    };

    data.upgradeVersion = this.isUpgrade ? true : data.upgradeVersion;
    this.apiService.postExistingAppConfig(data.appId, data).subscribe(
      result => {
        this.toastr.success(`Application ${data.appName} saved successfully`);
        this.onCancel();
        this.updated.emit(true);

      },
      err => this.toastr.error(`Your changes are not saved. Please try again.`),
    );
  }

  public submitVirtualApp(formValues) {
    const data = {
      created: true,
      appConfig: {
        appId: formValues['application-id'],
        appName: formValues['application-name'],
        appPrototypeDBID: formValues['app-prototype-db-id'],
        applicationTemplate: formValues['application-template'],
        commandLine: formValues['command-line'],
        connectedServers: this.appConfig.connectedServers,
        options: this.parseOptions(formValues),
        port: formValues['port'],
        redundancyType: formValues['redundancy-type'],
        serverInfo: {
          attempts: formValues['server-info-attempts'],
          backupServerDBID: formValues['server-info-backup-server-db-id'],
          host: formValues['server-info-host'],
          hostDBID: formValues['server-info-host-db-id'],
          name: formValues['server-info-name'],
          port: formValues['server-info-port'],
          timeout: formValues['server-info-timeout']
        },
        workingDirectory: formValues['working-directory'],
        tenantInfo: this.getTenantInfo(formValues),
        shutdownTimeout: formValues['shutdown-timeout'],
        startUpFlag: formValues['startup-flag'] && formValues['startup-flag'] !== '' ? true : false,
        startupTimeout: formValues['startup-timeout'],
        state: formValues['appState'] ? 'CFGEnabled' : 'CFGDisabled',
        type: formValues['type'],
        upgradeVersion: true,
        version: formValues['version'],
        appDependency: formValues.appDependency,
        dependencyType: formValues.dependencyType,
        appDependencyVersion: formValues.appDependencyVersion
      },
      hostId: this.hostId,
      appName: formValues['application-name'],
      id: this.id,
      installed: false
    };

    if (this.chkFlag == 2) {
      this.apiService.addNewCopyHostApp(data).subscribe(res => {
        this.toastr.success(`Application ${data.appName} saved successfully`);
        // this.getEnvHosts();
        this.onCancel();
        this.updated.emit(true);
      }, err => {
        this.toastr.error(`Application ${data.appName} not saved`)
      })
    } else {
      this.apiService.addNewEnvHostApp(data).subscribe(
        result => {
          this.toastr.success(`Application ${data.appName} saved successfully`);
          this.updated.emit(true);
          this.onCancel();
        },
        err => this.toastr.error(`Application ${data.appName} not saved`)
      );
    }
  }

  setAppDependency(val) {
    this.appConfig.appDependency = val;
  }

  setAppState(val) {
    this.appState = val;
  }

  public parseOptions(formValues) {
    const options = {};
    if (this.appOptions) {
      this.appOptions.forEach(mainOption => {
        options[mainOption.name] = this.parseOptionsList(mainOption);
      });
    }


    return options;
  }

  public parseOptionsList(mainOption) {
    const options = {};

    mainOption.optionsList.forEach(option => options[option.key] = option.value);

    return options;
  }

  public getConnectedServers(formValues) {
    const connectedServersIds = this.connectedServers.map(cs => cs.appId);
    return connectedServersIds.map(sID => {
      const connectedServer = this.connectedServers.find(cs => cs.appId === sID);
      console.log('connectedServer', connectedServer);
      return {
        appServerName: formValues[sID + '-application-name'],
        appServerId: sID,
        connProtocol: formValues[sID + '-connection-protocol'],
        id: connectedServer && connectedServer.id ? connectedServer.id : 'default',
        mode: formValues[sID + '-mode'],
        timeoutLocal: formValues[sID + '-local-timeout'],
        timeoutRemote: formValues[sID + '-remote-timeout']
      };
    });
  }

  public getTenantInfo(formValues) {
    if (!this.appConfig.tenantInfo) {
      return [];
    }
    const tenantNames = this.appConfig.tenantInfo.map(ti => ti.tenantName);
    return tenantNames.map(tenant => {
      return {
        tenantName: formValues['tenant-name-' + tenant],
        tenantDBID: formValues['tenant-db-id-' + tenant],
        state: formValues['tenant-state-' + tenant]
      };
    });
  }

  public onAddSection() {
    const dialogRef = this.dialog.open(AddSectionDialogComponent, {
      width: '560px',
      panelClass: 'mwa-dialog',
      autoFocus: false,
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.key) {
        const section = {
          name: result.section,
          optionsList: [{
            key: result.key,
            value: result.value
          }]
        };
        this.appOptions.push(section);
      }
    });
  }

  public onAddOption(option) {
    console.log('add', option);
    const dialogRef = this.dialog.open(AddOptionDialogComponent, {
      width: '400px',
      panelClass: 'mwa-dialog',
      autoFocus: false,
      data: {
        existingOptions: option.optionsList,
        option: {
          key: null,
          value: null
        }
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.key) {
        this.appOptions = this.appOptions.map(o => {
          console.log('option', o);
          if (o.name === option.name) {
            o.optionsList.push({
              key: result.key,
              value: result.value
            });
          }

          return o;
        });
      }
    });
  }

  public onDeleteOption(option) {
    const dialogRef = this.dialog.open(RemoveOptionDialogComponent, {
      width: '560px',
      panelClass: 'mwa-dialog',
      autoFocus: false,
      data: {
        optionName: option.name
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('removeoption', result);
      this.appOptions = this.appOptions.filter(o => o.name !== option.name);
    });
  }

  public onCancel() {
    this.connectedServers = [];
    this.availableServers = [];
    this.appConfig = null;
    setTimeout(() =>
      this.appConfig = this.appConfigForm
    );
    this.loadData();
  }

  removeConnectedServer(option, index) {
    const dialogRef = this.dialog.open(RemoveOptionDialogComponent, {
      width: '560px',
      data: {
        optionName: option.name
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('removeoption', result);
      this.appConfig.connectedServers = this.appConfig.connectedServers.filter((o, i) => i !== index);
    });
  }

  getEnvOptions(res) {
    var appConfig
    res.forEach(firstarray => {
      if (firstarray.appDetails) {
        firstarray.appDetails.forEach(secondarray => {
          appConfig = secondarray.appConfig
          this.loadAppOptions(appConfig);
        })
      }
    })
  }

  getAllAppType() {
    this.apiService.getallapptype().subscribe(data => {
      this.getVersions()
      this.objlist(data)
    }, err => {
      console.log(err);
    })
  }

  public objlist(data) {
    const opt = []
    for (let index = 0; index < Object.keys(data.list).length; index++) {
      opt.push(data.list[index].propertyName)
    }
    this.allTypes = opt
  }

  getVersions() {
    if (this.appConfig.type != undefined) {
      this.apiService.getVerList(this.appConfig.type).subscribe((res: any[]) => {
        if (this.appConfig && this.appConfig.version && !res.includes(this.appConfig.version)) {
          res.push(this.appConfig.version);
        }
        this.versions = res
      }, err => {
        console.log(err);
      })
    }
  }

  // public verlist(data) {
  //   const opt = []
  //   for (let index = 0; index < Object.keys(data).length; index++) {
  //     opt.push(data[index])
  //   }
  //   this.versions = opt
  // }
}
