import { Component, OnInit } from '@angular/core';
import { AwarenessService } from '../../../services/awareness.service';
import { ApiService } from '../../../services/api/api.service';
import { ApiResponseStatus } from '../../../interfaces/IAuth.model';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { Threshold } from 'src/app/interfaces/IThreshold.model';
import { CommunicationService } from 'src/app/services/communication.service';
import { debounceTime, Subject } from 'rxjs';
import { Page } from 'src/app/interfaces/IPage.Model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-composites',
  templateUrl: './composite.component.html',
})
export class CompositeComponent implements OnInit {
  thresholds: Threshold[] = [];
  filteredThresholds: Threshold[] = [];
  userRole: string;
  latestSearchTerm: string = '';
  page: Page = {
    count: 0,
    limit: 10,
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
    private awareness: AwarenessService,
    private apiService: ApiService,
    private communication: CommunicationService,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.authenticationService.getApiCurrentUserRole().subscribe({
      next: (role) => {
        this.userRole = role;
      },
      error: (err) => {
        console.error('Error fetching user role', err);

        this.router.navigate(['/authentication/login']);
      },
    });

    this.loadComposites();

    this.searchQuery$.pipe(debounceTime(500)).subscribe((term) => {
      this.loadComposites({ searchQuery: term });
    });
  }

  onSearch(event: Event): void {
    let term = (event.target as HTMLInputElement).value;
    this.latestSearchTerm = term;
    this.searchQuery$.next(term);
  }

  filterClientSide(items: any[], term: string): any[] {
    const lowerTerm = term.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(lowerTerm));
  }

  loadComposites({
    searchQuery = null,
    page = null,
  }: { searchQuery?: string; page?: string } = {}) {
    this.ApiResponseStatus.processing = true;
    const userData = this.awareness.getUserData();

    let url = '';

    if (searchQuery) {
      url = `thresholds?user_id=${userData.id}&sort=-created_at&filter[name_matches][input][search]=${searchQuery}`;
    } else if (page === 'next') {
      let temp = this.page.next.split('?')[1];
      url = `thresholds?${temp}`;
    } else if (page === 'prev') {
      let temp = this.page.prev.split('?')[1];
      url = `thresholds?${temp}`;
    } else {
      url = `thresholds?user_id=${userData.id}&sort=-created_at`;
    }

    this.apiService.get(url).subscribe({
      next: (res) => {
        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.success = true;

        this.thresholds = res.data.map((item) => {
          return { ...item.attributes, ...{ id: item.id } } as Threshold;
        });

        this.page = {
          next: res.links.next || res.links.prev,
          prev: res.links.prev || res.links.next,
          limit: res.meta.page.limit || 10,
          count: res.meta.page.total,
        };
      },
      error: (error) => {
        this.ApiResponseStatus.success = false;
        this.ApiResponseStatus.processing = false;

        this.communication.showToast('Something went wrong. Kindly try again.');
      },
      complete: () => {
        this.ApiResponseStatus.success = true;
        this.ApiResponseStatus.processing = false;
      },
    });
  }

  deleteThreshold(id: string) {
    this.ApiResponseStatus.processing = true;

    this.apiService.deleteRequest(`thresholds/${id}`).subscribe({
      next: (_) => {
        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.success = true;

        this.communication.showToast('Threshold deleted succesfully');
        this.thresholds = this.thresholds.filter((item) => item.id !== id);
      },
      error: (_) => {
        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.success = false;

        this.communication.showToast(
          'Failed to delete threshold. Kindly try again.',
        );
      },
      complete: () => {
        this.ApiResponseStatus.success = true;
        this.ApiResponseStatus.processing = false;
      },
    });
  }

  parseDate(timestamp: number) {
    return new Date(timestamp).toLocaleDateString();
  }

  onPageChanged(event: PageEvent) {
    if (event.pageIndex > event.previousPageIndex) {
      this.loadComposites({ page: 'next' });
    } else if (event.previousPageIndex > event.pageIndex) {
      this.loadComposites({ page: 'prev' });
    }
  }
}
