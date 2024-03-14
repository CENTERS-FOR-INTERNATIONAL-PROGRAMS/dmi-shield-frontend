import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// Icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

// Components
import { SyndromesRoutes } from './syndromes.routing';
import { CompositeComponent } from './composite/composite.component';
import { ModifyComponent } from './modify/modify.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SyndromesRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons)
  ],
  declarations: [
    CompositeComponent,
    ModifyComponent
  ]
})
export class SyndromesModule {
}