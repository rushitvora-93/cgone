import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardOcgmwaComponent } from './dashboard-ocgmwa.component';
import { Routes, RouterModule } from '@angular/router';
import { AppHeaderDarkComponent } from './app-header/app-header.component';
import { AppMaterialModule } from './app-material.module';
import { CommonComponentsModule } from '../common-components.module';
import { OneTestComponent } from './one-test/one-test.component';
import { CreateSprintComponent } from './one-test/create-sprint/create-sprint.component';
import { SprintDetailsComponent } from './one-test/sprint-details/sprint-details.component';
import { ScriptTemplateComponent } from './one-test/script-template/script-template.component';
import { AddEnvironmentComponent } from './oneconnect/add-environment/add-environment.component';
import { AddHostComponent } from './oneconnect/add-host/add-host.component';
import { AppCloneComponent } from './oneconnect/app-clone/app-clone.component';
import { HomeSummaryComponent } from './home-summary/home-summary.component';
import { OneChangePromoteComponent } from './one-change/one-change-promote/one-change-promote.component';
import { ConfigPromoteListComponent } from './one-change/one-change-promote/config-promote-list/config-promote-list.component';
import { OneChangePromoteReportComponent } from './one-change/promote-report/promote-report.component';
import { ComparePromoteEnvComponent } from './one-change/one-change-promote/compare-promote-env/compare-promote-env.component';
import { OneTrackComponent } from './one-track/one-track/one-track.component';
import { OtItemChangesComponent } from './one-track/one-track/ot-item-changes/ot-item-changes.component';
import { OtPermissionComponent } from './one-track/ot-permission/ot-permission.component';
import { PermissionManagerComponent } from './one-track/ot-permission/permission-manager/permission-manager.component';
import { OtComparisonComponent } from './one-track/ot-comparison/ot-comparison.component';
import { ScriptListComponent } from './one-test/script-list/script-list.component';
import { OdVirtualEnvComponent } from './one-design/od-virtual-env/od-virtual-env.component';
import { OdCopyEnvComponent } from './one-design/od-copy-env/od-copy-env.component';
import { OdCreateEnvComponent } from './one-design/od-virtual-env/od-create-env/od-create-env.component';
import { OdEnvDetailsComponent } from './one-design/od-virtual-env/od-env-details/od-env-details.component';
import { OdAddHostComponent } from './one-design/od-virtual-env/od-add-host/od-add-host.component';
import { OdAddAppComponent } from './one-design/od-virtual-env/od-add-app/od-add-app.component';
import { AddConnServerComponent } from './one-design/od-virtual-env/od-add-app/add-conn-server/add-conn-server.component';
import { OdCopyEnvDetailsComponent } from './one-design/od-copy-env/od-copy-env-details/od-copy-env-details.component';
import { OdCopyObjectTypesComponent } from './one-design/od-copy-env/od-copy-object-types/od-copy-object-types.component';
import { OdDuplicateNvComponent } from './one-design/od-copy-env/od-duplicate-nv/od-duplicate-nv.component';
import { OdCopyEditHostComponent } from './one-design/od-copy-env/od-copy-edit-host/od-copy-edit-host.component';
import { CompareEnvOtComponent } from './one-track/ot-comparison/compare-env-ot/compare-env-ot.component';
import { OdCopyAddAppComponent } from './one-design/od-copy-env/od-copy-add-app/od-copy-add-app.component';
import { CreateServiceComponent } from './one-test/create-service/create-service.component';
import { ServiceListComponent } from './one-test/service-list/service-list.component';
import { NgxAudioPlayerModule } from 'ngx-audio-player';

const homeRoutes: Routes = [
  {
    path: '',
    component: DashboardOcgmwaComponent,
    children: [
      {
        path: 'home',
        component: HomeSummaryComponent
      },
      {
        path: 'onetest',
        component: OneTestComponent
      },
      {
        path: 'onetest/create',
        component: CreateSprintComponent
      },
      {
        path: 'onetest/sprint/:id',
        component: SprintDetailsComponent
      },
      {
        path: 'onetest/script',
        component: ScriptListComponent
      },
      {
        path: 'onetest/service',
        component: ServiceListComponent
      },
      {
        path: 'onetest/script/create',
        component: ScriptTemplateComponent
      },
      {
        path: 'onetest/service/create',
        component: CreateServiceComponent
      },
      {
        path: 'oneconnect/environment/add',
        component: AddEnvironmentComponent
      },
      {
        path: 'oneconnect/host/add',
        component: AddHostComponent
      },
      {
        path: 'oneconnect/apps/clone',
        component: AppCloneComponent
      },
      {
        path: 'onechange/promote',
        component: OneChangePromoteComponent
      },
      {
        path: 'onechange/promote/report',
        component: OneChangePromoteReportComponent
      },
      {
        path: 'onetrack/track',
        component: OneTrackComponent
      },
      {
        path: 'onetrack/permission',
        component: OtPermissionComponent
      },
      {
        path: 'onetrack/compare',
        component: OtComparisonComponent
      },
      {
        path: 'onedesign/env/virtual',
        component: OdVirtualEnvComponent
      },
      {
        path: 'onedesign/env/virtual/:envId',
        component: OdEnvDetailsComponent
      },
      {
        path: 'onedesign/env/copy',
        component: OdCopyEnvComponent
      },
      {
        path: 'onedesign/env/copy/:envId',
        component: OdCopyEnvDetailsComponent
      },
      {
        path: 'onedesign/env/copy/:envId/config',
        component: OdCopyObjectTypesComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    DashboardOcgmwaComponent,
    AppHeaderDarkComponent,
    OneTestComponent,
    CreateSprintComponent,
    CreateServiceComponent,
    SprintDetailsComponent,
    ScriptTemplateComponent,
    ServiceListComponent,
    AddEnvironmentComponent,
    AddHostComponent,
    AppCloneComponent,
    HomeSummaryComponent,
    OneChangePromoteComponent,
    ConfigPromoteListComponent,
    OneChangePromoteReportComponent,
    ComparePromoteEnvComponent,
    OneTrackComponent,
    OtItemChangesComponent,
    OtPermissionComponent,
    PermissionManagerComponent,
    OtComparisonComponent,
    ScriptListComponent,
    OdVirtualEnvComponent,
    OdCopyEnvComponent,
    OdCreateEnvComponent,
    OdEnvDetailsComponent,
    OdAddHostComponent,
    OdAddAppComponent,
    AddConnServerComponent,
    OdCopyEnvDetailsComponent,
    OdCopyObjectTypesComponent,
    OdDuplicateNvComponent,
    OdCopyEditHostComponent,
    CompareEnvOtComponent,
    OdCopyAddAppComponent
  ],
  imports: [
    CommonModule,
    NgxAudioPlayerModule,
    RouterModule.forChild(homeRoutes),
    AppMaterialModule,
    CommonComponentsModule
  ],
  entryComponents: [
    OtItemChangesComponent,
    PermissionManagerComponent,
    OdCreateEnvComponent,
    OdAddHostComponent,
    OdAddAppComponent,
    AddConnServerComponent,
    OdDuplicateNvComponent,
    OdCopyEditHostComponent,
    OdCopyAddAppComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DashboardOcgmwaModule { }
