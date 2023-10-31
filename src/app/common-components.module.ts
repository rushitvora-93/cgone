import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostDialogComponent } from './host-dialog/host-dialog.component';
import { AppDetailsComponent } from './app-details/app-details.component';
import { HostDetailComponent } from './host-detail/host-detail.component';
import { RemoveEnvironmentDialogComponent } from './remove-environment-dialog/remove-environment-dialog.component';
import { ChangePasswordDialogComponent } from './dashboard-ocgmwa/app-header/change-password-dialog/change-password-dialog.component';
import { OpenObjectDialogComponent } from './open-object-dialog/open-object-dialog.component';
import { AddRoleDialogComponent } from './dashboard-ocgmwa/app-header/add-role-dialog/add-role-dialog.component';
import { NewUserDialogComponent } from './dashboard-ocgmwa/app-header/new-user-dialog/new-user-dialog.component';
import { NewObjectDialogComponent } from './new-object-dialog/new-object-dialog.component';
import { ObjectDetailDialogComponent } from './object-detail-dialog/object-detail-dialog.component';
import { AuditItemTrailComponent } from './audit-item-trail/audit-item-trail.component';
import { AddSectionComponent } from './add-section/add-section.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { AddSectionKeyValueComponent } from './add-section-key-value/add-section-key-value.component';
import { AuditPermissionDetailDialogComponent } from './audit-permission/audit-permission.detail.dialog.component';
import { AuditPermissionTableComponent } from './audit-permission/audit-permission.table';
import { AddApplicationDialogComponent } from './dialogs/add-application-dialog/add-application-dialog.component';
import { AddConnectionDialogComponent } from './dialogs/add-application-dialog/add-connection-dialog/add-connection-dialog.component';
import { HostAppDetailsComponent } from './dashboard-ocgmwa/oneconnect/host-app-details/host-app-details.component';
import { AddSectionDialogComponent } from './dialogs/add-section-dialog/add-section-dialog.component';
import { AddOptionDialogComponent } from './dialogs/add-option-dialog/add-option-dialog.component';
import { RemoveOptionDialogComponent } from './dialogs/remove-option-dialog/remove-option-dialog.component';
import { IgnoreListDialogComponent } from './components/ignore-list-dialogue/ignore-list-dialog.component';
import { AppCloneDialogComponent } from './components/app-clone-dialogue/app-clone-dialog.component';
import { CreateNewEnvDialogComponent } from './components/create-new-env-dialogue/create-new-env-dialog.component';
import { CopyEnvDialogComponent } from './components/copy-env-dialogue/copy-env-dialog.component';
import { CreateNewEnvHostDialogComponent } from './components/create-new-env-host-dialogue/create-new-env-host-dialog.component';
import { CreateNewEnvHostAppDialogComponent } from './components/create-new-env-host-app-dialogue/create-new-env-host-app-dialog.component';
import { AudtiTrailIgnoreListDialogComponent } from './components/audit-trail-ignore-list/audit-trail-ignore-list-dialog.component';
import { EditHostDialogComponent } from './components/edit-host-dialog/edit-host-dialog.component';
import { SetupNewEnvDialogComponent } from './components/setup-new-env-dialogue/setup-new-env-dialog.component';
import { SetupNewServerDialogComponent } from './components/setup-new-server-dialogue/setup-new-server-dialog.component';
import { AddConnectedServerDialogComponent } from './components/create-new-connected-server-dialog/add-connected-server-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppMaterialModule } from './dashboard-ocgmwa/app-material.module';
import { ApplicationFilterPipe } from './services/application-filter-pipe';
import { EnvDetailsComponent } from './env-details/env-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwitchComponent } from './switch/switch.component';
import { CopyEnvironmentListComponent } from './copy-environment-list/copy-environment-list.component';
import { AppSetupHeaderComponent } from './app-setup-header/app-setup-header.component';
import { EnvironmentListComponent } from './environment-list/environment-list-dialog.component';
import { NewEnvComparisionComponent } from './new-env-comparision/new-env-comparision.component';
import { AuditPermissionComponent } from './audit-permission/audit-permission.component';
import { PromoteReportComponent } from './promote-report/promote-report.component';
import { PromoteConfigComponent } from './promote-config/promote-config.component';
import { EnvironmentComparisonComponent } from './environment-comparison/environment-comparison.component';
import { ObjectDetailComponent } from './object-detail/object-detail.component';
import { FilterPipe } from './services/filter.pipe';
import { ObjectDisplayComponent } from './object-display/object-display.component';
import { PromotEnvironmentWizardComponent } from './promot-environment-wizard/promot-environment-wizard.component';
import { ConfigItemComponent } from './application-details/app-config-item.component';
import { ApplicationDetailsComponent } from './application-details/application-details.component';
import { CampaignComponent } from './campaign/campaign.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
    declarations: [
        ApplicationFilterPipe,
        SwitchComponent,
        CopyEnvironmentListComponent,
        AppSetupHeaderComponent,
        EnvironmentListComponent,
        NewEnvComparisionComponent,
        AuditPermissionComponent,
        PromoteReportComponent,
        PromoteConfigComponent,
        EnvironmentComparisonComponent,
        ObjectDetailComponent,
        FilterPipe,
        ObjectDisplayComponent,
        PromotEnvironmentWizardComponent,
        ConfigItemComponent,
        ApplicationDetailsComponent,
        CampaignComponent,
        EnvDetailsComponent,
        ApplicationFilterPipe,
        HostDialogComponent,
        AppDetailsComponent,
        HostDetailComponent,
        RemoveEnvironmentDialogComponent,
        ChangePasswordDialogComponent,
        OpenObjectDialogComponent,
        AddRoleDialogComponent,
        NewUserDialogComponent,
        NewObjectDialogComponent,
        ObjectDetailDialogComponent,
        AuditItemTrailComponent,
        AddSectionComponent,
        ConfirmationDialogComponent,
        AddSectionKeyValueComponent,
        AuditPermissionDetailDialogComponent,
        AuditPermissionTableComponent,
        AddApplicationDialogComponent,
        AddConnectionDialogComponent,
        HostAppDetailsComponent,
        AddSectionDialogComponent,
        AddOptionDialogComponent,
        RemoveOptionDialogComponent,
        IgnoreListDialogComponent,
        AppCloneDialogComponent,
        CreateNewEnvDialogComponent,
        CopyEnvDialogComponent,
        CreateNewEnvHostDialogComponent,
        CreateNewEnvHostAppDialogComponent,
        AudtiTrailIgnoreListDialogComponent,
        EditHostDialogComponent,
        SetupNewEnvDialogComponent,
        SetupNewServerDialogComponent,
        AddConnectedServerDialogComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AppMaterialModule,
        NgbModule,
        SharedModule
    ],
    exports: [
        ApplicationFilterPipe,
        SwitchComponent,
        CopyEnvironmentListComponent,
        AppSetupHeaderComponent,
        EnvironmentListComponent,
        NewEnvComparisionComponent,
        AuditPermissionComponent,
        PromoteReportComponent,
        PromoteConfigComponent,
        EnvironmentComparisonComponent,
        ObjectDetailComponent,
        FilterPipe,
        CampaignComponent,
        ObjectDisplayComponent,
        PromotEnvironmentWizardComponent,
        ConfigItemComponent,
        ApplicationDetailsComponent,
        EnvDetailsComponent,
        HostDialogComponent,
        AppDetailsComponent,
        HostDetailComponent,
        RemoveEnvironmentDialogComponent,
        ChangePasswordDialogComponent,
        OpenObjectDialogComponent,
        AddRoleDialogComponent,
        NewUserDialogComponent,
        NewObjectDialogComponent,
        ObjectDetailDialogComponent,
        AuditItemTrailComponent,
        AddSectionComponent,
        ConfirmationDialogComponent,
        AddSectionKeyValueComponent,
        AuditPermissionDetailDialogComponent,
        AuditPermissionTableComponent,
        AddApplicationDialogComponent,
        AddConnectionDialogComponent,
        HostAppDetailsComponent,
        AddSectionDialogComponent,
        AddOptionDialogComponent,
        RemoveOptionDialogComponent,
        IgnoreListDialogComponent,
        AppCloneDialogComponent,
        CreateNewEnvDialogComponent,
        CopyEnvDialogComponent,
        CreateNewEnvHostDialogComponent,
        CreateNewEnvHostAppDialogComponent,
        AudtiTrailIgnoreListDialogComponent,
        EditHostDialogComponent,
        SetupNewEnvDialogComponent,
        SetupNewServerDialogComponent,
        AddConnectedServerDialogComponent,
        NgbModule,
        SharedModule
    ],
    entryComponents: [
        AddSectionDialogComponent,
        AppCloneDialogComponent,
        HostDialogComponent,
        AddOptionDialogComponent,
        EditHostDialogComponent,
        AddConnectionDialogComponent,
        AddApplicationDialogComponent,
        ChangePasswordDialogComponent,
        NewUserDialogComponent,
        AddRoleDialogComponent,
        RemoveEnvironmentDialogComponent,
        SetupNewServerDialogComponent,
        SetupNewEnvDialogComponent,
        AddConnectedServerDialogComponent,
        RemoveOptionDialogComponent
    ]
})
export class CommonComponentsModule { }
