import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AppComponent } from './app.component';
import { RigistrationComponent } from './rigistration/rigistration.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { ToastrModule } from 'ngx-toastr';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';

import {
	MatFormFieldModule,
	MatInputModule,
	MatDialogModule,
	MatButtonModule,
	MatMenuModule,
	MatIconModule,
	MatTabsModule,
	MatCheckboxModule,
	MatProgressSpinnerModule,
	MatTooltipModule,
	MatSelectModule,
	MatStepperModule,
	MatRadioModule,
	MatDatepickerModule,
	MatNativeDateModule,
	MatListModule,
	MatOptionModule,
	MatTableModule,
	MatSlideToggleModule,
	MatGridListModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
	MAT_DIALOG_DATA
} from '@angular/material';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { AutomatorApiService } from './services/automator-api.service';
import { DataTransferService } from './services/data-transfer.service';
import { HostService } from './services/host.service';
import { AppConfigService } from './services/app-config.service'; import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { NewLoginComponent } from './new-login/new-login.component';

import { SetupComponent } from './setup/setup.component';
import { CommonComponentsModule } from './common-components.module';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { OnetestService } from './store/service/one-test.service';
import { OneCGQuery } from './store/query/one-test.query';
import { OnetestStore } from './store/store/one-test.store';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { AppHttpInterceptor } from './services/login.interceptor';
import { Error404Component } from './dashboard-ocgmwa/error404/error404.component';
import { DashboardService } from './services/behaviour.service';
import { NgxAudioPlayerModule } from 'ngx-audio-player';

registerLocaleData(en);

@NgModule({
	declarations: [
		AppComponent,
		RigistrationComponent,
		NewLoginComponent,
		SetupComponent,
		Error404Component
	],
	imports: [
		BrowserModule,
		NgxAudioPlayerModule,
		BrowserAnimationsModule,		
		MatExpansionModule,
		MatFormFieldModule,
		MatInputModule,
		MatTooltipModule,
		MatDialogModule,
		MatListModule,
		MatOptionModule,
		MatTableModule,
		FormsModule,
		MatButtonModule,
		MatMenuModule,
		MatIconModule,
		MatTabsModule,
		MatStepperModule,
		MatSelectModule,
		ReactiveFormsModule,
		HttpClientModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatRadioModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatSlideToggleModule,
		ScrollingModule,
		MatGridListModule,
		DragDropModule,
		ToastrModule.forRoot(),
		MatMomentDatetimeModule,
		MatDatetimepickerModule,
		Ng4LoadingSpinnerModule.forRoot(),
		CommonComponentsModule,
		RouterModule.forRoot(
			[
				{ path: 'setup', component: SetupComponent },
				{ path: '', pathMatch: 'full', redirectTo: 'login' },
				{
					path: 'dashboard',
					loadChildren: './dashboard-ocgmwa/dashboard-ocgmwa.module#DashboardOcgmwaModule',
					canActivate: [AuthGuardService]
				},
				{ path: 'login', component: NewLoginComponent },
				{
					path: 'error/404',
					component: Error404Component
				},
				// {path:'dashboard/places', component: ObjectDisplayComponent ,canActivate:[AuthGuardService]},
				{ path: '', redirectTo: '/login', pathMatch: 'full' }
			],
			{ useHash: true }
		),
		NgZorroAntdModule,
		// AkitaNgRouterStoreModule,
		AkitaNgRouterStoreModule.forRoot()
	],
	entryComponents: [

	],
	providers: [
		AutomatorApiService,
		DataTransferService,
		HostService,
		AuthGuardService,
		AppConfigService,
		OnetestService,
		DashboardService,
		OneCGQuery, OnetestStore,
		{ provide: NZ_I18N, useValue: en_US },
		{ provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true }
		// {provide:MAT_DIALOG_DATA,useValue:{}},
		// {provide:MAT_DIALOG_DEFAULT_OPTIONS,useValue:{hasBackdrop:false}}
	],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
	bootstrap: [AppComponent]
})
export class AppModule { }
