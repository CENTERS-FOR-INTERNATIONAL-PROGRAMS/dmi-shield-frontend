import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CompositeFormControls } from 'src/app/models/CompositeFormControls.model';
import { User } from 'src/app/models/User.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'modify',
  templateUrl: './modify.component.html'
})

export class ModifyComponent implements OnInit {
  UserInstance = new User();
  UserFormControls: CompositeFormControls = {};

  constructor(private awareness: AwarenessService, private communication: CommunicationService) {

  }

  ngOnInit(): void {
    this.seedInstance();

    this.awareness.awaken(() => {
      this.initialize();
    });
  }

  initialize() {
    this.UserInstance._id = this.awareness.getFocused("user");

    if (this.UserInstance._id != "") {
      this.UserInstance.acquireInstance((doc: any) => {
        this.UserInstance.parseInstance(doc);
      }, (err: any) => {
        // TODO! Handle errors
      });
    }
  }

  seedInstance() {
    this.UserFormControls["user_name"] = new FormControl('', [Validators.required]);
    this.UserFormControls["user_email"] = new FormControl('', [Validators.required]);
  }

  submitInstance(): void {
    let is_valid = true;

    // #region Validate fields
    Object.keys(this.UserFormControls).forEach(fc_key => {
      if (this.UserFormControls[fc_key].hasError("required")) {
        is_valid = false;
        return;
      }
    });
    // #endregion

    // if (is_valid) {
    //   this.UserInstance.putInstance((res: any) => {
    //     this.communication.showSuccessToast();
    //
    //     if (this.UserInstance._id == this.awareness.UserInstance._id) {
    //       this.awareness.UserInstance.acquireInstance((doc: any) => {
    //         this.awareness.UserInstance.parseInstance(doc);
    //       }, (err: any) => {
    //         // TODO! Handle errors
    //       });
    //     }
    //   }, (err: any) => {
    //     this.communication.showFailedToast();
    //   });
    // } else {
    //   this.communication.showToast("Kindly fill in all required fields!");
    // }
  }

}
