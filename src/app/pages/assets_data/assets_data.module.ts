import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxFileDropModule } from 'ngx-file-drop';
import { AssetsDataRoutes } from './assets_data.routing';
import { AssetsComponent } from './assets/assets.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AssetsDataRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    NgxFileDropModule,
  ],
  declarations: [AssetsComponent],
})
export class Assets_dataModule {}
