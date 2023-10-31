import { Component, Input } from '@angular/core';

/**
 * @title Table with sticky header
 */
@Component({
  selector: 'app-audit-permission-table',
  styleUrls: ['./audit-permission.component.css'],
  templateUrl: './audit-permission.table.html'
})
export class AuditPermissionTableComponent {
  displayedColumns = ['name', 'type', 'change', 'changePermission', 'create',
    'delete', 'execute', 'fullcontrol', 'noAccess', 'read', 'readPermission'];
  @Input() dataSource: any = [];
  removeCFG(objectType) {
    if (objectType && objectType.substring(0, 3) === 'CFG') {
      return objectType.substring(3);
    }
    return objectType;
  }
}
