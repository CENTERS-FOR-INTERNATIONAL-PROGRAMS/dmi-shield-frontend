import { Component, OnInit } from '@angular/core';
import { AwarenessService } from '../../../services/awareness.service';
import { CommunicationService } from '../../../services/communication.service';
import { User } from '../../../models/User.model';
import { ApiResponseStatus } from 'src/app/interfaces/IAuth.model';
import { ApiService } from '../../../services/api/api.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { FileResource } from 'src/app/interfaces/IFile.Model';
import { Page } from 'src/app/interfaces/IPage.Model';
import { debounceTime, Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-composite',
  templateUrl: './composite.component.html',
  styleUrls: ['./composite.component.scss'],
})
export class CompositeComponent implements OnInit {
  resources: FileResource[] = [];

  TableHeaders: string[] = ['original_filename', 'actions'];

  private searchQuery$ = new Subject<string>();

  currentUser: User = new User();
  userRole: string;

  latestSearchTerm: string = '';
  page: Page = {
    count: 0,
    limit: 10,
    next: null,
    prev: null,
  };

  ApiResponseStatus: ApiResponseStatus = {
    success: null,
    result: null,
    processing: false,
    message: '',
  };

  constructor(
    public awareness: AwarenessService,
    private communicationService: CommunicationService,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
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

  openUrl(url: string) {
    if (
      !this.awareness.currentUser?.role ||
      this.awareness.currentUser?.role === 'level1' ||
      this.awareness.currentUser?.role === 'guest'
    ) {
      this.communicationService.showToast(
        'Sorry, you are not authorised to download the file.',
      );
      return;
    }
    window.open(url, '_blank');
  }

  concatenate(text, limit) {
    if (text) {
      return text.length > limit ? `${text.slice(0, limit)}...` : text;
    }
  }

  loadComposites({
    searchQuery = null,
    page = null,
  }: { searchQuery?: string; page?: string } = {}) {
    let url = '';

    if (searchQuery) {
      url = `files/uploads/resources?&sort=-created_at&page[limit]=${this.page.limit}&filter[name_matches][input][search]=${searchQuery}`;
    } else if (page === 'next') {
      let temp = this.page.next.split('?')[1];
      url = `files/uploads/resources?${temp}`;
    } else if (page === 'prev') {
      let temp = this.page.prev.split('?')[1];
      url = `files/uploads/resources?${temp}`;
    } else {
      url = `files/uploads/resources?&sort=-created_at&page[limit]=${this.page.limit}`;
    }

    this.ApiResponseStatus.processing = true;
    this.apiService.get(url).subscribe({
      next: (res) => {
        this.ApiResponseStatus.success = true;

        this.resources = res.data.map((item) => {
          return { ...item.attributes, ...{ id: item.id } } as FileResource;
        });

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
