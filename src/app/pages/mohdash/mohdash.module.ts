import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompositeComponent } from './composite/composite.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MohdashRoutes } from './mohdash.routing';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MohdashRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    NgxFileDropModule,
    MdbCarouselModule,
  ],
  declarations: [CompositeComponent],
})
export class MohdashModule {}
