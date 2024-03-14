import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// Icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

// Components
import { MFormDataRoutes } from './mform_data.routing';
import { CompositeComponent } from './composite/composite.component';
import { ModifyComponent } from './modify/modify.component';

import { FFieldsComponent } from 'src/app/layouts/ffields/ffields.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MFormDataRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TablerIconsModule.pick(TablerIcons)
  ],
  declarations: [
    CompositeComponent,
    ModifyComponent,
    FFieldsComponent
  ]
})
export class MFormDataModule {
}