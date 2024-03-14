import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// Pages
import { OutbreaksRoutes } from './outbreaks.routing';
import { CompositeComponent } from './composite/composite.component';
import { ModifyComponent } from './modify/modify.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(OutbreaksRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    CompositeComponent,
    ModifyComponent
  ]
})
export class OutbreaksModule { }
