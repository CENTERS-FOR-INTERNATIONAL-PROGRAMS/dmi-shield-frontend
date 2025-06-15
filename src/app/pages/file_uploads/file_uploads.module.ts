import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadsRoutes } from './file_uploads.routing';
import { CompositeComponent } from './composite/composite.component';
import { ModifyComponent } from './modify/modify.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxFileDropModule } from 'ngx-file-drop';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(FileUploadsRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    NgxFileDropModule,
  ],
  declarations: [CompositeComponent, ModifyComponent],
})
export class FileUploadsModule {}
