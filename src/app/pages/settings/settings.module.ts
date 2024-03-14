import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { SettingsRoutes } from './settings.routing';
import { ConfigurationsComponent } from './configurations/configurations.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SettingsRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
  ],
  declarations: [
    ConfigurationsComponent
  ]
})
export class SettingsModule { }
