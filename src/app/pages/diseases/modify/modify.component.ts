import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CompositeFormControls } from 'src/app/models/CompositeFormControls.model';
import { Disease } from 'src/app/models/Disease.model';
import { Syndrome } from 'src/app/models/Syndrome.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import { v1 as uuidv4, v1 } from 'uuid';

@Component({
  selector: 'modify',
  templateUrl: './modify.component.html'
})

export class ModifyComponent implements OnInit {
  FocusedSyndrome: Syndrome = new Syndrome();
  DiseaseInstance: Disease = new Disease();
  DiseaseFormControls: CompositeFormControls = {};

  constructor(private awareness: AwarenessService) {

  }

  ngOnInit(): void {
    // Acquire focused {Syndrome}
    this.FocusedSyndrome._id = this.awareness.getFocused("syndrome");
    this.FocusedSyndrome.acquireInstance((doc: any) => {
      this.FocusedSyndrome.parseInstance(doc);
    }, (err: any) => {
      // TODO! Handle errors
      console.log(err);
    });

    // Prerequisites
    this.seedInstance();
    let focused_disease = this.awareness.getFocused("disease");

    if (focused_disease == "") {
      this.DiseaseInstance._action = "create";
      this.DiseaseInstance._id = this.awareness.setFocused("disease", v1());
    } else {
      this.DiseaseInstance._id = focused_disease;
      this.DiseaseInstance._action = "edit";

      this.DiseaseInstance.acquireInstance((doc: any) => {
        this.DiseaseInstance.parseInstance(doc);
      }, (err: any) => {
        // TODO! Handle errors
        console.log(err);
      });
    }
  }

  seedInstance() {
    this.DiseaseFormControls = {};
    this.DiseaseFormControls["disease_name"] = new FormControl('', [Validators.required]);
    this.DiseaseFormControls["disease_description"] = new FormControl('', []);
  }

  validateInstance(): boolean {
    let is_valid = true;

    Object.keys(this.DiseaseFormControls).forEach(fc_key => {
      if (this.DiseaseFormControls[fc_key].hasError("required")) {
        is_valid = false;
      }
    });

    return is_valid;
  };

  submitInstance(): void {
    if (this.validateInstance()) {
      if (this.FocusedSyndrome._id != "") {
        this.DiseaseInstance.disease_syndrome_id = this.FocusedSyndrome._id;
        this.DiseaseInstance.putInstance();
      } else {
        // TODO! Handle errors
        console.log("Missing parent!");
      }
    } else {
      // TODO! Handle errors
      console.log("Missing fields!", this.DiseaseInstance);
    }
  }
}