import { Injectable } from "@angular/core";
import { AutomatorApiService } from "./automator-api.service";

@Injectable({
	providedIn: "root"
})
export class HostService {
	currentSelectedElem = null;
	hostList = {};

	constructor(private automatorapi: AutomatorApiService) {}

	setHostList(envNames: string[]) {
		this.hostList = envNames.reduce((reduced, envName) => {
			reduced[envName] = [];
			return reduced;
		}, {});
	}

	getHostApplications(hostId) {
		return this.automatorapi.getHostApplications(hostId);
	}

	getAppStatus(appId) {
		return this.automatorapi.getAppStatus(appId);
	}

	startApp(appId) {
		return this.automatorapi.postStartApp(appId);
	}

	stopApp(appId) {
		return this.automatorapi.postStopApp(appId);
	}

	saveNewHost(newHostDetails: any[]) {
		return this.automatorapi.saveNewHost(newHostDetails);
	}

	getExistingAppConfig(appId: number) {
		return this.automatorapi.getExistingAppConfig(appId);
	}

	getAppVersion(appName: string) {
		return this.automatorapi.getAppVersion(appName);
	}
}
