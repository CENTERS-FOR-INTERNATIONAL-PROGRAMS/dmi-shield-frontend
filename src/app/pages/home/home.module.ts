import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {MaterialModule} from "../../material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CFieldsModule} from "../cfields/cfields.module";
import {TablerIconsModule} from "angular-tabler-icons";
import {NgxFileDropModule} from "ngx-file-drop";
import { WelcomeComponent } from './welcome/welcome.component';
import {HomeRoutes} from "./home.routing";



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(HomeRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CFieldsModule,
    TablerIconsModule,
    NgxFileDropModule
  ],
  declarations: [
    WelcomeComponent
  ]
})
export class HomeModule { }
