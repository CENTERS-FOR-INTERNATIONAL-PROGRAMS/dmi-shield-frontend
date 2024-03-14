import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {MaterialModule} from "../../material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SurveillanceDataRoutes} from "./resources.routing";
import {CompositeComponent} from "./composite/composite.component";
import {ModifyComponent} from "./modify/modify.component";
import {CFieldsModule} from "../cfields/cfields.module";
import {TablerIconsModule} from "angular-tabler-icons";
import {NgxFileDropModule} from "ngx-file-drop";



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SurveillanceDataRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CFieldsModule,
    TablerIconsModule,
    NgxFileDropModule
  ],
  declarations: [
    CompositeComponent,
    ModifyComponent
  ]
})
export class ResourcesModule { }
