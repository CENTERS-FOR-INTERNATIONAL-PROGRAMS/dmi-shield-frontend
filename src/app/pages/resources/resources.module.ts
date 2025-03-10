import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompositeComponent } from './composite/composite.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxFileDropModule } from 'ngx-file-drop';
import { ResourcesRoutes } from './resources.routing';
import { ModifyComponent } from './modify/modify.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ResourcesRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    NgxFileDropModule,
  ],
  declarations: [CompositeComponent, ModifyComponent],
})
export class ResourcesModule {}
