import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThresholdsRoutes } from './thresholds.routing';
import { CompositeComponent } from './composite/composite.component';
import { ModifyComponent } from './modify/modify.component';
import { EditComponent } from './edit/edit.component';
import { CFieldsModule } from '../cfields/cfields.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxFileDropModule } from 'ngx-file-drop';
import { ThresholdFormComponent } from './forms/threshold.form.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ThresholdsRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CFieldsModule,
    TablerIconsModule,
    NgxFileDropModule,
  ],
  declarations: [
    CompositeComponent,
    ModifyComponent,
    EditComponent,
    ThresholdFormComponent,
  ],
})
export class ThresholdsModule {}
