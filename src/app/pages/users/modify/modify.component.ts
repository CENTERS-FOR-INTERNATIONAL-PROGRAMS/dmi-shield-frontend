import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CompositeFormControls } from 'src/app/models/CompositeFormControls.model';
import { User } from 'src/app/models/User.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'modify',
  templateUrl: './modify.component.html',
})
export class ModifyComponent implements OnInit {
  UserInstance = new User();
  UserFormControls: CompositeFormControls = {};

  constructor(
    private awareness: AwarenessService,
    private communication: CommunicationService,
  ) {}

  ngOnInit(): void {
    this.seedInstance();
    this.initialize();

    this.awareness.awaken(() => {});
  }

  initialize() {
    this.UserInstance.id = this.awareness.getFocused('user');
  }

  seedInstance() {
    this.UserFormControls['user_name'] = new FormControl('', [
      Validators.required,
    ]);
    this.UserFormControls['user_email'] = new FormControl('', [
      Validators.required,
    ]);
  }

  submitInstance(): void {
    let is_valid = true;

    // #region Validate fields
    Object.keys(this.UserFormControls).forEach((fc_key) => {
      if (this.UserFormControls[fc_key].hasError('required')) {
        is_valid = false;
        return;
      }
    });
    // #endregion
  }
}
