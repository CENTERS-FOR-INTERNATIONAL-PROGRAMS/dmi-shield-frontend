import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// Icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

// Components
import { MFieldsRoutes } from './mfields.routing';
import { CompositeComponent } from './composite/composite.component';
import { ModifyComponent } from './modify/modify.component';

// Modules
import { CFieldsModule } from '../cfields/cfields.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MFieldsRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    CFieldsModule
  ],
  declarations: [
    CompositeComponent,
    ModifyComponent
  ]
})
export class MFieldsModule {
}