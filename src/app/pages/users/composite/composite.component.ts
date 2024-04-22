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
  searchQuery: string = '';

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

  get filteredUsers() {
    return this.Users.filter(user =>
      user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  getApiUsers() {
    this.ApiResponseStatus.processing = true;
    this.apiService.get('user').subscribe({
      next: (res) => {
        this.ApiResponseStatus.success = true;
        this.Users = res.data.map(item => ({
          id: item.id,
          ...item.attributes
        }));
      },
      error: (error) => {
        this.ApiResponseStatus.processing = false;
      },
      complete: () => {
        this.ApiResponseStatus.processing = false;
      },
    });
  }

  formatUserRoles(role: string): string {
    const roleMap: { [key: string]: string } = {
      'level1': 'Level 1',
      'level2': 'Level 2',
      'admin': 'Admin'
    };
    return roleMap[role] || 'Level 1';
  }

}
