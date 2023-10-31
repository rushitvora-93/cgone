import { Injectable , EventEmitter, Output } from '@angular/core';
import { AutomatorApiService } from './automator-api.service';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  @Output() closeAppConfig: EventEmitter<any> = new EventEmitter();
  constructor(private automatorapi: AutomatorApiService) { }

  getAutomatorApplications() {
    return this.automatorapi.getAutomatorApplications();
  }

  basicAuth(loginDetail) {
    return this.automatorapi.basicAuth(loginDetail);
  }

  getAllHosts() {
    return this.automatorapi.getAllHosts();
  }

  closeApplicationConfig() {
    this.closeAppConfig.emit('closeAppConfig');
  }

  saveNewAppConfigs(newAppConfgis: any[]) {
    return this.automatorapi.saveNewAppConfigs(newAppConfgis);
  }

  moveApp(moveAppsDetail: any[]) {
    return this.automatorapi.moveApp(moveAppsDetail);
  }

  deployApps() {
    return this.automatorapi.deployApps();
  }

  getDeploymentStatus(deployId: number) {
    return this.automatorapi.getDeploymentStatus(deployId);
  }
}
