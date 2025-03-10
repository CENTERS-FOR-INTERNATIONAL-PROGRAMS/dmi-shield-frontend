import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// Icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { AnalyticsRoutes } from './analytics.routing';
import { AdvancedComponent } from './advanced/advanced.component';
import { SimpleComponent } from './simple/simple.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AnalyticsRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
  ],
  declarations: [AdvancedComponent, SimpleComponent],
})
export class AnalyticsModule {}
