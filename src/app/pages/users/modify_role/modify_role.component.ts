import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/User.model';
import { CommunicationService } from 'src/app/services/communication.service';
import { ApiService } from '../../../services/api/api.service';
import {
  ApiResponseStatus,
  ChangeUserRoleData,
} from 'src/app/interfaces/IAuth.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'modify_role',
  templateUrl: './modify_role.component.html',
})
export class ModifyRoleComponent implements OnInit {
  currentUser = new User();
  UserFormControls = new FormGroup({
    role: new FormControl(null, [Validators.required]),
  });
  userRoleData: ChangeUserRoleData;

  userId?: string | null = null;

  CompositeRoles: any[] = [
    {
      name: 'Level One',
      value: 'level1',
    },
    {
      name: 'Level Two',
      value: 'level2',
    },
    {
      name: 'Admin',
      value: 'admin',
    },
  ];

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: '',
  };

  constructor(
    private communication: CommunicationService,
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.getApiUser();
  }

  submitInstance(): void {
    if (!this.UserFormControls.get('role').hasError('required')) {
      this.changeUserRole();
    } else {
      this.communication.showToast('Kindly fill in all required fields!');
    }
  }

  changeUserRole() {
    this.ApiResponseStatus.processing = true;

    this.userRoleData = {
      data: {
        attributes: {
          role: this.UserFormControls.get('role').value[0],
        },
        id: this.currentUser.id,
        type: 'User',
      },
    };

    const url = `user/change-role/${this.userId}`;
    this.apiService.patchRequest(url, this.userRoleData).subscribe({
      next: (res) => {
        this.ApiResponseStatus.success = true;
        this.ApiResponseStatus.message = 'Success';
      },
      error: (error) => {
        this.ApiResponseStatus.processing = false;

        this.communication.showToast('Something went wrong. Try again.');
      },
      complete: () => {
        this.ApiResponseStatus.processing = false;

        this.communication.showToast('User role updated successfully');
      },
    });
  }

  getApiUser(): void {
    this.ApiResponseStatus.processing = true;
    const url = `user/${this.userId}`;

    this.apiService.get(url).subscribe({
      next: (res) => {
        this.currentUser = {
          id: res.data.id,
          ...res.data.attributes,
        };

        let role = this.CompositeRoles.find(
          (e) => e.value == this.currentUser.role,
        );

        this.UserFormControls.setValue({ role: [role.value] });
      },
      error: (error) => {
        this.ApiResponseStatus.processing = false;
      },
      complete: () => {
        this.ApiResponseStatus.processing = false;
      },
    });
  }
}
