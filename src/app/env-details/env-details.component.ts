import { Component, OnInit, Input ,Output, EventEmitter} from '@angular/core';
import{Login} from '../models/login';
@Component({
  selector: 'app-env-details',
  templateUrl: './env-details.component.html',
  styleUrls: ['./env-details.component.css']
})
export class EnvDetailsComponent implements OnInit {
  @Output() onLogOut: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoad: EventEmitter<any> = new EventEmitter<any>();
  @Output() onRemoveEnvironment: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPromoteEnvironment: EventEmitter<any> = new EventEmitter<any>();
  public isCollapsed = false;
  @Input() env: Login;
  constructor() { }

  ngOnInit() {
  }

  logOut(env) {
    this.onLogOut.emit(env);
  }

  loadEnvironment(env) {
       this.onLoad.emit(env);
  }

  removeEnvironment(env) {
    this.onRemoveEnvironment.emit(env);
  }

  promoteEnvironment(env) {
    // console.log(env);
    this.onPromoteEnvironment.emit(env);
  }
}
