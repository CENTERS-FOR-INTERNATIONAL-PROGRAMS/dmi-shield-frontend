import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThresholdsRoutes } from './thresholds.routing';
import { CompositeComponent } from './composite/composite.component';
import { ModifyComponent } from './modify/modify.component';
import { EditComponent } from './edit/edit.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxFileDropModule } from 'ngx-file-drop';
import { ThresholdFormComponent } from './forms/threshold.form.component';
import { ThresholdItemComponent } from './composite/item/threshold.item.component';
import { MatIconModule } from '@angular/material/icon';
import { AlertFormComponent } from './forms/alerts/alert.form.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ThresholdsRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    NgxFileDropModule,
    MatIconModule,
  ],
  declarations: [
    CompositeComponent,
    ModifyComponent,
    EditComponent,
    ThresholdFormComponent,
    ThresholdItemComponent,
    AlertFormComponent,
  ],
})
export class ThresholdsModule {}
