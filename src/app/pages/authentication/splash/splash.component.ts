import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompositeFormControls } from 'src/app/models/CompositeFormControls.model';
import { User } from 'src/app/models/User.model';
import { AwarenessService } from 'src/app/services/awareness.service';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'splash',
  templateUrl: './splash.component.html',
})

export class SplashComponent {

  constructor(private router: Router, private awareness: AwarenessService, private communication: CommunicationService) {
  }

  ngOnInit(): void {
    this.awareness.awaken(() => {
      this.awareness.UserInstance._id = this.awareness.getFocused("authenticated");

      // User authenticated
      if (this.awareness.UserInstance._id != "") {
        this.awareness.UserInstance.acquireInstance((doc: any) => {
          this.awareness.UserInstance.parseInstance(doc);

          this.awareness.syncFromRemote(['mforms', 'mfields', 'fforms', 'ffields']);
          this.router.navigate(['/dashboard']);
        }, (err: any) => {
          // TODO! Handle errors          
        });
      }

      // No user authenticated
      else {
        this.router.navigate(['/authentication/login']);
      }
    });
  }
}
