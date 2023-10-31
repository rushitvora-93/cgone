import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-ot-comparison',
  templateUrl: './ot-comparison.component.html',
  styleUrls: ['./ot-comparison.component.scss']
})
export class OtComparisonComponent implements OnInit {
  allEnvList = [];
  objectTypeList = [];
  searchForm: FormGroup;
  isBusy = false;
  isLoaded = false;

  allCompResult = [];
  ignoreList = [];
  selectedIgnore = [];
  selectedObj: {};
  ignoreListEnvId = null;

  constructor(private toastr: ToastrService,
    private automatorApi: AutomatorApiService) {
    this.searchForm = new FormGroup({
      firstEnv: new FormControl(null, [Validators.required]),
      secondEnv: new FormControl(null, [Validators.required]),
      objectType: new FormControl(null, [Validators.required]),
      showAll: new FormControl(false)
    });

    this.searchForm.get('objectType').valueChanges.subscribe(res => {
      this.loadIgnoreList(res);
    });
  }

  ngOnInit() {
    this.getObjectTypeList();
    this.loadEnv();
  }

  get compareWithList() {
    return this.allEnvList.filter(i => i.value !== this.searchForm.value.firstEnv);
  }
  getObjectTypeList() {
    this.automatorApi.getObjectType().subscribe(result => {
      if (!result) {
        return;
      }
      this.objectTypeList = result.list.map(res => ({
        value: res.mappedName,
        label: res.propertyName
      }));
    });
  }

  loadIgnoreList(val) {
    this.selectedIgnore = [];
    this.automatorApi.ignoreList(val).
      pipe(
        switchMap((res: any) => {
          this.ignoreList = res;
          return this.automatorApi.getObjectTypeIgnoreFieldList(val);
        })
      )
      .subscribe((res: any) => {
        if (res.ignoreFieldList) {
          res.ignoreFieldList.map(i =>
            this.selectedIgnore.push(i)
          );
        }
        this.ignoreListEnvId = res.id;
      });
  }

  setIgnoreItem(id, val) {
    if (val) {
      this.selectedIgnore.push(id);
    } else {
      this.selectedIgnore.splice(id, 1);
    }
    this.automatorApi.saveIgnoreList({
      ignoreFieldList: this.selectedIgnore,
      objecttype: this.searchForm.value.objectType,
      id: this.ignoreListEnvId
    }).subscribe(res => {

    })
  }

  get selectedIgnoreListCount() {
    return (this.selectedIgnore.length ? this.selectedIgnore.length : 'No items') + ' selected.';
  }

  loadEnv() {
    this.automatorApi.getAllEnv().subscribe(result => {
      if (!result || !result.length) {
        return;
      }
      this.allEnvList = result.map(res => ({
        value: res.id,
        label: res.appName
      }));
    });
  }

  toggleSelectAll() {
    this.searchForm.get('showAll').patchValue(!this.searchForm.value.showAll);
  }
  getResults() {
    if (this.isBusy) {
      return;
    }

    this.isBusy = true;
    this.isLoaded = false;
    this.allCompResult = [];
    this.selectedObj = null;
    this.automatorApi.postcompareEnvironment(this.searchForm.value).subscribe(
      result => {
        if (result) {
          this.allCompResult = result;
        }

        this.isBusy = false;
        this.isLoaded = true;
      },
      err => {
        this.isBusy = false;
        this.toastr.error('Something went wrong. Kindly try again', 'Error!');
        if (err.status === 302 || err.status === 303) {
          // this.router.navigate(['/login']);
        }
      }
    );
  }

  loadObject(objectName, objectType) {
    this.selectedObj = null;
    const envA = this.allEnvList.filter(i => i.value === this.searchForm.value.firstEnv);
    const envB = this.allEnvList.filter(i => i.value === this.searchForm.value.secondEnv);
    setTimeout(() => {
      this.selectedObj = {
        firstEnv: this.searchForm.value.firstEnv,
        objectName,
        objectType,
        secondEnv: this.searchForm.value.secondEnv,
        firstEnvName: envA[0].label,
        secondEnvName: envB[0].label
      }
    });
  }
}
