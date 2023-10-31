import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Login } from '../models/login';
import { AutomatorApp } from '../models/automatorApp';
import { Host } from '../models/host';
import { HostApp } from '../models/hostApp';
import { AutomatorAppGeneralConfig } from '../models/automatorAppGeneralConfig';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    }
  )
};
const audiohttpOptions = {
  headers: new HttpHeaders(
    {
      'Content-Type': 'application/octet-stream',
      'accept': 'application/octet-stream'
    }
  )
};

const httpTextOptions = {
  headers: new HttpHeaders(
    {
      'responseType': 'text'
    }
  )
};

@Injectable()
export class AutomatorApiService {
  //appUrl='http://mb2tlucp164.bccn.local:8901/api/login';
  appUrl = `${environment.loginApiBaseUrl}/api/login`;
  constructor(
    private http: HttpClient,
    private router: Router) {
    const x = sessionStorage.getItem('sesId');
    this.sessionId = +x;
  }

  private sessionId: number;


  logOut() {
    return this.http.get<Host[]>(
      `${environment.apiBaseUrl}/logout`,
      httpOptions
    );
  }


  loginEnvironment(loginDetail: Login) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/automator/action/register`,
      loginDetail,
      httpOptions
    );
  }

  setSessionId(sessionId) {
    return this.sessionId = sessionId;
  }

  getSessionId() {
    return this.sessionId;
  }

  getAllHosts() {
    return this.http.get<Host[]>(
      `${environment.apiBaseUrl}/hosts/${this.sessionId}`,
      httpOptions
    ).pipe(
      catchError(this.handleError<Host[]>('getAllHosts'))
    );
  }

  getListOfEventType(path) {
    path = path.replace('{sessionId}', sessionStorage.getItem('sesId'));
    return this.http.get<any>(
      `${environment.apiBaseUrl}/` + path,
      httpOptions
    ).pipe(
      catchError(this.handleError('getListOfEventType'))
    );
  }

  getAllOSType() {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/oslist`,
      httpOptions
    ).pipe(
      catchError(this.handleError('getAllOSType'))
    );
  }

  getHostName(envId: any) {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/promote/hosts/${this.sessionId}/${envId}`,
      httpOptions
    ).pipe(
      catchError(this.handleError('getHostName'))
    );
  }

  getHostInfo(hostId: any) {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/hosts/${this.sessionId}/${hostId}`,
      httpOptions
    );
  }

  updateHost(data: any) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/hosts/${this.sessionId}/${data.hostId}/update`,
      data,
      httpOptions
    )
  }



  getAllSC() {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/allapps/${this.sessionId}/allscsapp`,
      httpOptions
    ).pipe(
      catchError(this.handleError('getAllSC'))
    );
  }

  getAllApps() {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/allapps/${this.sessionId}`,
      httpOptions
    );
  }


  appPlugins() {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/applicationtemplate/listPlugin`,
      httpOptions
    );
  }

  pluginVersions(plugin) {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/applicationtemplate/listPluginVersion/${plugin}`,
      httpOptions
    );
  }

  getApplicationsToDeploy(status) {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/automator/action/${this.sessionId}/getAllApps/${status}`,
      httpOptions
    );
  }

  createNewEnv(data) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/newEnv/`,
      data,
      httpOptions
    );
  }
  getAllEnvironment() {
    return this.http.get<Login[]>(
      `${environment.apiBaseUrl}/envlist`,
      httpOptions
    );
  }

  removeEnvironment(appName) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/envlist/deleteEnv/` + appName,
      httpOptions
    );
  }

  addNewEnvHost(data) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/newEnv/addNewHost`,
      data,
      httpOptions
    );
  }

  addEnv(data) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/envlist/addenv`,
      data,
      httpOptions
    )
  }

  addServer(data) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/serverdetails/addserver`,
      data,
      httpOptions
    )
  }

  refreshTemplates(envId) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/applicationtemplate/${envId}/refreshTemplates`,
      httpOptions
    )
  }

  refreshAuditData(envName, objectType) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/refreshdata/refreshAuditData`,
      {
        envName: envName,
        objectType: objectType
      },
      httpOptions
    )
  }

  restartServer() {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/cloneapps/restart`,
      httpOptions
    )
  }

  addNewEnvHostApp(data) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/newEnv/addNewApp`,
      data,
      httpOptions
    );
  }

  deployConfigServer(envId) {
    return this.http.get<Login[]>(
      `${environment.apiBaseUrl}/newEnv/deployConfigserver/${envId}`,
      httpOptions
    );
  }

  deployEnvironment(envId) {
    return this.http.get<Login[]>(
      `${environment.apiBaseUrl}/newEnv/deploy/${envId}`,
      httpOptions
    );
  }

  saveNoHostApp(copyid) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/copyEnv/saveNoHostApps/${copyid}`,
      httpOptions
    );
  }

  redeployApplications(envId) {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/newEnv/reDeploy/${envId}`,
      httpOptions
    );
  }

  copyEnvRedeployApplications(envId) {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/copyEnv/redeploy/${envId}`,
      httpOptions
    );
  }


  getHostApplications(hostId) {
    return this.http.get<HostApp[]>(
      `${environment.apiBaseUrl}/hosts/${this.sessionId}/${hostId}/apps`,
      httpOptions
    );
  }

  getAppStatus(appId) {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/SCS/getstatus/${this.sessionId}/${appId}`,
      httpOptions
    );
  }

  postStartApp(appId) {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/SCS/startapplication/${this.sessionId}/${appId}`,
      httpOptions
    );
  }

  postStopApp(appId) {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/SCS/stopapplication/${this.sessionId}/${appId}`,
      httpOptions
    ).pipe(
      catchError(this.handleError('postStopApp'))
    );
  }

  getPlaces(value) {
    return this.http.get<any[]>(
      `${environment.apiBaseUrl}/` + value + `/${this.sessionId}`,
      httpOptions
    ).pipe(
      catchError(this.handleError('getPlaces'))
    );
  }

  getPlacesForSwitch(value, dbId) {
    return this.http.get<any[]>(
      `${environment.apiBaseUrl}/${value}/${this.sessionId}/getall/${dbId}`,
      httpOptions
    ).pipe(
      catchError(this.handleError('getPlacesForSwitch'))
    );
  }

  getCampaignGroupForCampaign(value, dbId) {
    return this.http.get<any[]>(
      `${environment.apiBaseUrl}/${this.sessionId}/getall/` + dbId,
      httpOptions
    ).pipe(
      catchError(this.handleError('getCampaignGroupForCampaign'))
    );
  }

  getAutomatorApplications() {
    return this.http.get<AutomatorApp[]>(
      `${environment.apiBaseUrl}/automator/apps`,
      httpOptions
    );
  }

  getAllAppsOneConnect() {
    return this.http.get<AutomatorApp[]>(
      `${environment.apiBaseUrl}/list/allapptype`,
      httpOptions
    );
  }

  basicAuth(loginDetail) {
    let headers_object = new HttpHeaders();
    headers_object = headers_object.append('Content-Type', 'application/json');
    headers_object = headers_object.append('Authorization', 'Basic ' + btoa(loginDetail.Username + ':' + loginDetail.Password));
    const _httpOptions = {
      headers: headers_object
    };
    return this.http.post<any>(`${this.appUrl}`, loginDetail, _httpOptions);
  }

  basicAuthNew(loginDetail) {
    let headers_object = new HttpHeaders();
    headers_object = headers_object.append('Content-Type', 'application/x-www-form-urlencoded');
    const httpHeader = {
      headers: headers_object
    };
    const body = `username=${loginDetail.Username}&password=${loginDetail.Password}`;
    return this.http.post<any>(`${this.appUrl}`, body, httpHeader);
  }

  basicAuthTest() {
    return this.http.get<any>(`http://demo.onecg.cc:8901/api/welcome`,
      httpOptions
    );
  }

  getAutomatorAppConfigDetails(automatorAppId) {
    return this.http.get<AutomatorAppGeneralConfig>(
      `${environment.apiBaseUrl}/automator/apps/${automatorAppId}/config`,
      httpOptions
    );
  }

  getAutomatorAppVersionDetails(automatorAppId) {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/automator/apps/versionlist/${automatorAppId}`,
      httpOptions
    );
  }

  oneConnectAppVersions(automatorAppId) {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/applicationtemplate/getVersionsList/${automatorAppId}`,
      httpOptions
    );
  }
  oneConnectAppTemplates(propertyName) {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/applicationtemplate/appversions/${this.sessionId}/${propertyName}`,
      httpOptions
    );
  }
  saveNewAppConfigs(newAppConfgis: any[]) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/apps/${this.sessionId}`,
      newAppConfgis,
      httpOptions
    );
  }


  moveApp(moveAppsDetail: any[]) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/automator/action/${this.sessionId}/apps/move`,
      moveAppsDetail,
      httpOptions
    );
  }

  saveCloneApps(data: any) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/cloneapps/saveCloneApps/${this.sessionId}`,
      data,
      httpOptions
    );
  }

  cloneApps(data: any) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/cloneapps/${this.sessionId}`,
      data,
      httpOptions
    );
  }

  saveNewHost(newHostDetails: any[]) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/hosts/${this.sessionId}`,
      newHostDetails,
      httpOptions
    );
  }

  getExistingAppConfig(appId) {
    return this.http.get<HostApp[]>(
      `${environment.apiBaseUrl}/apps/${this.sessionId}/${appId}/config`,
      httpOptions
    );
  }

  getAppVersion(appName: string) {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/automator/apps/upgrade/versionlist/${appName}`,
      httpOptions
    );
  }

  getOSList() {
    return this.http.get<any[]>(
      `${environment.apiBaseUrl}/oslist`,
      httpOptions
    );
  }

  postExistingAppConfig(appId: number, config: any) {
    return this.http.post<HostApp[]>(
      `${environment.apiBaseUrl}/apps/${this.sessionId}/${appId}/config`,
      config,
      httpOptions
    )
  }

  updateRoutingType(config: any, routingType: string) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/${routingType}/${this.sessionId}/${config.dbid}/update`,
      config,
      httpOptions
    );
  }

  addNewRoutingType(config: any, routing: string) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/${routing}/${this.sessionId}`,
      config,
      httpOptions
    );
  }

  postFinalPromoteList(config: any, envId) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/promote/${this.sessionId}/${envId}`,
      config,
      httpOptions
    );
  }

  postFinalConfigurationList(config: any, envId) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/promote/update/${this.sessionId}/${envId}`,
      config,
      httpOptions
    );
  }

  deployApps() {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/automator/action/${this.sessionId}/deploy`,
      null,
      httpOptions
    ).pipe(
      catchError(this.handleError('deployApps'))
    );
  }

  deployApplications(apps) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/automator/action/${this.sessionId}/deployApplications`,
      apps,
      httpOptions
    ).pipe(
      catchError(this.handleError('deployApps'))
    );
  }

  getDeploymentStatus(deployId: number) {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/automator/action/${this.sessionId}/deploy/${deployId}/status`,
      httpOptions
    ).pipe(
      catchError(this.handleError('getDeploymentStatus'))
    );
  }

  addUser(userDetail) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/usermanagement`,
      userDetail,
      httpOptions
    );
  }

  addUserRole(userDetail) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/usermanagement/addrole`,
      userDetail,
      httpOptions
    ).pipe(
      catchError(this.handleError('addUserRole'))
    );
  }

  changePassword(userDetail) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/usermanagement/changepassword`,
      userDetail,
      httpOptions
    ).pipe(
      catchError(this.handleError('changePassword'))
    );
  }

  getEnvironmentListOnPromote() {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/promote/getEnvList/${this.sessionId}`,
      httpOptions
    );
  }

  getPromoteAppList(envId: number, data: any) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/promote/getPromoteAppList/${this.sessionId}/${envId}`,
      data,
      httpOptions
    );
  }

  getConfigurePromoteList(appId: number[], data: any) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/promote/getObjectChanges/${this.sessionId}/${appId}`,
      data,
      httpOptions
    );
  }

  postPromoteAppConfig(appId: number[]) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/promote/getPromoteAppConfig`,
      appId,
      httpOptions
    );
  }

  postConfigurationAppConfig(appId: number[], environmentId) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/promote/getCurrentEnvChanges/${this.sessionId}/${environmentId}`,
      appId,
      httpOptions
    );
  }

  getTransaction(dbID: number, routingtype: string) {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/${routingtype}/${this.sessionId}/${dbID}`,
      httpOptions
    ).pipe(
      catchError(this.handleError('getTransaction'))
    );
  }

  postAuditHistory(data: any) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/audithistory/${this.sessionId}`,
      data,
      httpOptions
    );
  }

  ComparisonENV(data: any) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/audithistory/${this.sessionId}`,
      data,
      httpOptions
    );
  }

  getEnvDetails(envId: any) {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/envlist/getenvname/${envId}`,
      httpOptions
    )
  }

  getPromoteReport(data: any) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/promote/${this.sessionId}/promoteReport`,
      data,
      httpOptions
    );
  }

  getAuditPermission(data: any) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/audithistory/auditpermission`,
      data,
      httpOptions
    );
  }

  postRollbackPermission(ids: any, envName: string) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/audithistory/${envName}/permissionrollback`,
      ids,
      httpOptions
    );
  }

  postAuditRollback(data: any, envName: string) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/audithistory/${envName}/rollback`,
      data,
      httpOptions
    );
  }

  deleteObject(dbId: number, objectType: string) {
    return this.http.delete<any>(
      `${environment.apiBaseUrl}/${objectType}/${this.sessionId}/${dbId}`,
      httpOptions
    );
  }

  getObjectType() {
    return this.http.get<any>(`${environment.apiBaseUrl}/list/objectType`, httpOptions);
  }

  getAllEnv() {
    return this.http.get<any>(`${environment.apiBaseUrl}/envlist/getallenv`, httpOptions);
  }

  getNewEnvList() {
    return this.http.get<any>(`${environment.apiBaseUrl}/newEnv/getnewEnvList`, httpOptions);
  }

  getNoHostAppsOneDesign(envId) {
    return this.http.get<any>(`${environment.apiBaseUrl}/copyEnv/getNoHostAppsConfig/${envId}`, httpOptions);
  }

  getNewEnvConfig(envId) {
    return this.http.get<any>(`${environment.apiBaseUrl}/newEnv/getnewEnvConfig/${envId}`, httpOptions);
  }

  postcompareEnvironment(data: any) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/compareenv/compareEnvironment`,
      data,
      httpOptions
    );
  }


  postcompareEnv(data: any) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/compareenv/compare`,
      data,
      httpOptions
    );
  }

  getObjectTypeFields(objectType: string) {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/compareenv/getFields/${objectType}`,
      httpOptions
    );
  }

  saveIgnoreList(data) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/compareenv/ignoredList`,
      data,
      httpOptions
    );
  }

  getObjectTypeIgnoreFieldList(objectType: string) {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/compareenv/getToUpdateFields/${objectType}`,
      httpOptions
    );
  }

  deleteAppById(dbId: number) {
    return this.http.delete<any>(
      `${environment.apiBaseUrl}/apps/${this.sessionId}/${dbId}`,
      httpTextOptions
    )
  }


  handleError<T>(serviceName = '', operation = 'operation', result = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      if (error.status === 401) {
        document.cookie = 'JSESSIONID=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        sessionStorage.removeItem('sesId');
        sessionStorage.removeItem('authDetail');
        this.router.navigate(['login']);
      }
      return of(result as T);
    };
  }

  postCopyEnvApp(data: any) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/copyEnv/copyEnvApps`,
      data,
      httpOptions
    );
  }

  getCopyEnvList() {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/copyEnv/getCopyEnvList`,
      httpOptions
    );
  }

  deleteHost(hostId) {
    return this.http.delete<any>(
      `${environment.apiBaseUrl}/hosts/${this.sessionId}/${hostId}`,
      httpOptions
    );
  }

  getNewCopyEnvConfig(envId) {
    return this.http.get<any>(`${environment.apiBaseUrl}/copyEnv/getCopiedConfig/${envId}`, httpOptions);
  }

  // DELETE /v2/copyEnv/deleteHost/{id}
  delCopyEnvHost(hostId) {
    return this.http.delete<any>(
      `${environment.apiBaseUrl}/copyEnv/deleteHost/${hostId}`,
      httpOptions
    );
  }

  delCopyEnvApp(hostId) {
    return this.http.delete<any>(
      `${environment.apiBaseUrl}/copyEnv/deleteApp/${hostId}`,
      httpOptions
    );
  }

  delVirEnvApp(hostId) {
    return this.http.delete<any>(
      `${environment.apiBaseUrl}/newEnv/deleteApp/${hostId}`,
      httpOptions
    );
  }

  // DELETE /v2/newEnv/deleteHost/{id}
  delVirEnvHost(hostId) {
    return this.http.delete<any>(
      `${environment.apiBaseUrl}/newEnv/deleteHost/${hostId}`,
      httpOptions
    );
  }

  moveEnvApps(data: any) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/newEnv/moveApps`,
      data,
      httpOptions
    );
  }

  moveCopyApps(data: any) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/copyEnv/moveApps`,
      data,
      httpOptions
    );
  }

  getallapptype() {
    return this.http.get<any>(`${environment.apiBaseUrl}/list/allapptype`, httpOptions);
  }

  getVirobjectType() {
    return this.http.get<any>(`${environment.apiBaseUrl}/copyEnv/objectType`, httpOptions);
  }

  saveCopyConfig(env, objId) {
    return this.http.post<any>(`${environment.apiBaseUrl}/copyEnv/savecopyConfig/${env}/${objId}`, httpOptions);
  }
  copyObjectPermissions(env) {
    return this.http.post<any>(`${environment.apiBaseUrl}/copyEnv/copyObjectPermissions/${env}`, httpOptions);
  }
  addNewCopyHostApp(data: any) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/copyEnv/addNewApp`,
      data,
      httpOptions
    );
  }


  // post /v2/copyEnv/addNewHost
  addNewCopyHost(data) {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/copyEnv/addNewHost`,
      data,
      httpOptions
    );
  }

  ///v2/applicationtemplate/getVersionsList/{templateType}
  getVerList(templateType) {
    return this.http.get<any>(`${environment.apiBaseUrl}/applicationtemplate/getVersionsList/${templateType}`,
      httpOptions);
  }

  deployCpyConfigServer(cpyId) {
    return this.http.get<Login[]>(
      `${environment.apiBaseUrl}/copyEnv/deployConfigserver/${cpyId}`,
      httpOptions
    );
  }

  deployCpyEnvironment(cpyId) {
    return this.http.post<Login[]>(
      `${environment.apiBaseUrl}/copyEnv/deploy/${cpyId}`,
      httpOptions
    );
  }

  redeployCpyApplications(cpyId) {
    return this.http.get<Login[]>(
      `${environment.apiBaseUrl}/copyEnv/redeploy/${cpyId}`,
      httpOptions
    );
  }

  getOneTestSprint() {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/onecgtest/sprint/listSprint`,
      httpOptions
    )
  }

  getOneTestTemplates() {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/onecgtest/template/listScript`,
      httpOptions
    )
  }

  getOneTestServiceList(){
    return this.http.get<any>(
      `${environment.apiBaseUrl}/onecgtest/templateService/listService`,
      httpOptions
    )
  }

  delTestScript(id) {
    return this.http.delete<any>(
      `${environment.apiBaseUrl}/onecgtest/template/deleteScript/${id}`,
      httpOptions
    );
  }

  deleteService(id) {
    return this.http.delete<any>(
      `${environment.apiBaseUrl}/onecgtest/templateService/deleteService/${id}`,
      httpOptions
    );
  }

  createOneTestSprint(data) {
    const params = JSON.stringify(data);
    return this.http.post(
      `${environment.apiBaseUrl}/onecgtest/sprint/addSprint`,
      params,
      httpOptions
    )
  }

  createOneTestService(data){
    const params = JSON.stringify(data);
    return this.http.post(
      `${environment.apiBaseUrl}/onecgtest/templateService/addUpdateService`,
      params,
      httpOptions
    )
  }

  getSprintById(id) {
    return this.http.get(`${environment.apiBaseUrl}/onecgtest/sprint/getSprint/${id}`,
      httpOptions)
  }
  startSprintById(id) {
    return this.http.get(`${environment.apiBaseUrl}/onecgtest/sprint/startSprint/${id}`,
      httpOptions)
  }
  startIVRSprint(id){
    return this.http.get(`${environment.apiBaseUrl}/onecgtest/sprint/startIVRSprint/${id}`,
    httpOptions)
  }
  stopSprintById(id) {
    return this.http.get(`${environment.apiBaseUrl}/onecgtest/sprint/stopSprint/${id}`,
      httpOptions)
  }

  createOnetestTemplate(params) {
    return this.http.post(`${environment.apiBaseUrl}/onecgtest/template/addUpdateScript`,params,
      httpOptions)
  }

  homePageReport(params) {
    return this.http.post(`${environment.apiBaseUrl}/audithistory/${this.sessionId}`, params, httpOptions);
  }

  listChannels() {
    return this.http.get(`${environment.apiBaseUrl}/onecgtest/sprint/listChannel`, httpOptions);
  }

  refreshSprint() {
    return this.http.get(`${environment.apiBaseUrl}/onecgtest/sprint/refreshData`, httpOptions);
  }

  refreshSprintIvr() {
    return this.http.get(`${environment.apiBaseUrl}/temporary/listMessageData/102`, httpOptions);
  }
  refreshIVRSprint(id){
    return this.http.get(`${environment.apiBaseUrl}/temporary/listMessageData/${id}`, httpOptions);
  }

  downloadAudio(id){
    return this.http.get(`${environment.apiBaseUrl}/temporary/getAudio/${id}`, audiohttpOptions);
  }

  ignoreList(id) {
    return this.http.get(`${environment.apiBaseUrl}/compareenv/getFields/${id}`, httpOptions);
  }

  oneTestSprintMeta(id) {
    return this.http.get(`${environment.apiBaseUrl}/onecgtest/sprint/refreshJMXResponse/${id}`, httpOptions);
  }

  oneConnectAddAppData(id) {
    return this.http.get(`${environment.apiBaseUrl}/applicationtemplate/getApplicationKeys/${id}`, httpOptions);
  }
}