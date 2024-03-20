import {Component, OnInit} from '@angular/core';
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

export class SplashComponent implements OnInit{

  constructor(private router: Router, private awareness: AwarenessService, private communication: CommunicationService) {
  }

  ngOnInit(): void {
    this.awareness.awaken(() => {
      this.awareness.UserInstance._id = this.awareness.getFocused("authenticated");
      this.router.navigate(['/home']);
    });
  }
}
