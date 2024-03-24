import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {MaterialModule} from "../../material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CompositeComponent} from "./composite/composite.component";
import {CFieldsModule} from "../cfields/cfields.module";
import {TablerIconsModule} from "angular-tabler-icons";
import {NgxFileDropModule} from "ngx-file-drop";
import {MohdashRoutes} from "./mohdash.routing";



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MohdashRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CFieldsModule,
    TablerIconsModule,
    NgxFileDropModule
  ],
  declarations: [
    CompositeComponent,
  ]
})
export class MohdashModule { }
