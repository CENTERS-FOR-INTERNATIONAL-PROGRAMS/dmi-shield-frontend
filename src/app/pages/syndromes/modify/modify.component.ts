import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CompositeFormControls } from 'src/app/models/CompositeFormControls.model';
import { Syndrome } from 'src/app/models/Syndrome.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import { v1 as uuidv4, v1 } from 'uuid';

@Component({
  selector: 'modify',
  templateUrl: './modify.component.html'
})

export class ModifyComponent implements OnInit {
  SyndromeInstance = new Syndrome();
  SyndromeFormControls: CompositeFormControls = {};

  constructor(private awareness: AwarenessService) {

  }

  ngOnInit(): void {
    //Prerequisites
    let instance = this;
    this.seedInstance();
    let focused_syndrome = this.awareness.getFocused("syndrome");

    if (focused_syndrome == "") {
      this.SyndromeInstance._action = "create";
      this.SyndromeInstance._id = this.awareness.setFocused("syndrome", v1());
    } else {
      this.SyndromeInstance._id = focused_syndrome;
      this.SyndromeInstance._action = "edit";

      this.SyndromeInstance.acquireInstance((doc: any) => {
        this.SyndromeInstance.parseInstance(doc);
      }, (err: any) => {
        // TODO! Handle errors
        console.log(err);
      });
    }
  }

  seedInstance() {
    this.SyndromeFormControls = {};
    this.SyndromeFormControls["syndrome_name"] = new FormControl('', [Validators.required]);
    this.SyndromeFormControls["syndrome_description"] = new FormControl('', []);
  }

  validateInstance(): boolean {
    let is_valid = true;

    Object.keys(this.SyndromeFormControls).forEach(fc_key => {
      if (this.SyndromeFormControls[fc_key].hasError("required")) {
        is_valid = false;
      }
    });

    return is_valid;
  };

  submitInstance(): void {
    if (this.validateInstance()) {
      this.SyndromeInstance.putInstance();
    } else {
      // TODO! Handle errors
      console.log("Missing fields!", this.SyndromeInstance);
    }
  }
}