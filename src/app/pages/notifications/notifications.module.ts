import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompositeComponent } from './composite/composite.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NotificationsRoutes } from './notifications.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(NotificationsRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
  declarations: [CompositeComponent],
})
export class NotificationsModule {}
