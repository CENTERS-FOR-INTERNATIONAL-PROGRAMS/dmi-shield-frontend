import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// Icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

// Components
import { UsersRoutes } from './users.routing';
import { CompositeComponent } from './composite/composite.component';
import { ModifyProfileComponent } from './modify_profile/modify_profile.component';
import { ModifyPasswordComponent } from './modify_password/modify_password.component';
import { ModifyRoleComponent } from './modify_role/modify_role.component';
import { UserProfileComponent } from './user_profile/user_profile.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UsersRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
  ],
  declarations: [
    CompositeComponent,
    ModifyProfileComponent,
    ModifyPasswordComponent,
    ModifyRoleComponent,
    UserProfileComponent,
  ],
})
export class UsersModule {}
