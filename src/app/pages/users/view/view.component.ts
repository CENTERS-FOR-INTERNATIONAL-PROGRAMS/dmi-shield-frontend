import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import {ApiService} from "../../../services/api/api.service";
import { ApiResponseStatus } from 'src/app/interfaces/IAuth.model';

@Component({
  selector: 'view',
  templateUrl: './view.component.html'
})
export class ViewComponent implements OnInit {

  UserInstance: User = new User();

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: ""
  }

  constructor(public awareness: AwarenessService, private apiService: ApiService) { }

  ngOnInit(): void {
    this.UserInstance.id = this.awareness.getFocused("user");

    this.getApiUser();

  }

  getApiUser() {
    // https://kratos.icapkenya.org/api/v1/user/ssss
    const url = `user/${this.UserInstance.id}`;

    this.apiService.get(url).subscribe({
      next: (res) => {
        this.ApiResponseStatus.success = true;

        this.UserInstance = {
          id: res.data.id,
          ...res.data.attributes
        };
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
