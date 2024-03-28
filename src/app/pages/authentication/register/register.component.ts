import {Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {CompositeFormControls} from "../../../models/CompositeFormControls.model";
import {User} from "../../../models/User.model";
import {CommunicationService} from "../../../services/communication.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class AppSideRegisterComponent implements OnInit{

  hide: boolean = true;
  UserInstance: User = new User();
  UserFormControls: CompositeFormControls = {};
  user_password: string = "";
  confirm_password: string = "";
  constructor(private router: Router, private communication: CommunicationService) { }

  // form = new FormGroup({
  //   uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
  //   email: new FormControl('', [Validators.required]),
  //   password: new FormControl('', [Validators.required]),
  // });
  // get f() {
  //   return this.form.controls;
  // }

  ngOnInit(): void {
    this.UserFormControls["user_name"] = new FormControl('', [Validators.required]);
    this.UserFormControls["user_email"] = new FormControl('', [Validators.required, Validators.email]);
    this.UserFormControls["user_password"] = new FormControl('', [Validators.required]);
    this.UserFormControls["confirm_password"] = new FormControl('', [Validators.required, this.confirmPasswordValidator.bind(this)]);
  }

  confirmPasswordValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value !== this.UserFormControls['user_password'].value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  validateInstance(): boolean {
    let is_valid = true;

    // Validate required fields
    Object.keys(this.UserFormControls).forEach(fc_key => {
      if (this.UserFormControls[fc_key].hasError("required") ||
        this.UserFormControls[fc_key].hasError("email")) {
        is_valid = false;
      }
    });

    return is_valid;
  }

  submitInstance(): void {
    if (this.validateInstance()) {
      this.UserInstance.putInstance((res: any) => {
        this.router.navigate(["/authentication"]);
        this.communication.showToast("Success! Check your email for more information.");
      }, (err: any) => {
        this.communication.showFailedToast();
      }, this.user_password, "~");
    } else {
      this.communication.showToast("Please fill all the required fields!");
    }
  }



  submit() {
    // console.log(this.form.value);
    this.router.navigate(['/dashboard']);
  }
}
