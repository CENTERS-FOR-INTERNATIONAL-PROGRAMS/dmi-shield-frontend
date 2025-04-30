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
import { Router } from '@angular/router';
import { ThresholdAlert } from 'src/app/interfaces/IThreshold.model';
import { User } from 'src/app/models/User.model';
import { ApiService } from 'src/app/services/api/api.service';
import { AwarenessService } from 'src/app/services/awareness.service';

@Component({
  selector: 'alert-form',
  templateUrl: './alert.form.component.html',
})
export class AlertFormComponent implements OnInit, OnChanges {
  users: User[] = [];
  selectedUserIds: string[] = [];
  searchQuery: string = '';

  @Input() buttonLabel: string = 'Create';
  @Input() alert: ThresholdAlert | null;
  @Output() showLoader = new EventEmitter<boolean>();
  @Output() formSubmit = new EventEmitter<string[]>();

  constructor(
    private awareness: AwarenessService,
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['alert'] && changes['alert'].currentValue) {
      this.alert = changes['alert'].currentValue;

      requestAnimationFrame(() => {
        this.selectedUserIds = this.alert.user_ids;
        this.loadUsers();
      });
    }
  }

  loadUsers() {
    this.showLoader.emit(true);

    const userData = this.awareness.getUserData();

    if (!userData) {
      this.router.navigate(['/authentication/login']);
      return;
    }

    const url = `user?limit=100&sort=-created_at`;

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
}
