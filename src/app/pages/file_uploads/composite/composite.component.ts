import { Component, OnInit } from '@angular/core';
import { AwarenessService } from '../../../services/awareness.service';
import { Surveillance } from '../../../models/Surveillance.model';
import { ApiService } from '../../../services/api/api.service';
import { ApiResponseStatus } from '../../../interfaces/IAuth.model';
import { AuthenticationService } from '../../../services/authentication.service';
import { Page } from 'src/app/interfaces/IPage.Model';
import { FileResource } from 'src/app/interfaces/IFile.Model';
import { CommunicationService } from 'src/app/services/communication.service';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-composites',
  templateUrl: './composite.component.html',
})
export class CompositeComponent implements OnInit {
  Surveillance: Surveillance[] = [];
  TableHeaders: string[] = [
    'original_filename',
    'state',
    'type',
    'created_at',
    'actions',
  ];
  fileStates: string[] = [
    'Pending Processing',
    'Validating',
    'Rejected',
    'Processing',
    'Validated',
  ];

  resources = new MatTableDataSource<FileResource>([]);
  userRole: string;

  private searchQuery$ = new Subject<string>();

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: '',
  };

  latestSearchTerm: string = '';
  page: Page = {
    count: 0,
    limit: 10,
    next: null,
    prev: null,
  };

  constructor(
    private awareness: AwarenessService,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private communicationService: CommunicationService,
  ) {}

  ngOnInit(): void {
    this.userRole = this.authenticationService.getCurrentUserRole();
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

  loadComposites({
    searchQuery = null,
    page = null,
  }: { searchQuery?: string; page?: string } = {}) {
    this.ApiResponseStatus.processing = true;
    const userData = this.awareness.getUserData();

    let url = '';

    if (searchQuery) {
      url = `files/uploads?user_id=${userData.id}&sort=-created_at&page[limit]=${this.page.limit}&filter[name_matches][input][search]=${searchQuery}`;
    } else if (page === 'next') {
      let temp = this.page.next.split('?')[1];
      url = `files/uploads?${temp}`;
    } else if (page === 'prev') {
      let temp = this.page.prev.split('?')[1];
      url = `files/uploads?${temp}`;
    } else {
      url = `files/uploads?user_id=${userData.id}&sort=-created_at&page[limit]=${this.page.limit}`;
    }

    this.apiService.get(url).subscribe({
      next: (res) => {
        let files = res.data.map((item) => {
          return { ...item.attributes, ...{ id: item.id } } as FileResource;
        });

        this.resources = new MatTableDataSource<FileResource>(files);

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
        this.ApiResponseStatus.success = false;
        this.ApiResponseStatus.processing = false;

        this.communicationService.showToast(
          'Something went wrong. Kindly try again.',
        );
      },
      complete: () => {
        this.ApiResponseStatus.processing = false;
        this.ApiResponseStatus.success = true;
      },
    });
  }

  parseDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString();
  }

  getValidityStatus(status: boolean): string {
    if (status === true) {
      return 'Valid';
    }
    return 'Invalid';
  }

  formatState(element: any) {
    if (element.type === 'resource') {
      return '-';
    } else {
      // Remove underscores and convert to sentence case
      return element.state
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
    }
  }

  onPageChanged(event: PageEvent) {
    if (event.pageSize != this.page.limit) {
      this.page.limit = event.pageSize;
      this.loadComposites();

      return;
    }

    if (event.pageIndex > event.previousPageIndex) {
      this.loadComposites({ page: 'next' });
    } else if (event.previousPageIndex > event.pageIndex) {
      this.loadComposites({ page: 'prev' });
    }
  }
}
