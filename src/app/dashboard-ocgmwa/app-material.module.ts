import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { MatButtonModule, MatCardModule, MatDialogModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatProgressSpinnerModule, MatSidenavModule, MatSnackBarModule, MAT_LABEL_GLOBAL_OPTIONS, MatAutocompleteModule, MatSlideToggleModule, MatSelectModule, MatTableModule, MatProgressBarModule, MatTabsModule, MatCheckboxModule, MatChipsModule, MatSortModule, MatTooltipModule, MatOptionModule, MatStepperModule, MatRadioModule, MatDatepickerModule, MatNativeDateModule, MatGridListModule, MatSliderModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
    imports: [
        CommonModule,
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
        MatGridListModule,
        MatMomentDatetimeModule,
        MatDatetimepickerModule,
        DragDropModule
    ],
    exports: [
        CommonModule,
        DragDropModule,
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
        MatGridListModule,
        MatMomentDatetimeModule,
        MatDatetimepickerModule
    ],
    providers: [
        {
            provide: MAT_LABEL_GLOBAL_OPTIONS,
            useValue: { float: 'auto' } // float is of type auto | always | never and auto by default
        }
    ]
})
export class AppMaterialModule { }
