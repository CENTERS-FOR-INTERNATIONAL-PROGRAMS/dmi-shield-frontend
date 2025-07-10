import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiResponse, UserRegisterData } from '../../../interfaces/IAuth.model';
import { AwarenessService } from '../../../services/awareness.service';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class AppSideRegisterComponent implements OnInit {
  hide: boolean = true;
  registrationForm!: FormGroup;
  userData: UserRegisterData;
  errors: string[] = [];

  constructor(
    private router: Router,
    private awareness: AwarenessService,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.registrationForm = new FormGroup(
      {
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirm_password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
      },

      this.passwordMatch('password', 'confirm_password'),
    );
  }

  ApiResponseStatus: ApiResponse = {
    error: false,
    result: null,
    processing: false,
    message: '',
  };

  passwordMatch(password: string, confirmPassword: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const passwordControl = formGroup.get(password);
      const confirmPasswordControl = formGroup.get(confirmPassword);

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['passwordMismatch']
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }

  registerUser() {
    if (!this.registrationForm.valid) return;

    this.ApiResponseStatus.processing = true;

    this.userData = {
      data: {
        attributes: {
          email: this.registrationForm.get('email').value,
          name: this.registrationForm.get('name').value,
          password: this.registrationForm.get('password').value,
        },
        type: 'User Authentication',
      },
    };

    this.apiService
      .postRequest('auth/user/password/register', this.userData)
      .subscribe({
        next: (response) => {
          if (response.data.attributes.user && response.data.attributes.token) {
            this.awareness.saveToken(response.data.attributes.token);
            this.awareness.saveUserData(response.data.attributes.user);

            this.ApiResponseStatus.processing = false;
            this.router.navigate(['/users/me']);
          } else if (response.errors[0].detail) {
            this.ApiResponseStatus.processing = false;
            throw new Error(response.errors[0].detail);
          }
        },
        error: ({ error }) => {
          this.ApiResponseStatus.processing = false;
          this.ApiResponseStatus.error = true;
          if (error.errors && error.errors.length > 0) {
            let error_message = error.errors[0].detail;

            if (error.errors.length > 1) {
              [...error.errors.slice(1)].forEach((e) => {
                let error_detail = e.detail;
                let error_path = e.source?.pointer?.split('/');
                let error_field = error_path[error_path.length - 1];

                this.errors.push(`${error_field} ${error_detail}`);
              });
            }

            this.ApiResponseStatus.error = true;
            this.ApiResponseStatus.message = error_message;
          }
        },
      });
  }
}
