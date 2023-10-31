import { Router } from '@angular/router';
import { AutomatorApiService } from './../services/automator-api.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuditItemTrailComponent } from '../audit-item-trail/audit-item-trail.component';
import { MatDialog } from '@angular/material';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from './date.adapter';
import _ from 'underscore';

import { get } from 'lodash';
import { config } from 'rxjs';
import { IgnoreListDialogComponent } from '../components/ignore-list-dialogue/ignore-list-dialog.component';
import { AppConfigService } from '../services/app-config.service';

// import { data as chartData, data } from './chartData';
@Component({
	selector: 'app-environment-comparison',
	templateUrl: './environment-comparison.component.html',
	styleUrls: ['./environment-comparison.component.css'],
	providers: [
		{
			provide: DateAdapter,
			useClass: AppDateAdapter
		},
		{
			provide: MAT_DATE_FORMATS,
			useValue: APP_DATE_FORMATS
		}
	]
})
export class EnvironmentComparisonComponent implements OnInit {
	shouldShowOnlyDifference = false;
	environmentComparisson = [];
	selectedItemsArray = [];
	isresultNavVisible = false;
	colorCodes = {
		TableAccess: '#4dc9f6',
		CallingList: '#f67019',
		Application: '#f53794',
		Transaction: '#537bc4',
		Created: '#537bc4',
		Deleted: '#acc236',
		Updated: '#d64710',
		Rollback: '#537bc4',
		default: '#acc236'
	};
	barChart = [];
	objectTypeForChart = [];
	operationForChart = [];
	rollbackForChart = [];
	userForChart = [];
	listOfChanges: any = [];
	ignoreFieldList: any[];
	selectedEnvComp: any;
	fromEnvCp: any={};
	toEnvCp: any={};
	loadingComparison=false;
	loadingData=false;
	constructor(
		private automatorApi: AutomatorApiService,
		private toastr: ToastrService,
		private router: Router,
		public dialog: MatDialog,
		private appConfigService:AppConfigService
	) {
		//this.submit();
	}
	highlight: any = [];
	highlight_old = '';
	highlight_new = '';
	user = '';
	operation = '';
	objectType: any = [];
	allEnvList: any = [];
	allEnvCompList: any = [];
	objectTypeList: any = [];
	showAll = true;
	fromEnv: any;
	toEnv: any;
	objEnv: any;

	// ngOnInit() {
	//   this.getObjectTypeList();
	// }

	ngOnInit() {
		this.getObjectTypeList();
		this.getAllEnvList();
	}

	showIgnoreListDialogue(){
		this.ignoreFieldList = [];
		let id=-1;
		this.automatorApi.getObjectTypeFields(this.objEnv.value)
		.subscribe(fields=>{
			this.automatorApi.getObjectTypeIgnoreFieldList(this.objEnv.value)
			.subscribe(res=>{
				id = res.id;
				let ls =[];
				fields.forEach(r=>{
					ls.push({name:r,selected:res.ignoreFieldList?res.ignoreFieldList.indexOf(r)!=-1:false})
				})
				this.ignoreFieldList = Object.assign(this.ignoreFieldList,ls);
			},err=>{
				this.toastr.error(`Error in getting the saved ignore list`, 'Failed!');
			})
			
		})
		const dialogRef = this.dialog.open(IgnoreListDialogComponent, {
			width: '420px',
			'height':'500px',
			data:{list:this.ignoreFieldList,objType:this.objEnv.label}
		  });
	  
		  dialogRef.afterClosed().subscribe(result => {
			if (result && result !== 'cancel') {
				let data ={
					id:id,
					objecttype:this.objEnv.value,
					ignoreFieldList:[
					]
					}
			    this.ignoreFieldList.forEach(item=>{
					if(item.selected){
						data.ignoreFieldList.push(item.name);
					}
				})		
			  this.automatorApi.saveIgnoreList(data)
				.subscribe( response => {
				  this.toastr.success('Ignore list saved Successfully...', 'Success!');
				  if(this.selectedEnvComp){
					  this.getConfigEnv(this.selectedEnvComp);
				  }
				},
				err => {
				  this.toastr.error(`Oops...Not able to save ignore list, please check the credential.`, 'Failed!');
				});
			}
		  });
	}

	onObjectTypeChange($event){

	}

	



	submit() {
		console.log(this.fromEnv);
		this.environmentComparisson=undefined;
		if (!this.objEnv || !this.fromEnv.value || !this.toEnv.value) {
			return;
		}

		const data = {
			objectType: this.objEnv.value,
			firstEnv: this.fromEnv.value,
			secondEnv: this.toEnv.value,
			showAll:this.showAll
		};

		console.log('data', data);
		this.loadingData=true;
		this.automatorApi.postcompareEnvironment(data).subscribe(
			result => {
				this.loadingData=false;
				console.log('result', result);
				this.fromEnvCp = Object.assign({},this.fromEnv);
				this.toEnvCp=Object.assign({},this.toEnv);
				if (result) {
					this.allEnvCompList = result.map(res => ({
						value: res.objectName,
						differencePresent: res.dataMap.differencePresent,
						presentInBothEnv: res.dataMap.presentInBothEnv
					}));
				}
			},
			err => {
				this.loadingData=false;
				if (err.status === 302 || err.status === 303) {
					this.router.navigate(['/login']);
				}
			}
		);
	}

	differenceOf2Arrays(array1, array2) {
		const temp = [];
		array1 = array1
			.toString()
			.split(',')
			.map(Number);
		array2 = array2
			.toString()
			.split(',')
			.map(Number);

		for (const i in array1) {
			if (array2.indexOf(array1[i]) === -1) { temp.push(array1[i]); }
		}
		for (const i in array2) {
			if (array1.indexOf(array2[i]) === -1) { temp.push(array2[i]); }
		}
		return temp.sort((a, b) => a - b);
	}

	getConfigEnv(text) {
		this.selectedEnvComp = text;
		
		const data = {
			objectType: this.objEnv.value,
			firstEnv: this.fromEnv.value,
			secondEnv: this.toEnv.value,
			objectName: text
		};
		console.log("loading");
		this.loadingComparison=true;
		this.isresultNavVisible = false;
		this.automatorApi.postcompareEnv(data).subscribe(
			result => {
				this.highlight = [];
				const nv1 = result[0].objDifference.map.Env1;
				const nv2 = result[0].objDifference.map.Env2;

				this.highlight_old = nv1;
				this.highlight_new = nv2;
				this.environmentComparisson=this.appConfigService.
				compareEnvironments(this.highlight_old, this.highlight_new,result[0].ignoreFieldList||[]);
				const treuslt = this.appConfigService.deepDiffMapper.map(nv1, nv2);

				this.isresultNavVisible = true;
				for (const key in treuslt) {
					const newName = {
						keyy: key,
						label_type: treuslt[key].type,
						label_data: treuslt[key].data
					};
					this.highlight.push(newName);

					if (
						this.isObject(treuslt[key]) &&
						!treuslt[key].hasOwnProperty('data')
					) {
						this.appConfigService.recucnav(treuslt[key],this.highlight);
					}
					
				}
			},
			err => {
				if (err.status === 302 || err.status === 303) {
					this.router.navigate(['/login']);
				}
			},()=>{
				console.log("loading done");
				this.loadingComparison=false;
			}
		);
	}

	compareJSON(json1, json2) {
		const objectsDiffering = [];
		this.compareJSONRecursive(json1, json2, objectsDiffering);
		return objectsDiffering;
	}

	compareJSONRecursive(json1, json2, objectsDiffering) {
		let prop = '';
		for (prop in json1) {
			if (json2.hasOwnProperty(prop)) {
				switch (typeof json1[prop]) {
					case 'object':
						this.compareJSONRecursive(
							json1[prop],
							json2[prop],
							objectsDiffering
						);
						break;
					default:
						if (json1[prop] !== json2[prop]) {
							objectsDiffering.push(json1);
						}
						break;
				}
			} else {
				objectsDiffering.push(json1);
				break;
			}
		}
	}

	getSelectedObjectTypes(objectTypes: any[]) {
		console.log('in getSelectedObjectTypes..', objectTypes);
		this.objectType = objectTypes.map(obj => obj.value);
	}

	get currentData() {
		if (this.listOfChanges.length === 0) {
			return this.listOfChanges;
		}
		return this.listOfChanges[0];
	}

	objectKeysNew(obj) {
		return Object.keys(obj[0]);
	}

	objectKeys(obj) {
		const duplicateValue = Object.assign({}, obj);
		delete duplicateValue['value'];
		return Object.keys(duplicateValue);
	}

	objectValues(obj) {
		const duplicateValue = Object.assign({}, obj);
		delete duplicateValue['value'];
		return Object.values(duplicateValue);
	}

	isNumber(value) {
		return typeof value === 'number' && isFinite(value);
	}

	isBoolean(value) {
		return typeof value === 'boolean';
	}

	isArray(value) {
		return (
			value && typeof value === 'object' && value.constructor === Array
		);
	}

	isObject(value) {
		return (
			value && typeof value === 'object' && value.constructor === Object
		);
	}

	getDetails(value) {
		console.log(value);
	}

	getObjectTypeList() {
		// http://vpn.logicsoft.co.uk:8901/api/v2/list/objectType
		this.automatorApi.getObjectType().subscribe(result => {
			if(!result){
				return;
			}
			console.log(
				'datat dadtadta..',
				result.list.map(res => ({
					value: res.mappedName,
					label: res.propertyName
				}))
			);
			this.objectTypeList = result.list.map(res => ({
				value: res.mappedName,
				label: res.propertyName
			}));
		});
	}

	getAllEnvList() {
		// http://demo.onecg.cc:8901/api/v2/envlist/getallenv
		this.automatorApi.getAllEnv().subscribe(result => {
			if(!result){
				return;
			}
			this.allEnvList = result.map(res => ({
				value: res.id,
				label: res.appName
			}));
			console.log(this.allEnvList);
		});
	}

	isObjectChanged(object) {
		if(object && object.configKey) {
			const objectsRelated = this.environmentComparisson.filter(
				item => item && item.isChanged && item.configKey
				&& (item.configKey.startsWith(object.configKey + '[')
				|| item.configKey.startsWith(object.configKey + '.')
				|| item.configKey === object.configKey));
			return objectsRelated && objectsRelated.length > 0;
		} else {
			return false;
		}
	}

	toggleShowOnlyDifference() {
		if(this.shouldShowOnlyDifference) {
			this.shouldShowOnlyDifference = false;
		} else {
			this.shouldShowOnlyDifference = true;
		}
	}
}
