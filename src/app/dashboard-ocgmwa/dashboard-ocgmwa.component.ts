import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit, ElementRef } from "@angular/core";
import { MatDialog, MatDialogConfig, MatAccordion } from "@angular/material";
import { RemoveEnvironmentDialogComponent } from "../remove-environment-dialog/remove-environment-dialog.component";
import { AppDetailsComponent } from "../app-details/app-details.component";
import { AddApplicationDialogComponent } from "../dialogs/add-application-dialog/add-application-dialog.component";

import { DashboardService } from "../services/dashboard.service";
import { AutomatorApp } from "../models/automatorApp";
import { Host } from "../models/host";
import { FilterHost } from "../models/filterHost";
import { HostApp } from "../models/hostApp";
import { HostService } from "../services/host.service";
import { AutomatorApiService } from "../services/automator-api.service";
import { Login } from "../models/login";
import { Router, ActivatedRoute } from "@angular/router";
import { DataTransferService } from "../services/data-transfer.service";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../environments/environment";

import { flatMap } from 'lodash'
import { AppCloneDialogComponent } from "../components/app-clone-dialogue/app-clone-dialog.component";
import { CreateNewEnvDialogComponent } from "../components/create-new-env-dialogue/create-new-env-dialog.component";
import { CreateNewEnvHostDialogComponent } from "../components/create-new-env-host-dialogue/create-new-env-host-dialog.component";
import { EnvironmentListComponent } from "../environment-list/environment-list-dialog.component";
import { CreateNewEnvHostAppDialogComponent } from "../components/create-new-env-host-app-dialogue/create-new-env-host-app-dialog.component";
import { HostDialogComponent } from "../host-dialog/host-dialog.component";
import { EditHostDialogComponent } from "../components/edit-host-dialog/edit-host-dialog.component";
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { OneCGQuery } from "../store/query/one-test.query";
import { EnvType } from "../store/store/one-test.store";
import { switchMap } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { OnetestService } from "../store/service/one-test.service";

declare var $: any;
@Component({
  selector: 'app-dashboard-ocgmwa',
  templateUrl: './dashboard-ocgmwa.component.html',
  styleUrls: ['./dashboard-ocgmwa.component.scss']
})
export class DashboardOcgmwaComponent implements OnInit {
  menuExpand = 0;
  selectedApps: any;
  isCollapsedSwitch = true;
  isCollapsedCampaign = true;
  config = environment;

  newApps: any[] = [];
  newAppsToSave: any[] = [];

  // hostApps;
  active_hostId;

  appToAdd: any;
  hostAppToAdd: HostApp
  hosts: Host[];
  objectValue: any;
  v2Event: any;
  hostApps: HostApp[];
  filterHosts: FilterHost[] = [];
  filterHost: FilterHost;
  automatorApps: AutomatorApp[];
  filteredAutomatorApps: AutomatorApp[];
  appFilterQry = "";
  environmentDetails: EnvType[] = [];
  currentEnvironmentDetails: Login = new Login();
  selectedTransaction: any = [];

  automatorAppId: number;
  newSavedApps: any[] = [];
  newMovedApps: any[] = [];
  isDeployInProgress = false;
  deployId: number;
  newDeployableApps: any[] = [];
  switchValue: any;
  host = new Host();
  showUndeployed = true;
  deploySelectAll = false;
  /* add environment modal */
  visible = {
    isEnvComparison: false,
    isObjectVisible: true,
    isAuditVisible: false, isPromoteReportVisible: false, isAuditPermissionVisible: false,
    showEnvHosts: false, listEnvironments: false, applicationDeployment: false, promote: false, listCopyEnvironments: false
  }

  campaignValue: any;

  showType: boolean;
  contractSidebar: boolean;
  selectedAll = true;
  dragStart = false;
  currentZoom = 100;
  showEnvHosts = false;
  envHosts: any[];
  selectedEnvHost: any;
  selectedEnv: any;
  moveApp: any = {};
  private environmentListComponent: EnvironmentListComponent;
  existingApps: any[];
  hostInitialBg: any;
  targetHost: any;
  applicationsToDeploy: any;
  deploymentInterval: any;
  dontShowFlag: boolean;
  @ViewChild(EnvironmentListComponent)
  set Listcomponent(component: EnvironmentListComponent) {
    this.environmentListComponent = component;
  }

  searchApps: FormControl;
  authDetail: any = {};
  itemStateVal: string = '';//check app's state 
  itemState: boolean;

  activePage: string = null;
  showApplicationDeployment = false;

  constructor(
    public dialog: MatDialog,
    private dataTransferService: DataTransferService,
    private dashboardService: DashboardService,
    private hostService: HostService,
    private automatorApi: AutomatorApiService,
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private routerQuery: RouterQuery,
    private oneCGQuery: OneCGQuery,
    private activatedRoute: ActivatedRoute,
    private mwaOCGService: OnetestService
  ) {
    this.searchApps = new FormControl('');
    this.dataTransferService.currentAppActivity.subscribe(appActivity => {
      if (appActivity.action === "save") {
        this.newAppSaved(appActivity.data);
      }
      if (appActivity.action === "move") {
        this.newAppMoved(appActivity.data);
      }
    });

    this.dataTransferService.currentHostActivity.subscribe(appActivity => {
      if (appActivity.action === "save") {
        this.newHostAdded(appActivity.data);
      }
    });
  }
  ngOnInit() {
    this.loadAutomatorApps();
    this.loadEnvironmentUpdated();
    this.dataTransferService.changeSelectedAppDetails({});

    const mapEnvKeys = {
      oneconnect: 'oneConnect',
      onetrack: 'oneTrack',
      onechange: 'oneChange',
      onedesign: 'oneDesign',
      onetest: 'oneTest',
      home: 'home'
    };

    this.routerQuery.select().subscribe(res => {
      const sections = res.state.url.split('/');
      this.activePage = null;
      if (sections.length > 2) {
        this.activePage = sections[2];
      } else {
        this.activePage = 'oneconnect';

        const params = res.state.root.queryParams;
        if (params['active-env'] && params['active-env'] === 'new') {
          this.loadEnvironmentUpdated();
        }
      }
      let currentMapId = this.activePage;

      if (sections[1] === 'dashboard' && mapEnvKeys[currentMapId] && !this.config[mapEnvKeys[currentMapId]]) {
        this.router.navigateByUrl('/error/404');
      }
      if (this.contractSidebar) {
        this.menuExpand = 0;
      }
    });

    this.oneCGQuery.AllEnvironments().subscribe(res => {
      console.log(res)
      // this.environmentDetails = res;
    })
    this.searchApps.valueChanges.subscribe(val => {
      this.filterApps(val);
    });
  }

  loadEnvironmentUpdated() {
    this.automatorApi.getAllEnvironment().pipe(
      switchMap((response: any) => {
        if (response && typeof response.map == "function") {
          this.hostService.setHostList(
            (response || []).map(res => res.appName)
          );
        }

        this.environmentDetails = response;
        return this.activatedRoute.queryParams;
      })
    ).subscribe((res: any) => {
      if (res['active-env'] && res['active-env'] === 'new') {
        // this.loadSelectedEnv(this.environmentDetails[this.environmentDetails.length - 1]);
        this.loadHosts();
        // this.mwaOCGService.setPageNavigation(data.appName);
      } else if (this.environmentDetails.length > 0) {
        this.loadSelectedEnv(this.environmentDetails[0]);
      }
    });
  }


  loadSelectedEnv(data) {
    this.automatorApi.loginEnvironment(data).subscribe(
      response => {
        sessionStorage.setItem("sesId", response.sessionId);
        this.currentEnvironmentDetails = data;
        this.automatorApi.setSessionId(response.sessionId);
        this.loadHosts();
        this.mwaOCGService.setPageNavigation(data.appName);
        this.toastr.success(
          "Environment Loaded Successfully",
          "Success!"
        );
      },
      err => {
        this.toastr.error(
          `Oops...Not able to load environment, please check the credential.`,
          "Failed!"
        );
      }
    );
  }

  loadHosts() {
    this.dashboardService.getAllHosts().subscribe(
      hosts => {
        this.hosts = hosts;
        this.filterHosts = hosts.map(host =>
          Object.assign(host, { selected: true })
        );
        if (this.filterHosts.length) {
          this.getHostApplications(this.filterHosts[0].hostId)
        }

        // .filter((host, i) => i < 100);
      },
      err => {
        // swal("Get All Hosts Service Called Error Response..","",err);
      }
    );
  }

  onDragStart(dragStart: boolean) {

  }

  changeZoom(currentZoom: number) {
    this.currentZoom = currentZoom;
  }

  dnClick(eventArgs) {
    this.visible.isObjectVisible = true;
    this.visible.applicationDeployment = false;
    this.visible.isAuditVisible = false;
    this.visible.showEnvHosts = false;
    this.visible.isPromoteReportVisible = false;
    this.visible.isAuditPermissionVisible = false;
    this.visible.listEnvironments = false;
    this.visible.listCopyEnvironments = false;
    this.visible.promote = false;
    this.removeRrefreshInterval();
    this.automatorApi
      .getPlacesForSwitch(
        eventArgs.value.target.innerText.toLowerCase(),
        eventArgs.dbid
      )
      .subscribe(result => {
        this.v2Event = eventArgs.value.target.innerText;
        this.objectValue = result;
        this.showType = eventArgs.showType;
      });
  }

  campaignGroupClick(eventArgs) {
    this.visible.isObjectVisible = true;
    this.visible.applicationDeployment = false;
    this.visible.isAuditVisible = false;
    this.visible.showEnvHosts = false;
    this.visible.isPromoteReportVisible = false;
    this.visible.isAuditPermissionVisible = false;
    this.visible.listEnvironments = false;
    this.visible.listCopyEnvironments = false;
    this.visible.promote = false;
    this.removeRrefreshInterval();
    this.automatorApi
      .getCampaignGroupForCampaign(
        eventArgs.value.target.innerText.toLowerCase(),
        eventArgs.dbid
      )
      .subscribe(result => {
        this.v2Event = eventArgs.value.target.innerText;
        this.objectValue = result;
      });
  }

  cloneAppDialog(): void {
    const dialogRef = this.dialog.open(AppCloneDialogComponent, {
      width: "600px",
      height: "700px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (typeof result == "object") {
        this.automatorApi.cloneApps(result)
          .subscribe(res => {
            this.toastr.success(
              "App cloned Successfully...",
              "Success!"
            );
          }, err => {
            this.toastr.error(
              `Oops...Not able to clone the application, please check the credential.`,
              "Failed!"
            );
          })
      }
    })

  }

  editHostDialog(hostId): void {
    const dialogConfig: any = {};
    dialogConfig.autoFocus = false;
    dialogConfig.width = '500px';
    dialogConfig.height = '600px';
    dialogConfig.data = { hostId };
    const dialogRef = this.dialog.open(EditHostDialogComponent, {
      ...dialogConfig, panelClass: 'mwa-dialog'
    });
    dialogRef.afterClosed().subscribe(hostData => {
      if (hostData) {
        hostData.hostId = hostId;
        this.automatorApi.updateHost(hostData)
          .subscribe(res => {
            this.toastr.success(`Host Updated successfully!!`, 'Success!');
            this.loadHosts();
          }, err => {
            this.toastr.error(`Error in updating the host!!`, 'Error!');
          })
      }
    })
  }

  openHostDialog(): void {
    const dialogConfig: any = {};
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.height = '700px';
    dialogConfig.data = {};
    const dialogRef = this.dialog.open(HostDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(hostData => {
      if (hostData) {
        const hostDataToSave = {
          'hostName': hostData.hostName,
          'ip': hostData.ip,
          'username': hostData.username,
          'password': hostData.password,
          'osType': hostData.osType,
          'version': hostData.version,
          'solutionControlCenter': hostData.solutionControlCenter,
          'startUpflag': hostData.startUpflag,
          'state': hostData.state ? 'CFGEnabled' : 'CFGDisabled'
        };

        this.hostService.saveNewHost([hostDataToSave])
          .subscribe(
            response => {
              if (response[0].status) {
                this.toastr.error(`Error occured... not able to add the host, error: ${response[0].reason}`, 'Oops!');
              } else {
                this.toastr.success(`Host ${response[0].hostName} added successfully!! Please Refresh the page.`, 'Success!');
                this.dataTransferService.changeNewHostActivity({ action: 'save', data: response[0] });
              }
            },
            err => {
              console.log('Add new host failed..', err);
            });
      }

    });
  }


  removeEnvironment(_environment): void {
    const dialogRef = this.dialog.open(RemoveEnvironmentDialogComponent, {
      width: "420px",
      autoFocus: false,
      panelClass: 'mwa-dialog',
      data: _environment.appName
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result !== "cancel") {
        this.automatorApi
          .removeEnvironment(_environment.appName)
          .subscribe(
            response => {
              this.logOut(_environment);
              this.visible.isObjectVisible = false;
              this.visible.applicationDeployment = false;
              this.visible.isAuditVisible = false;
              this.visible.showEnvHosts = false;
              this.visible.isPromoteReportVisible = false;
              this.visible.isAuditPermissionVisible = false;
              this.visible.listEnvironments = false;
              this.visible.listCopyEnvironments = false;
              this.visible.promote = false;
              this.removeRrefreshInterval();
              this.toastr.success(
                "Enviroment removed Successfully...",
                "Success!"
              );
              this.environmentDetails = this.environmentDetails.filter(item => item.appName != _environment.appName);
            },
            err => {
              this.toastr.error(
                `Oops...Not able to remove environment.`,
                "Failed!"
              );
            }
          );
      }
    });
  }

  getAllApps(event: any) {
    this.selectedApps = [];
    this.selectedApps = event.allApps;
    $("#myModal").modal("show");
  }

  getSelectedTransaction(event: any) {
    this.dataTransferService.changeSelectedAppDetails(event);
  }

  newHostAdded(newHostData) {
    this.hosts = this.hosts.concat(newHostData as Host);
  }

  newAppMoved(newAppData) {
    this.newMovedApps.push(newAppData);
  }

  newAppSaved(newAppData) {
    this.newSavedApps.push(newAppData);
  }

  showHidePanelFn() {
    this.contractSidebar = !this.contractSidebar;
  }

  openAppDetailDialog(): void {
    const dialogRef = this.dialog.open(AppDetailsComponent, {
      width: "350px"
    });
    dialogRef.afterClosed().subscribe(result => { });
  }

  loadAutomatorApps() {
    this.automatorApi.getAllAppsOneConnect().subscribe(
      (automatorApps: any) => {
        if (automatorApps && automatorApps.list) {
          this.automatorApps = automatorApps.list;
          this.filterApps();
        }
      },
      err => {
        // swal('Get All Automator Apps Service Called Error Response..','', err);
      }
    );
  }

  testingBasicAuth() {
    const detail = {
      Username: "admin@automator.com",
      Password: "password"
    };
    this.dashboardService
      .basicAuth(detail)
      .subscribe(response => { }, err => { });
  }

  filterApps(query = '') {
    const q = query.trim();
    this.filteredAutomatorApps = this.automatorApps.filter(
      (app: any) =>
        q === '' ||
        app.mappedName
          .toLowerCase()
          .includes(q.toLowerCase())
    );
  }

  filterHostApp(host, e) {
    if (e.target.checked) {
      this.filterHosts.push(host);
    } else {
      this.filterHosts = this.filterHosts.filter(obj => obj !== host);
    }
  }

  get visiblefilterHostsList() {
    return this.filterHosts.filter(i => i.selected);
  }

  selectAll() {
    for (let i = 0; i < this.filterHosts.length; i++) {
      this.filterHosts[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected(host, event) {
    if (host.hostId === this.active_hostId && !event.checked) {
      this.active_hostId = null;
      this.existingApps = [];
    }
    this.selectedAll = this.filterHosts.every(function (item: any) {
      return item.selected === true;
    });
  }

  getSelectedHosts() {
    let filtereredHosts = this.filterHosts.filter(x => x.selected === true)
    //this.getHostApplications(filtereredHosts[0])
    return filtereredHosts;
  }

  getHostApplications(hostId?) {
    this.hostApps = [];
    this.active_hostId = hostId;
    hostId = hostId === undefined ? this.host.hostId : hostId;
    if (hostId) {
      this.hostService.getHostApplications(hostId).subscribe(
        _hostApps => {
          _hostApps.forEach(app => {
            // if(this.newDeployableApps.indexOf(app.appId)!=-1){
            // 	app.status='saved';
            // }
          })
          if (_hostApps.length) {
            this.hostApps = _hostApps;
            this.getExistingAndNewApps(this.hostApps);
            this.cdr.detectChanges();
          } else {
            this.existingApps = [];
          }
        },
        err => {
          this.hostApps = [];
          // console.log('Get All Host Apps Service Called Error Response..', err);
        }
      );
    }
  }

  trackByHostId(index, host) {
    return host.hostId;
  }

  filterHostAppAll(hosts, e) {
    if (e.target.checked) {
      for (const host of hosts) {
        this.filterHosts.push(host);
      }
    } else {
      for (const host of hosts) {
        this.filterHosts = this.filterHosts.filter(obj => obj !== host)
      }
    }
  }

  onAppSelected(application) {
    console.log('application', application)
  }

  public drag(event, automatorApp: AutomatorApp) {
    this.dragStart = true;
    this.appToAdd = automatorApp
    document.getElementById('oc-copy-app-area').classList.add('hot-pan');
    event.dataTransfer.setData(
      "automatorApp",
      JSON.stringify(automatorApp)
    );
  }
  public dragApp(event, hostApp: HostApp) {
    event.target.style['border-width'] = '2px';
    event.target.style['border-style'] = 'solid';
    event.target.style['border-color'] = 'white';
    // event.target.style.opacity=1;
    this.dragStart = true;
    this.hostAppToAdd = hostApp;

    event.dataTransfer.setData(
      "hostApp",
      JSON.stringify(hostApp)
    );
    document.getElementById('oc-copy-app-area').classList.add('hot-pan');
  }
  public dragAppEnd(event) {
    //event.target.style.border='none';
    event.target.style['border-width'] = '0';
    event.target.style['border-style'] = 'none';
    event.target.style['border-color'] = 'none';
    this.dragStart = false;

    const targetElement = document.elementFromPoint(event.pageX, event.pageY)
    const hostId = this.getEnvironmentAttributesFromParents(targetElement)

    document.getElementById('oc-copy-app-area').classList.remove('hot-pan');

    console.log("Host id: ", hostId)
    if (hostId === 0) {
      this.toastr.error("No target host found to add application")
      return
    }
    const host = this.hosts.find(host => host.hostId === hostId)
    if (!host || !host.hostName) {
      this.toastr.error("No target host found to add application")
      return
    }

    this.automatorApi.getExistingAppConfig(this.hostAppToAdd.appId).subscribe(data => {
      // console.log(data);
      let result = data;
      this.moveApp.appId = this.hostAppToAdd.appId;
      this.moveApp.fromHostId = result['serverInfo'].hostDBID;
      this.moveApp.toHostId = hostId;
      if (this.moveApp.fromHostId == this.moveApp.toHostId) {
        return;
      }
      let arr = [];
      arr.push(this.moveApp);
      this.moveApplication(arr);
    }, err => {
      console.log(err);
      this.toastr.error(
        "Error in moving application...",
        "Error!"
      );
    })
  }

  onDragOverHost($event) {
    if ($event.currentTarget.tagName == 'LI') {
      this.targetHost = $event.currentTarget;
      $event.stopPropagation();
      $event.currentTarget.style['border-width'] = '2px';
      $event.currentTarget.style['border-style'] = 'solid';
      $event.currentTarget.style['border-color'] = 'white';
    }

  }
  onDragOverHostLeave($event) {
    $event.currentTarget.style['border-width'] = '0';
    $event.currentTarget.style['border-style'] = 'none';
    $event.currentTarget.style['border-color'] = 'none';
  }
  moveApplication(arr) {
    console.log(arr);

    this.automatorApi.moveApp(arr).subscribe(data => {
      this.toastr.success(
        "Moved application successfully...",
        "Success!"
      );
      console.log(data);
      this.getHostApplications(this.active_hostId)
      if (this.targetHost) {
        this.targetHost.classList.add('moved-success');
        setTimeout(() => this.targetHost.classList.remove('moved-success'), 2000);
      }
    }, err => {
      console.log(err);
      if (this.targetHost) {
        this.targetHost.style.backgroundColor = 'red'
      }
      this.toastr.error(
        "Error in moving application...",
        "Error!"
      );
    })
  }


  public getEnvironmentAttributesFromParents(targetElement) {
    const elementWithAttr = targetElement.closest("[data-target-environment]")
    console.log('closest', {
      elementWithAttr
    })

    if (elementWithAttr && elementWithAttr.attributes && elementWithAttr.attributes['data-target-environment']) {
      console.log('atrrrrr', elementWithAttr.attributes['data-target-environment'].value)
      return parseInt(elementWithAttr.attributes['data-target-environment'].value, 0)
    }
    // return targetElement.closest("[data-target-environment]").attributes("[data-target-environment]").value
  }

  public dragEnd(event) {
    this.dragStart = false;

    const targetElement = document.elementFromPoint(event.pageX, event.pageY);
    document.getElementById('oc-copy-app-area').classList.remove('hot-pan');

    const hostId = this.getEnvironmentAttributesFromParents(targetElement)

    if (hostId === 0) {
      this.toastr.error("No target environment found to add application")
      return
    }

    const host = this.hosts.find(host => host.hostId === hostId)

    if (!host || !host.hostName) {
      this.toastr.error("No target environment found to add application")
      return
    }

    const dialogRef = this.dialog.open(AddApplicationDialogComponent, {
      width: '720px',
      panelClass: 'mwa-dialog',
      autoFocus: false,
      data: {
        appId: this.appToAdd.propertyName,
        targetEnvironmentId: hostId,
        targetEnvironmentName: host ? host.hostName : ''
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.appToAdd = null;
      if (result && result != 'cancel') {
        this.newApps.push({
          automatorAppId: result.automatorAppId,
          appName: result.appName,
          config: {
            appName: result.appName,
            connectedServers: result.config.connectedServers,
            port: result.config.port,
            serverInfo: result.config.serverInfo,
            startUpFlag: result.config.startupFlag,
            state: result.config.state,
            symbolicLink: result.config.symbolicLink,
            type: result.config.type,
            version: result.config.version,
            workingDirectory: result.config.workingDirectory,
            applicationTemplate: result.config.applicationTemplate,
            appPrototypeDBID: result.config.appPrototypeDBID,
            appDependency: result.config.appDependency,
            dependencyType: result.config.dependencyType,
            appDependencyVersion: result.config.appDependencyVersion
          },
          hostId: result.hostId,
          isNewApp: true
        });
        this.getExistingAndNewApps(this.hostApps)
      }
    });
  }

  public drop(event) {
    console.log('drop', event)
  }


  getExistingAndNewApps(hostApps) {
    this.existingApps = hostApps ? this.newApps.concat(hostApps) : this.newApps
    // return this.hostApps
  }

  logOut(_environment) {
    this.currentEnvironmentDetails = null;
    this.filterHosts = [];

    // this.environmentDetails = this.environmentDetails.filter(function (
    //   e,
    //   index
    // ) {
    //   return e !== _environment;
    // });
    // if (this.environmentDetails.length > 0) {
    //   this.loadEnvironment(this.environmentDetails[0]);
    // } else {
    //   sessionStorage.removeItem("sesId");
    //   sessionStorage.removeItem("authDetail");
    //   this.router.navigate(["login"]);
    // }
  }
  // toggleUserSetting(){
  //   this.displaySetting = this.displaySetting == 'none' ? 'block' : 'none';
  // }

  deployApplications() {
    this.showApplicationDeployment = true;
    this.getApplicationsToDeploy()
  }

  cancelDeploy() {
    this.showApplicationDeployment = false;
  }

  getApplicationsToDeploy() {
    this.deploySelectAll = false;
    this.automatorApi.getApplicationsToDeploy(this.showUndeployed ? 'Undeployed' : 'All')
      .subscribe(res => {
        this.applicationsToDeploy = res;
      })

  }

  onDeployTypeChange() {
    this.getApplicationsToDeploy();
  }

  onDeploySelectAll() {
    this.applicationsToDeploy.forEach(app => {
      if (!app.deployed) {
        app.checked = this.deploySelectAll;
      }

    })
  }

  refereshList(){
    this.showUndeployed = false;
    this.getApplicationsToDeploy();
  }

  onDeployItemChange() {
    if (this.applicationsToDeploy.filter(
      item => item.checked
    ).length == this.applicationsToDeploy.filter(
      item => !item.deployed
    ).length) {
      this.deploySelectAll = true;
    } else {
      this.deploySelectAll = false;
    }

  }

  startDeployment() {
    let apps = [];
    this.applicationsToDeploy.forEach(app => {
      if (!app.deployed && app.checked) {
        apps.push(app.appId)
      }
    })
    if (apps.length) {
      this.automatorApi.deployApplications(apps)
        .subscribe(res => {
          this.toastr.success('Initiate application deployment successfully', 'Success');
          this.deploySelectAll = false;
          this.applicationsToDeploy.forEach(app => app.checked = false);
          this.removeRrefreshInterval();
          this.refreshDeploment();
        }, err => {
          this.toastr.success('Initiating application deployment failed', 'Error')
        })
    }

  }

  refreshDeploment() {
    this.deploymentInterval = setInterval(
      this.getApplicationsToDeploy, 2000
    )
  }

  removeRrefreshInterval() {
    if (this.deploymentInterval) {
      clearInterval(this.deploymentInterval);
      this.deploymentInterval = undefined;
    }
  }
  //call to deploy the applications
  deploySessionApps() {
    this.isDeployInProgress = true;
    this.newDeployableApps.forEach(appId =>

      this.dataTransferService.changeNewAppActivity({
        action: "deploy_start",
        data: appId
      })
    );
    this.dashboardService.deployApps().subscribe(
      deployAppResp => {
        // console.log('Deploy app response came..', deployAppResp);
        this.deployId = deployAppResp.id;

        this.getDeploymentStatus(deployAppResp);

      },
      err => {
        this.isDeployInProgress = false;
        this.existingApps.forEach(app => {
          this.newDeployableApps.forEach(dApp => {
            if (app.appId == dApp.appId) {
              app.status = 3;
            }
          })
        })
        // console.log('Deploy app response Error came..', err);
        this.newDeployableApps.forEach(appId =>
          this.dataTransferService.changeNewAppActivity({
            action: "deploy_status",
            data: {
              appId,
              status: 1,
              reason: "Internal Server Error."
            }
          })
        );
      }
    );
  }

  getDeploymentStatus(deployAppResp) {
    switch (deployAppResp.status) {
      case 0: // Success
        this.existingApps.forEach(app => {
          this.newDeployableApps.forEach(id => {
            if (app.appId == id) {
              app.status = 2;
            }
          })
        })
        this.deployId = null;
        this.isDeployInProgress = false;
        this.toastr.success(
          "Apps deployed, Please check the status on app box",
          "Success!"
        );
        deployAppResp.responses.forEach(response =>
          this.dataTransferService.changeNewAppActivity({
            action: "deploy_status",
            data: response
          })
        );
        this.loadHosts();
        break;
      case 1: // Failed
        this.isDeployInProgress = false;
        // console.log('Failed status response from deploy..');
        this.toastr.error("Error occured... during deploy", "Oops!");
        break;
      case 255: // In-Progress
        setTimeout(() => {
          this.dashboardService
            .getDeploymentStatus(this.deployId)
            .subscribe(
              deployAppStatusResp => {
                // console.log('Deploy status response came..', deployAppStatusResp);
                this.getDeploymentStatus(deployAppStatusResp);
              },
              err => {
                // console.log('Deploy status response Error came..', err);
              }
            );
        }, 10 * 1000);
        break;
    }
  }

  saveAllNewApps() {
    // console.log('Data To Save App::', JSON.stringify(this.newSavedApps));
    if (this.newApps.length) {
      this.dashboardService
        .saveNewAppConfigs(this.newApps)
        .subscribe(
          saveAppResp => {
            // console.log('Save app response came..', saveAppResp);
            this.toastr.success("All new applications saved successfully");
            this.newApps = [];
            this.newDeployableApps = [];
            saveAppResp.forEach(rec => {
              console.log('app to save', rec);
              this.existingApps.forEach(eApp => {
                if (eApp.appName == rec.appName) {
                  eApp.appId = rec.appId
                }
              })
              this.newDeployableApps.push(rec.appId);
              const elementKey = `${rec.hostId}>>${
                rec.automatorAppId
                }>>${this.getKeyByName(rec.appName)}`;
              this.dataTransferService.changeNewAppActivity({
                action: "save_status",
                data: {
                  elementKey,
                  status: rec.status,
                  reason: rec.reason,
                  appId: rec.appId,
                  appName: rec.appName
                }
              });
            });
            //this.getHostApplications(this.active_hostId)
          },
          err => {
            // console.log('Save app response Error came..', err);
            this.toastr.error(
              "Error occured while saving applications",
              "Oops!"
            );
          }
        );
    }
    if (this.newMovedApps.length) {
      this.dashboardService.moveApp(this.newMovedApps).subscribe(
        movedAppResp => {
          this.newMovedApps.forEach(app => {
            app.status = 'saved';
          })
          this.toastr.success("All moved applications saved successfully");
          // console.log('Move app response came..', movedAppResp);
          this.newMovedApps = [];
          this.newDeployableApps = [];
          movedAppResp.forEach(rec => {
            this.newDeployableApps.push(rec.newAppId);
            this.dataTransferService.changeNewAppActivity({
              action: "move_status",
              data: rec
            });
          });
        },
        err => {
          // console.log('Move app response Error came..', err);
          this.toastr.error(
            "Error occured... during app move",
            "Oops!"
          );
        }
      );
    }
  }

  getKeyByName(value: string) {
    return !!value ? value.toUpperCase().replace(/\s+/g, "_") : "";
  }

  auditHistory() {
    this.visible.isObjectVisible = true;
    this.visible.applicationDeployment = false;
    this.visible.listEnvironments = false;
    this.visible.listCopyEnvironments = false;
    this.visible.showEnvHosts = false;
    this.visible.isAuditVisible = true;
    this.visible.isPromoteReportVisible = false;
    this.visible.isAuditPermissionVisible = false;
    this.visible.isEnvComparison = false;
    this.visible.promote = false;
    this.removeRrefreshInterval();
  }

  auditPermission() {
    this.visible.isObjectVisible = true;
    this.visible.applicationDeployment = false;
    this.visible.listEnvironments = false;
    this.visible.listCopyEnvironments = false;
    this.visible.showEnvHosts = false;
    this.visible.isAuditVisible = false;
    this.visible.isPromoteReportVisible = false;
    this.visible.isAuditPermissionVisible = true;
    this.visible.isEnvComparison = false;
    this.visible.promote = false;
    this.removeRrefreshInterval();
  }

  showPromoteReport() {
    this.visible.isObjectVisible = true;
    this.visible.applicationDeployment = false;
    this.visible.listEnvironments = false;
    this.visible.listCopyEnvironments = false;
    this.visible.showEnvHosts = false;
    this.visible.isPromoteReportVisible = true;
    this.visible.isAuditPermissionVisible = false;
    this.visible.isAuditVisible = false;
    this.visible.isEnvComparison = false;
    this.visible.promote = false;
    this.removeRrefreshInterval();
  }

  showsEnviormentList() {
    this.visible.isObjectVisible = true;
    this.visible.applicationDeployment = false;
    this.visible.listEnvironments = true; this.visible.listCopyEnvironments = true;
    this.visible.showEnvHosts = false;
    this.visible.isPromoteReportVisible = false;
    this.visible.isAuditPermissionVisible = false;
    this.visible.isAuditVisible = false;
    this.visible.isEnvComparison = false;
    this.visible.promote = false;
    this.removeRrefreshInterval();
  }

  ObjectClick(val, showType = false) {
    this.dashboardService.closeApplicationConfig(); // closing the any appConfigDetails;
    val = typeof val === "string" ? val : val.target.innerText;
    this.visible.isObjectVisible = true;
    this.visible.applicationDeployment = false;
    this.visible.showEnvHosts = false;
    this.visible.listEnvironments = false;
    this.visible.listCopyEnvironments = false;
    this.visible.isAuditVisible = false;
    this.visible.isPromoteReportVisible = false;
    this.visible.promote = false;
    this.removeRrefreshInterval();
    this.automatorApi.getPlaces(val.toLowerCase()).subscribe(
      result => {
        this.v2Event = val;
        this.objectValue = result;
        this.showType = showType;
        // console.log(this.objectValue);
      },
      error => {
        console.log("error occured.....", error);
      }
    );
    // this.automatorApi.getPlaces(val.target.innerText.substr(2)).subscribe(result=>{
    // const dialogRef = this.dialog.open(OpenObjectDialogComponent, {
    //   width: '420px',
    //   height:'600px',
    //   data:result,
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if(result && result!='cancel')
    //   {
    //     this.automatorApi.removeEnvironment(environment.appName)
    //     .subscribe(response=>{
    //       this.logOut(environment);
    //       this.toastr.success('Enviroment removed Successfully...', 'Success!');
    //      },
    //     err =>{
    //       this.toastr.error(`Oops...Not able to remove environment, please check the credential.`, 'Failed!');
    //     });
    //   }
    // });
    // });
  }

  promoteEnvironment(env) {
    this.visible.isObjectVisible = true;
    this.visible.applicationDeployment = false;
    this.visible.showEnvHosts = false;
    this.visible.listEnvironments = false;
    this.visible.listCopyEnvironments = false;
    this.visible.isAuditVisible = false;
    this.visible.isPromoteReportVisible = false;
    this.visible.isEnvComparison = false;// for preventing one comparison on one promote
    this.visible.promote = true;
  }

  createNewEnvHostDialog() {
    const dialogRef = this.dialog.open(CreateNewEnvHostDialogComponent, {
      width: "600px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && typeof result == "object") {
        result.cfgServId = this.selectedEnv.id;
        this.automatorApi.addNewEnvHost(result)
          .subscribe(res => {
            this.toastr.success(
              "New Environment Host Created Successfully...",
              "Success!"
            );
            this.getEnvHosts();
          }, err => {
            this.toastr.error(
              `Oops...Not able to create Environment Host.`,
              "Failed!"
            );
          })
      }
    })
  }

  editEnvHostDialog(host) {
    const dialogRef = this.dialog.open(CreateNewEnvHostDialogComponent, {
      width: "600px",
      data: { host: host }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && typeof result == "object") {
        result.cfgServId = this.selectedEnv.id;
        this.automatorApi.addNewEnvHost(result)
          .subscribe(res => {
            this.toastr.success(
              "New Environment Host Created Successfully...",
              "Success!"
            );
            this.getEnvHosts();
          }, err => {
            this.toastr.error(
              `Oops...Not able to create Environment Host.`,
              "Failed!"
            );
          })
      }
    })
  }

  switchClick(value) {
    this.visible.isObjectVisible = true;
    this.visible.applicationDeployment = false;
    this.visible.listEnvironments = false;
    this.visible.listCopyEnvironments = false;
    this.visible.showEnvHosts = false;
    this.visible.isAuditVisible = false;
    this.visible.isPromoteReportVisible = false;
    this.visible.promote = false;
    this.removeRrefreshInterval();
    this.automatorApi.getPlaces(value).subscribe(result => {
      this.v2Event = value;
      this.objectValue = result;
      this.switchValue = result;
      // console.log(this.objectValue);
    });
    // this.automatorApi.getPlaces(value).subscribe(result=>{
    //   this.switchValue = result;
    // });
  }

  campaignClick(value) {
    this.visible.isObjectVisible = true;
    this.visible.applicationDeployment = false;
    this.visible.isAuditVisible = false;
    this.visible.showEnvHosts = false;
    this.visible.listEnvironments = false; this.visible.listCopyEnvironments = false;
    this.visible.isPromoteReportVisible = false;
    this.visible.promote = false;
    this.removeRrefreshInterval();
    this.automatorApi.getPlaces(value).subscribe(result => {
      this.v2Event = value;
      this.objectValue = result;
      this.campaignValue = result;
    });
  }

  listEnvironmentsFun() {
    this.visible.listEnvironments = true;
    this.visible.isObjectVisible = true;
    this.visible.applicationDeployment = false;
    this.visible.showEnvHosts = false;
    this.visible.isAuditVisible = false;
    this.visible.isPromoteReportVisible = false;
    this.visible.isAuditPermissionVisible = false;
    this.visible.isEnvComparison = false;
    this.visible.promote = false;
    //cpy env
    this.visible.listCopyEnvironments = false;
    this.removeRrefreshInterval();
  }
  listCopyEnvironmentsFun() {
    this.visible.listEnvironments = false;
    this.visible.listCopyEnvironments = true;
    this.visible.isObjectVisible = true;
    this.visible.applicationDeployment = false;
    this.visible.showEnvHosts = false;
    this.visible.isAuditVisible = false;
    this.visible.isPromoteReportVisible = false;
    this.visible.isAuditPermissionVisible = false;
    this.visible.isEnvComparison = false;
    this.visible.promote = false;
    this.removeRrefreshInterval();
  }

  onEnvRowSelect(row) {
    this.selectedEnv = row;
    row.appName = row.envName;
    this.currentEnvironmentDetails = row;
    this.getEnvHosts();
  }

  onCopyEnvRowSelect(row) {
    this.selectedEnv = row;
    row.appName = row.envName;
    this.currentEnvironmentDetails = row;
    this.getCopyEnvHosts();
  }


  getCopyEnvHosts() {
    this.automatorApi.getNewCopyEnvConfig(this.selectedEnv.id)
      .subscribe((res: any[]) => {
        this.envHosts = res;
        if (res.length) {
          this.selectedEnvHost = res[0];
        }
        this.visible.showEnvHosts = true;
        this.visible.listEnvironments = false;
        this.visible.listCopyEnvironments = false;
        this.visible.isObjectVisible = true;
        this.visible.applicationDeployment = false;
        this.visible.isAuditVisible = false;
        this.visible.isPromoteReportVisible = false;
        this.visible.isAuditPermissionVisible = false;
        this.visible.promote = false;
        this.removeRrefreshInterval();
      }, err => {

      })
  }
  getEnvHosts() {
    this.automatorApi.getNewEnvConfig(this.selectedEnv.id)
      .subscribe((res: any[]) => {
        this.envHosts = res;
        if (res.length) {
          this.selectedEnvHost = res[0];
        }
        this.visible.showEnvHosts = true;
        this.visible.listEnvironments = false;
        this.visible.listCopyEnvironments = false;
        this.visible.isObjectVisible = true;
        this.visible.applicationDeployment = false;
        this.visible.isAuditVisible = false;
        this.visible.isPromoteReportVisible = false;
        this.visible.isAuditPermissionVisible = false;
        this.visible.promote = false;
        this.removeRrefreshInterval();
      }, err => {

      })
  }
  setSelectedEnvHost(host) {
    this.selectedEnvHost = host;
  }

  addHostApplication(hostId) {
    const dialogRef = this.dialog.open(CreateNewEnvHostAppDialogComponent, {
      width: "800px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && typeof result == "object") {
        result.hostId = hostId;
        this.automatorApi.addNewEnvHostApp(result)
          .subscribe(res => {
            this.toastr.success(
              "New Environment Host Application Created Successfully...",
              "Success!"
            );
            this.getEnvHosts();
          }, err => {
            this.toastr.error(
              `Oops...Not able to create Environment Host Application.`,
              "Failed!"
            );
          })
      }
    })
  }

  deployEnv() {
    this.automatorApi.deployEnvironment(this.selectedEnv.id)
      .subscribe(res => {
        this.toastr.success(
          "Deployed Environment Successfully...",
          "Success!"
        );
      }, err => {

      })
  }

  deployConfigServer() {
    this.automatorApi.deployConfigServer(this.selectedEnv.id)
      .subscribe(res => {
        this.toastr.success(
          "Deployed Config server Successfully...",
          "Success!"
        );
      }, err => {

      })
  }

  redeployApps() {
    this.automatorApi.redeployApplications(this.selectedEnv.id)
      .subscribe(res => {
        this.toastr.success(
          "Redeployed applications Successfully...",
          "Success!"
        );
      }, err => {

      })
  }

  deleteAppById(appId, $event) {
    $event.stopPropagation();
    this.automatorApi.deleteAppById(appId).subscribe(result => {
      this.toastr.success(`Application deleted successfully`, 'Success!');
      if (this.visible.showEnvHosts) {
      } else {
        this.existingApps.forEach((app, i) => {
          if (appId == app.appId) {
            this.existingApps.splice(i, 1)
          }
        })
      }

    }, err => {
      this.toastr.error(`Not able to delete application`, 'Failed!');
    })
    return;
    if (appId && appId.id) {
      this.automatorApi.delCopyEnvApp(appId).subscribe(result => {
        //testsal,testtap deleted
        this.getCopyEnvHosts();
        this.toastr.success(
          "Application deleted",
          "Success!"
        );
      }, err => {
        console.log("got error: ", err);
      })

    } else {

      $event.stopPropagation();
      this.automatorApi.deleteAppById(appId).subscribe(result => {
        // this.toastr.success(`Application deleted successfully`,'Success!');
        // if(this.visible.showEnvHosts){
        // }else{
        // 	this.existingApps.forEach((app,i)=>{
        // 		if(appId==app.appId){
        // 			this.existingApps.splice(i,1)
        // 		}
        // 	})
        // }

      }, err => {
        console.log("got error: ", err);
        this.getHostApplications(this.active_hostId);
        // this.toastr.error(`Not able to delete application`,'Failed!');
      })
    }
  }

  delVirApp(appId, $event) {
    if (appId && appId.id != 0) {
      $event.stopPropagation();
      this.automatorApi.delVirEnvApp(appId.id).subscribe(result => {
        this.getEnvHosts();
      }, err => {
        console.log("got error: ", err);
      })
    }
  }

  openAppById(item, $event) {
    if (item.appId != 0) {
      this.existingApps.forEach(mItem => {
        if (mItem.appId != item.appId) {
          mItem.selected = false;
        }
      })
      item.isUpgrade = true;
      item.selected = true;
    }
  }

  disableAppById(appId, status, $event) {
    let state = 'disabled';
    $event.stopPropagation();
    let appName = '';
    this.automatorApi.getExistingAppConfig(appId)
      .pipe(
        switchMap((appConfig: any) => {
          appConfig.state = appConfig.state == 'CFGEnabled' ? 'CFGDisabled' : 'CFGEnabled';
          state = appConfig.state == 'CFGEnabled' ? 'Enabled' : 'Disabled';
          appName = appConfig.appName;
          return this.automatorApi.postExistingAppConfig(appId, appConfig);
        })
      )
      .subscribe((result: any) => {
        this.existingApps = this.existingApps.map(item => {
          if (item.appId === appId) {
            item.config.state = result.state;
          }
          return item;
        });
        this.toastr.success(`Application ${appName} ${state}ed successfully`, 'Success!');
      },
        err => this.toastr.error(`Error in ${state}ing application`, 'Failed!'),
      );

  }

  deleteHost(hostId) {
    this.automatorApi.deleteHost(hostId).subscribe(res => {
      this.loadHosts();
    }, err => {
      this.toastr.error(`Error deleting host`, 'Failed!');
      //hostname03 hostUniqueTwo hostUnique aaaaa host.name
    })
  }

  getItemstate(itemStateVal) {
    this.itemStateVal = itemStateVal;
    if (this.itemStateVal == 'CFGEnabled') {
      this.itemState = false
      console.log(this.itemStateVal);

    }
    else {
      this.itemState = true;
      console.log(this.itemStateVal);
    }
  }

  delHost(host) {
    console.log(host);
    if (host.cfgServId) {
      this.automatorApi.delVirEnvHost(host.id).subscribe(res => {
        this.getEnvHosts();
      }, err => {
        console.log('err', err);
      })
    }
    if (host.cpyId) {
      this.automatorApi.delCopyEnvHost(host.id).subscribe(res => {
        this.getCopyEnvHosts();
      }, err => {
        console.log('err', err);
      })
    }
    //Znew98,Znew99,Znew70

  }



}
