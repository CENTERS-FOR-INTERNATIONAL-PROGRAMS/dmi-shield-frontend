import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {MaterialModule} from "../../material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CompositeComponent} from "./composite/composite.component";
import {ModifyComponent} from "./modify/modify.component";
import {CFieldsModule} from "../cfields/cfields.module";
import {TablerIconsModule} from "angular-tabler-icons";
import {ThresholdsRoutes} from "./thresholds.routing";
import {MatTableModule} from '@angular/material/table';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ThresholdsRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CFieldsModule,
    TablerIconsModule,
    MatTableModule
  ],
  declarations: [
    CompositeComponent,
    ModifyComponent
  ]
})
export class ThresholdsModule { }
