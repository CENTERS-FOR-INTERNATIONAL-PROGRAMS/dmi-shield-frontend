import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxFileDropModule } from 'ngx-file-drop';
import { PageComponent } from './page/page.component';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { AboutRoutes } from './about.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AboutRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    NgxFileDropModule,
    MdbCarouselModule,
  ],
  declarations: [PageComponent],
})
export class AboutModule {}
