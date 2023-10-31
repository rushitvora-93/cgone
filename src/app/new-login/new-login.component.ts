import { Component, OnInit } from "@angular/core";
import { LoginUpdated } from "../models/loginUpdated";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AutomatorApiService } from "../services/automator-api.service";
import { ToastrService } from "ngx-toastr";

@Component({
	selector: "app-new-login",
	templateUrl: "./new-login.component.html",
	styleUrls: ["./new-login.component.scss"]
})
export class NewLoginComponent implements OnInit {
	config = environment;
	optionsList = [{ label: 'Dashboard', value: '/home' }, { label: 'OneConnect', value: '' }, { label: 'OneTrack', value: '/onetrack/track' },
	{ label: 'OneChange', value: "/onechange/promote" }, { label: 'OneDesign', value: '/onedesign/env/virtual' }, { label: 'OneTest', value: '/onetest' }];

	loginForm: FormGroup;
	loginBusy = false;
	breaker = 0;

	constructor(private automatorApi: AutomatorApiService, private toastr: ToastrService, private router: Router) {
		if (!this.config.oneConnect) {
			this.optionsList.splice(this.optionsList.map(v => v.label).indexOf('OneConnect'), 1)
		}
		if (!this.config.oneTrack) {
			this.optionsList.splice(this.optionsList.map(v => v.label).indexOf('OneTrack'), 1)
		}
		if (!this.config.oneChange) {
			this.optionsList.splice(this.optionsList.map(v => v.label).indexOf('OneChange'), 1)
		}
		if (!this.config.oneDesign) {
			this.optionsList.splice(this.optionsList.map(v => v.label).indexOf('OneDesign'), 1)
		}
		if (!this.config.oneTest) {
			this.optionsList.splice(this.optionsList.map(v => v.label).indexOf('OneTest'), 1)
		}
		if (!this.config.home) {
			this.optionsList.splice(this.optionsList.map(v => v.label).indexOf('Dashboard'), 1)
		}

		let landing;
		if (this.optionsList.length > 0) {
			landing = this.optionsList[0].value;
		}

		this.loginForm = new FormGroup({
			Username: new FormControl('', [Validators.required]),
			Password: new FormControl('', [Validators.required]),
			ChooseOption: new FormControl(landing)
		})

	}

	ngOnInit() {
		if (sessionStorage.getItem("authDetail")) {
			this.router.navigate(["dashboard"]);
		}
	}
	login() {
		if (this.loginBusy) {
			return;
		}
		this.loginBusy = true;
		this.breaker = 0;
		this.callLogin();
	}

	callLogin() {
		const loginDetail = this.loginForm.value;

		this.automatorApi.basicAuthNew(loginDetail)
			.subscribe(response => {
				this.loginBusy = false;
				if (!response) {
					this.toastr.error('Not able to login, please check the credentials and login service.', 'Oops!');
					return;
				}
				sessionStorage.setItem('authDetail', JSON.stringify(loginDetail));
				// this.automatorApi.setSessionId(response.sessionId);
				this.router.navigateByUrl('/dashboard' + this.loginForm.value.ChooseOption);
				this.toastr.success('You will be redirected shortly.', 'Login sucessfully..');
			}, (err: any) => {
				if ((err.message === '200' || err.message === 200) && this.breaker < 2) {
					this.breaker++;
					this.callLogin();
					return;
				}
				this.loginBusy = false;
				this.toastr.error('Not able to login, please check the credentials and login service.', 'Oops!');
			});
	}
}
