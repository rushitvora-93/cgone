import { Injectable, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    public sprintSource = new BehaviorSubject('');
    currentMessage = this.sprintSource.asObservable();

    constructor() { }

    setSprint(sprintData) {
        this.sprintSource.next(sprintData);
    }
}