import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AwarenessService } from './awareness.service';

@Injectable({ providedIn: 'root' })
export class CommunicationService {
  constructor(
    private awareness: AwarenessService,
    private snackbar_instance: MatSnackBar,
  ) {}

  showToast(message: string, action: string = 'Close') {
    this.snackbar_instance.open(message, action, {
      duration: 3000,
    });
  }

  showSuccessToast() {
    this.snackbar_instance.open('Success', 'Close', {
      duration: 3000,
    });
  }

  showFailedToast() {
    this.snackbar_instance.open('Failed', 'Close', {
      duration: 3000,
    });
  }

  showMissingFieldsSnackbar() {
    this.snackbar_instance.open(
      'Kindly fill in all the required fields!',
      'Close',
      {
        duration: 3000,
      },
    );
  }
}
