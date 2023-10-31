import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { Home, ChevronLeft, ChevronRight, ChevronDown, Circle, Search, X, Check, Trash2, User, Lock, Plus, Edit, Clock, Calendar, UserPlus, ArrowDownCircle, ArrowUpCircle } from 'angular-feather/icons';
import { CardComponent } from './card/card.component';
import { NzIconModule, NzButtonModule, NzAvatarModule, NzDropDownModule, NzBreadCrumbModule, NzSelectModule, NzInputModule, NzRadioModule, NzFormModule } from 'ng-zorro-antd';
import { MwaRadioComponent } from './mwa-radio/mwa-radio.component';
import { MwaSwitchComponent } from './mwa-switch/mwa-switch.component';
import { MwaCheckComponent } from './mwa-check/mwa-check.component';
import { MwaDateComponent } from './mwa-date/mwa-date.component';
import { MatSliderModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Select some icons (use an object, not an array)
const icons = {
  Home, ChevronLeft, ChevronRight, ChevronDown, Circle, Search, X, Check, Trash2, User, Lock, Plus, Edit, Clock, Calendar, UserPlus, ArrowDownCircle, ArrowUpCircle
};

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [CardComponent, MwaRadioComponent, MwaSwitchComponent, MwaCheckComponent, MwaDateComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FeatherModule.pick(icons),
    NzButtonModule,
    NzAvatarModule,
    NzDropDownModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzSelectModule,
    NzInputModule,
    NzRadioModule,
    NzFormModule,
    MatSliderModule,
  ],
  exports: [
    FeatherModule,
    CardComponent,
    NzButtonModule,
    NzAvatarModule,
    NzDropDownModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzSelectModule,
    NzInputModule,
    NzRadioModule,
    NzFormModule,
    MwaRadioComponent,
    MwaSwitchComponent,
    MwaDateComponent,
    MwaCheckComponent
  ]
})
export class SharedModule { }
