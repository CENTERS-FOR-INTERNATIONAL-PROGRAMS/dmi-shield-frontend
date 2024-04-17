import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {MaterialModule} from "../../material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CompositeComponent} from "./composite/composite.component";
import {CFieldsModule} from "../cfields/cfields.module";
import {TablerIconsModule} from "angular-tabler-icons";
import {NgxFileDropModule} from "ngx-file-drop";
import {NotificationsRoutes} from "./notifications.routing";



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(NotificationsRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CFieldsModule,
    TablerIconsModule,
  ],
  declarations: [
    CompositeComponent
  ]
})
export class NotificationsModule { }
