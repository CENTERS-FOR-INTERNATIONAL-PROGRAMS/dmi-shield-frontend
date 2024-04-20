import { Component, OnInit } from '@angular/core';
import { AwarenessService } from 'src/app/services/awareness.service';
import {ApiService} from "../../../services/api/api.service";
import { ApiResponseStatus } from 'src/app/interfaces/IAuth.model';
import {User} from "../../../models/User.model";

@Component({
  selector: 'composite',
  templateUrl: './composite.component.html'
})

export class CompositeComponent implements OnInit {
  Users: User[] = [];
  FilterUser: User = new User;

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: ""
  }

  constructor(public awareness: AwarenessService, private apiService: ApiService) { }

  ngOnInit(): void {
    this.getApiUsers();
  }


  getApiUsers(){
    console.log("getApiUsers", 'getApiUsers');
    //https://kratos.icapkenya.org/api/v1/user
    this.apiService.get('user').subscribe({
      next: (res) => {
        this.ApiResponseStatus.success = true;
        this.Users = res.data.map(item => item.attributes);
        console.log(this.Users);
      },
      error: (error) =>{
        this.ApiResponseStatus.processing = false;
      },
      complete: () =>{
        this.ApiResponseStatus.processing = false;
      },
    });
  }
}
