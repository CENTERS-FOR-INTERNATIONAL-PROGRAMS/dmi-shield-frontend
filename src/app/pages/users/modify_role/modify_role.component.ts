import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CompositeFormControls } from 'src/app/models/CompositeFormControls.model';
import { User } from 'src/app/models/User.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import { CommunicationService } from 'src/app/services/communication.service';
import {ApiService} from "../../../services/api/api.service";
import {ApiResponseStatus, ChangeUserRoleData, CreatePreSignedUrlData} from 'src/app/interfaces/IAuth.model';

@Component({
  selector: 'modify_role',
  templateUrl: './modify_role.component.html'
})

export class ModifyRoleComponent implements OnInit {
  UserInstance = new User();
  UserFormControls: CompositeFormControls = {};
  userRoleData: ChangeUserRoleData;
  CompositeRoles: any[] = [
    {
      name: "Level One",
      value: 'level1'
    }, {
      name: "Level Two",
      value: 'level2'
    }, {
      name: "Admin",
      value: 'admin'
    }
  ];

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: ""
  }

  constructor(private awareness: AwarenessService, private communication: CommunicationService,
              private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.seedInstance();

    this.awareness.awaken(() => {
      this.initialize();
      this.getApiUser();
    });
  }

  initialize() {
    this.UserInstance.id = this.awareness.getFocused("user");
  }

  seedInstance() {
    this.UserFormControls["user_role"] = new FormControl('', [Validators.required]);
  }

  submitInstance(): void {
    let is_valid = true;

    Object.keys(this.UserFormControls).forEach(fc_key => {
      if (this.UserFormControls[fc_key].hasError("required")) {
        is_valid = false;
        return;
      }
    });

    if (is_valid) {
        this.changeUserRole();
    } else {
      this.communication.showToast("Kindly fill in all required fields!");
    }
  }

  changeUserRole(){
    this.ApiResponseStatus.processing = true;
    this.userRoleData = {
      data: {
        attributes: {
          role: this.UserInstance.role[0]
        },
        id: this.UserInstance.id,
        type: 'User'
      }
    };

    const url = `user/change-role/${this.UserInstance.id}`;
    this.apiService.patchRequest(url, this.userRoleData).subscribe({
      next: (res) => {
        this.ApiResponseStatus.success = true;
        this.ApiResponseStatus.message = 'Success';
        console.log(res);
      },
      error: (error) =>{
        this.ApiResponseStatus.processing = false;
      },
      complete: () =>{
        this.ApiResponseStatus.processing = false;
      },
    });
  }

  getApiUser(): void {
    this.ApiResponseStatus.processing = true;
    const url = `user/${this.UserInstance.id}`;

    this.apiService.get(url).subscribe({
      next: (res) => {
        this.UserInstance = {
          id: res.data.id,
          ...res.data.attributes
        };
      },
      error: (error) => {
        this.ApiResponseStatus.processing = false;
      },
      complete: () => {
        console.log(this.UserInstance);
        this.ApiResponseStatus.processing = false;
      },
    });
  }


}
