import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { get} from 'lodash';

@Component({
  selector: 'app-audit-permission-detail-dialog',
  templateUrl: './audit-permission.detail.dialog.component.html',
  styleUrls: ['./audit-permission.component.css']
})
export class AuditPermissionDetailDialogComponent {
  permissionRoles: any[] = [];
  shouldShowOnlyDifference: boolean;

  constructor(
    public dialogRef: MatDialogRef<AuditPermissionDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      const newPermissions = data.value['New Permissions'];
      this.permissionRoles=[];
      if (newPermissions && newPermissions.permissionsList) {
        newPermissions.permissionsList.forEach(role => {
          const oldRole = data.value['Old Permissions'].permissionsList.find(
            op => op.permissionId === role.permissionId
            && op.permissionObjectName === role.permissionObjectName
            && op.permissionObjectType === role.permissionObjectType);
            
            this.permissionRoles.push(this.compareRoles(oldRole||{}, role));
        });
      }
      console.log(this.permissionRoles);
    }

  compareRoles(oldRole, newRole) {
    const oldPermissions = [];
    if(oldRole.permissions){
      oldRole.permissions=Object.assign(oldRole.permissions)
    }
    if(newRole.permissions){
      newRole.permissions=Object.assign(newRole.permissions)
    }
    
    if (oldRole && oldRole.permissions) {
      Object.keys(oldRole.permissions).forEach(key => {
        const oldPermission = oldRole.permissions[key];

        if (newRole && newRole.permissions && key in newRole.permissions) {
          oldPermissions.push({
            key,
            value: oldPermission,
            isChanged: oldPermission !== newRole.permissions[key]
          });
        } else {
          oldPermissions.push({
            key,
            value: oldPermission,
            isChanged: false
          });
        }
      });
    }

    const newPermissions = [];

    if (newRole && newRole.permissions) {
      Object.keys(newRole.permissions).forEach(key => {
        const newPermission = newRole.permissions[key];

        if (oldRole && oldRole.permissions && key in oldRole.permissions) {
          newPermissions.push({
            key,
            value: newPermission,
            isChanged: oldRole.permissions[key] !== newPermission
          });
        } else {
          newPermissions.push({
            key,
            value: newPermission,
            isChanged: false
          });
        }
      });
    }

    if(!oldPermissions.length && newPermissions.length){
      newPermissions.forEach(n=>{
        oldPermissions.push(
          {
           key:n.key,
           value:undefined,
           isChanged:true
          }
        )
      })
    }
    if (oldPermissions) {
      oldRole.newPermissions = oldPermissions;
    }

    if (newRole) {
      newRole.newPermissions = newPermissions;
    }

    

    return {
      oldRole,
      newRole
    };
  }

  isRoleChanged(role) {
    if (role && role.permissions) {
      const changedPermission = role.permissions.find(permission => permission.isChanged);
      return changedPermission ? true : false;
    } else {
      return false;
    }
  }

  toggleShowOnlyDifference() {
    if (!this.shouldShowOnlyDifference) {
      this.shouldShowOnlyDifference = true;
    } else {
      this.shouldShowOnlyDifference = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  preventDefault(event) {
    event.preventDefault();
  }
}
