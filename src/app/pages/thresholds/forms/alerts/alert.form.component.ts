import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatListOption, MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, Subject } from 'rxjs';
import { Page } from 'src/app/interfaces/IPage.Model';
import { ThresholdAlert } from 'src/app/interfaces/IThreshold.model';
import { User } from 'src/app/models/User.model';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'alert-form',
  templateUrl: './alert.form.component.html',
})
export class AlertFormComponent implements OnInit, OnChanges {
  users: User[] = [];
  selectedUserIds: string[] = [];

  latestSearchTerm: string = '';
  page: Page = {
    count: 0,
    limit: 50,
    next: null,
    prev: null,
  };

  private searchQuery$ = new Subject<string>();

  @Input() buttonLabel: string = 'Create';
  @Input() alert: ThresholdAlert | null;
  @Output() showLoader = new EventEmitter<boolean>();
  @Output() formSubmit = new EventEmitter<string[]>();

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadUsers();

    this.searchQuery$.pipe(debounceTime(500)).subscribe((term) => {
      this.loadUsers({ searchQuery: term });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['alert'] && changes['alert'].currentValue) {
      this.alert = changes['alert'].currentValue;
      this.selectedUserIds = this.alert.user_ids ?? this.selectedUserIds;
      this.users.forEach((user) => {
        user.selected = this.selectedUserIds.includes(user.id);
      });
    }
  }

  onSearch(event: Event): void {
    let term = (event.target as HTMLInputElement).value;
    this.latestSearchTerm = term;
    this.searchQuery$.next(term);
  }

  loadUsers({
    searchQuery = null,
    page = null,
  }: { searchQuery?: string; page?: string } = {}) {
    this.showLoader.emit(true);

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
        let users = res.data.map((e: any) => {
          return {
            ...e.attributes,
            ...{ id: e.id },
            ...{ selected: this.selectedUserIds.includes(e.id) },
          } as User;
        });

        this.users = users;

        this.page = {
          ...this.page,
          ...{
            next: res.links.next || res.links.prev,
            prev: res.links.prev || res.links.next,
            count: res.meta.page.total,
          },
        };

        this.showLoader.emit(false);
      },
      error: (error) => {
        this.showLoader.emit(false);
      },
      complete: () => {
        this.showLoader.emit(false);
      },
    });
  }

  onUsersSelected(e: MatSelectionListChange) {
    let users = e.source.selectedOptions.selected.map(
      (o: MatListOption) => o.value,
    );
    this.selectedUserIds = users;
  }

  onSubmit() {
    if (this.selectedUserIds.length == 0) return;

    this.formSubmit.emit(this.selectedUserIds);
  }

  onPageChanged(event: PageEvent) {
    if (event.pageSize != this.page.limit) {
      this.page.limit = event.pageSize;
      this.loadUsers();
      return;
    }
    if (event.pageIndex > event.previousPageIndex) {
      this.loadUsers({ page: 'next' });
    } else if (event.previousPageIndex > event.pageIndex) {
      this.loadUsers({ page: 'prev' });
    }
  }
}
