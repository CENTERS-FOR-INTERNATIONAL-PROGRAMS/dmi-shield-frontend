import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {MaterialModule} from "../../material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CFieldsModule} from "../cfields/cfields.module";
import {TablerIconsModule} from "angular-tabler-icons";
import {NgxFileDropModule} from "ngx-file-drop";
import { PageComponent } from './page/page.component';
import {MdbCarouselModule} from "mdb-angular-ui-kit/carousel";
import {DashboardsRoutes} from "./dashboards.routing";



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardsRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CFieldsModule,
    TablerIconsModule,
    NgxFileDropModule,
    MdbCarouselModule
  ],
  declarations: [
    PageComponent
  ]
})
export class DashboardsModule { }
