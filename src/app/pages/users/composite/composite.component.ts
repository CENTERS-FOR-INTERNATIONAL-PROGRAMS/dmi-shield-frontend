import { Component, OnInit } from '@angular/core';
import { AwarenessService } from 'src/app/services/awareness.service';
import { ApiService } from '../../../services/api/api.service';
import { ApiResponseStatus } from 'src/app/interfaces/IAuth.model';
import { User } from '../../../models/User.model';
import { AuthenticationService } from '../../../services/authentication.service';
import { Page } from 'src/app/interfaces/IPage.Model';
import { debounceTime, Subject } from 'rxjs';
import { CommunicationService } from 'src/app/services/communication.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'composite',
  templateUrl: './composite.component.html',
})
export class CompositeComponent implements OnInit {
  users: User[] = [];
  userRole: string;
  latestSearchTerm: string = '';
  page: Page = {
    count: 0,
    limit: 50,
    next: null,
    prev: null,
  };

  private searchQuery$ = new Subject<string>();

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: '',
  };

  constructor(
    public awareness: AwarenessService,
    private apiService: ApiService,
    private communication: CommunicationService,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.getApiUsers();

    this.authenticationService.getApiCurrentUserRole().subscribe({
      next: (role) => {
        this.userRole = role;
      },
      error: (err) => console.error('Error fetching user role', err),
    });

    this.searchQuery$.pipe(debounceTime(500)).subscribe((term) => {
      this.getApiUsers({ searchQuery: term });
    });
  }

  onSearch(event: Event): void {
    let term = (event.target as HTMLInputElement).value;
    this.latestSearchTerm = term;
    this.searchQuery$.next(term);
  }

  getApiUsers({
    searchQuery = null,
    page = null,
  }: { searchQuery?: string; page?: string } = {}) {
    this.ApiResponseStatus.processing = true;

    let url = '';

    if (searchQuery) {
      url = `user?&sort=-created_at&page[limit]=${this.page.limit}&filter[name_matches][input][search]=${searchQuery}`;
    } else if (page === 'next') {
      let temp = this.page.next.split('?')[1];
      url = `user?${temp}`;
    } else if (page === 'prev') {
      let temp = this.page.prev.split('?')[1];
      url = `user?${temp}`;
    } else {
      url = `user?&sort=-created_at&page[limit]=${this.page.limit}`;
    }

    this.apiService.get(url).subscribe({
      next: (res) => {
        this.users = res.data.map(
          (item) =>
            ({
              id: item.id,
              ...item.attributes,
            }) as User,
        );

        this.page = {
          ...this.page,
          ...{
            next: res.links.next || res.links.prev,
            prev: res.links.prev || res.links.next,
            count: res.meta.page.total,
          },
        };
      },
      error: (error) => {
        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.success = false;

        this.communication.showToast('Something went wrong. Kindly try again.');
      },
      complete: () => {
        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.success = true;
      },
    });
  }

  formatUserRoles(role: string): string {
    const roleMap: { [key: string]: string } = {
      level1: 'Level 1',
      level2: 'Level 2',
      admin: 'Admin',
    };
    return roleMap[role] || 'Level 1';
  }

  onPageChanged(event: PageEvent) {
    if (event.pageSize != this.page.limit) {
      this.page.limit = event.pageSize;
      this.getApiUsers();
      return;
    }
    if (event.pageIndex > event.previousPageIndex) {
      this.getApiUsers({ page: 'next' });
    } else if (event.previousPageIndex > event.pageIndex) {
      this.getApiUsers({ page: 'prev' });
    }
  }
}
